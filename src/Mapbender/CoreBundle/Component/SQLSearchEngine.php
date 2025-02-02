<?php

namespace Mapbender\CoreBundle\Component;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Mapbender\CoreBundle\Utils\ArrayUtil;
use Monolog\Logger;

class SQLSearchEngine
{
    public function __construct(
        protected Logger          $logger,
        protected ManagerRegistry $registry)
    {
    }

    /**
     * SQL Autocomplete method
     *
     * @param array $config Search configuration
     * @param String $key Autocomplete field nme
     * @param String $value Autocomplete value
     * @param string[] $properties All form values
     * @param String $srs Current map SRS
     * @param array $extent Current map extent
     * @return array              Autocomplete suggestions
     * @todo Make like search configurable (exact, left, right, both)
     * @todo Make case invariant configurable
     * @todo Limit results
     *
     */
    public function autocomplete($config, $key, $value, $properties, $srs, $extent)
    {
        $connection = $this->getConnection($config);
        $qb = $connection->createQueryBuilder();
        $fieldConfig = $this->getFormFieldConfig($config, $key);

        $qb->select("DISTINCT t.{$connection->quoteIdentifier($key)}");

        // Add FROM
        $qb->from($config['class_options']['relation'], 't');

        // Build WHERE condition
        $qb->where($this->getTextMatchExpression($connection, $key, $value, 'ilike', $qb));
        if ($srs && $extent && !empty($config['class_options']['geometry_attribute'])) {
            $geomColumn = 't.' . $connection->quoteIdentifier(trim($config['class_options']['geometry_attribute'], '"'));
            $qb->andWhere($this->getBoundsExpression($qb, $geomColumn, $extent, $srs, $config));
        }

        if (!empty($fieldConfig['options']['attr']['data-autocomplete-using'])) {
            $otherProps = explode(',', $fieldConfig['options']['attr']['data-autocomplete-using']);
            foreach ($otherProps as $otherProp) {
                if (strlen($properties[$otherProp] ?? null)) {
                    $qb->andWhere($this->getTextMatchExpression($connection, $otherProp, $properties[$otherProp], 'ilike-right', $qb));
                } else {
                    $this->logger->warning('Key "' . $otherProp . '" for autocomplete-using does not exist in data.');
                }
            }
        }

        $qb->orderBy('t.' . $connection->quoteIdentifier($key), 'ASC');

        $stmt = $qb->executeQuery()->fetchAllAssociative();
        $dataOut = array();
        foreach ($stmt as $row) {
            if (!array_key_exists($key, $row)) {
                $value = $row[trim($key, '"')];
            } else {
                $value = $row[$key];
            }
            $dataOut[] = array(
                'value' => $value,
            );
        }
        return $dataOut;
    }

    /**
     * Actual SQL search method
     *
     * @param array $config Search configuration
     * @param array $data Form data
     * @param string $srs Search extent SRS
     * @param array $extent Search extent
     * @return array         Search results
     * @todo Paging
     *
     * @todo Make like search configurable (exact, left, right, both)
     * @todo Make case invariant configurable
     */
    public function search($config, $data, $srs, $extent)
    {
        $options = $config['class_options'];
        $connection = $this->getConnection($config);
        $qb = $connection->createQueryBuilder();
        $selectExpressions = array();
        foreach ($options['attributes'] as $columName) {
            $selectExpressions[] = 't.' . $connection->quoteIdentifier(trim($columName, '"'));
        }
        // add geometry
        $geomColumn = 't.' . $connection->quoteIdentifier(trim($options['geometry_attribute'], '"'));
        $srsId = $this->srsIdFromName($srs);
        $srsParamPlaceholder = $qb->createNamedParameter($srsId);
        $geomTransformed = "ST_Transform({$geomColumn}, {$srsParamPlaceholder}::int)";
        $selectExpressions[] = "ST_AsGeoJSON({$geomTransformed}) as geom";

        $qb->select(implode(', ', $selectExpressions));
        // Add FROM
        $qb->from($config['class_options']['relation'], 't');

        foreach ($data['form'] as $key => $value) {
            if (!\strlen($value)) {
                continue;
            }
            $fieldConfig = $this->getFormFieldConfig($config, $key);
            $matchMode = ArrayUtil::getDefault($fieldConfig, 'compare', 'ilike');
            $qb->andWhere($this->getTextMatchExpression($connection, $key, $value, $matchMode, $qb));
        }
        if ($srs && $extent) {
            $qb->andWhere($this->getBoundsExpression($qb, $geomColumn, $extent, $srs, $config));
        }

        $stmt = $qb->executeQuery()->fetchAllAssociative();
        return $this->rowsToGeoJson($stmt);
    }

    /**
     * @param array|\Traversable $rows
     * @return array
     */
    protected static function rowsToGeoJson($rows)
    {
        $features = array();
        foreach ($rows as $row) {
            if (!$row['geom']) {
                continue;
            }
            $geometry = @json_decode($row['geom'], true);
            if (!$geometry) {
                continue;
            }
            unset($row['geom']);
            $features[] = array(
                'type' => 'Feature',
                'properties' => $row,
                'geometry' => $geometry,
            );
        }
        return $features;
    }

    protected function getConnection($config): Connection
    {
        $connectionName = $config['class_options']['connection'] ?: 'default';
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return $this->registry->getConnection($connectionName);
    }

    protected function getTextMatchExpression(Connection $connection, string $key, $value, string $mode, QueryBuilder $qb): mixed
    {
        switch ($mode) {
            case 'exact':
            case 'like':
            case 'like-left':
            case 'like-right':
                $caseInsensitive = false;
                break;
            default:
            case 'iexact':
            case 'ilike':
            case 'ilike-left':
            case 'ilike-right':
                $caseInsensitive = true;
                break;
        }
        switch ($mode) {
            default:
            case 'ilike':
            case 'like':
                $patternPrefix = '%';
                $patternSuffix = '%';
                break;
            case 'ilike-left':
            case 'like-left':
                $patternPrefix = '%';
                $patternSuffix = '';
                break;
            case 'ilike-right':
            case 'like-right':
                $patternPrefix = '';
                $patternSuffix = '%';
                break;
            case 'exact':
            case 'iexact':
                $patternPrefix = '';
                $patternSuffix = '';
                break;
        }
        $matchValue = strtr($value, array(
            '%' => '\%',
            '_' => '\_',
        ));
        $matchValue = "{$patternPrefix}{$matchValue}{$patternSuffix}";
        $placeHolder = $qb->createNamedParameter($matchValue);
        $referenceExpression = "t." . $connection->quoteIdentifier($key);
        $matchExpression = $placeHolder;
        if ($caseInsensitive) {
            $referenceExpression = "LOWER({$referenceExpression})";
            $matchExpression = "LOWER({$matchExpression})";
        }
        if (!$patternPrefix && !$patternSuffix) {
            return $qb->expr()->eq($referenceExpression, $matchExpression);
        } else {
            return $qb->expr()->like($referenceExpression, $matchExpression);
        }
    }

    /**
     * @param QueryBuilder $qb
     * @param string $geomReference
     * @param float[] $extent 4 values left / bottom / right / top
     * @param string $srsName
     * @return string
     */
    protected function getBoundsExpression(QueryBuilder $qb, $geomReference, $extent, $srsName, array $config)
    {
        // per default, the map extent is compared to a feature by converting both to EPSG:4326 (WGS84).
        // comparing in a non-global SRS (like UTM32) can result in errors when comparing it to an extent defined
        // in a global CRS. This may reduce performance, so the transformation to EPSG:4326 can be disabled
        // by passing noTransform:true to class_options
        $noTransform = isset($config['class_options']['noTransform']) && $config['class_options']['noTransform'];

        $boxPoints = array(
            'ST_Point(' . $qb->createNamedParameter($extent[0]) . ', ' . $qb->createNamedParameter($extent[1]) . ')',
            'ST_Point(' . $qb->createNamedParameter($extent[2]) . ', ' . $qb->createNamedParameter($extent[3]) . ')',
        );
        $srsId = $this->srsIdFromName($srsName);
        $box = 'ST_SetSRID(ST_MakeBox2D(' . implode(', ', $boxPoints) . '), ' . $qb->createNamedParameter($srsId) . ')';
        $transformedBox = $noTransform ? "ST_Transform({$box}, ST_Srid({$geomReference}))" : "ST_Transform($box, 4326)";
        return $noTransform ? "$transformedBox && $geomReference" : "$transformedBox && ST_Transform($geomReference, 4326)";
    }

    /**
     * Strips namespace prefix from given $srsName and returns the numeric srs id.
     * Only supports 'EPSG:' namespace prefix. If $srsName already is a plain number,
     * return it cast to integer but otherwise unchanged.
     *
     * @param $srsName
     * @return int
     */
    protected function srsIdFromName($srsName)
    {
        $parts = explode(':', $srsName);
        if (count($parts) === 1 && (strval(intval($parts[0])) === strval($parts[0])) && $parts[0]) {
            return intval($parts[0]);
        }
        if (count($parts) !== 2 || $parts[0] !== 'EPSG') {
            throw new \InvalidArgumentException("Unsupported srs name " . print_r($srsName, true));
        }
        return intval($parts[1]);
    }

    /**
     * @param array $config
     * @param string $key
     * @return array
     */
    protected static function getFormFieldConfig($config, $key)
    {
        if (!array_key_exists($key, $config['form'])) {
            return $config['form']['"' . $key . '"'];
        } else {
            return $config['form'][$key];
        }
    }
}
