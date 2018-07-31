<?php
namespace Mapbender\ManagerBundle\Component;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\PersistentCollection;
use Doctrine\Common\Persistence\Mapping\MappingException;
use Mapbender\CoreBundle\Utils\ArrayUtil;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * ExchangeNormalizer class normalizes objects to array.
 *
 * @author Paul Schmidt
 */
class ExchangeNormalizer extends ExchangeSerializer
{

    protected $em;

    protected $export;

    protected $inProcess;

    /**
     * @param ContainerInterface $container container
     */
    public function __construct(ContainerInterface $container)
    {
        gc_enable();
        parent::__construct($container);
        $this->em = $this->container->get('doctrine')->getManager();
        $this->em
            ->getConnection()
            ->getConfiguration()
            ->setSQLLogger(null);

        $this->export = array();
        $this->inProcess = array();
    }

    /**
     * @return array
     */
    public function getExport()
    {
        return $this->export;
    }

    /**
     * @param array   $objectData
     * @param  object $classMeta
     * @return bool
     */
    private function isInProcess(array $objectData, $classMeta)
    {
        $class = $classMeta->getReflectionClass()->getName();
        if (!isset($this->inProcess[$class])) {
            return false;
        }
        foreach ($this->inProcess[$class] as $array) {
            $idents = $classMeta->getIdentifier();
            $found = true;
            foreach ($idents as $ident) {
                $found = $found && $array[$ident] === $objectData[$ident];
            }
            if ($found) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param array  $objectData
     * @param object $classMeta
     */
    private function addInProcess(array $objectData, $classMeta)
    {
        $class = $classMeta->getReflectionClass()->getName();
        if (!isset($this->inProcess[ $class ])) {
            $this->inProcess[ $class ] = array();
        }
        if (!$this->isInProcess($objectData, $classMeta)) {
            $this->inProcess[ $class ][] = $objectData;
        }
    }

    /**
     * @param array  $objectData
     * @param object $classMeta
     * @return bool
     */
    private function isExported(array $objectData, $classMeta)
    {
        $class = $classMeta->getReflectionClass()->getName();
        if (!isset($this->export[$class])) {
            return false;
        }
        foreach ($this->export[$class] as $array) {
            $idents = $classMeta->getIdentifier();
            $subfound = true;
            foreach ($idents as $ident) {
                $subfound = $subfound && $array[$ident] === $objectData[$ident];
            }
            if ($subfound) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param array  $objectData
     * @param object $classMeta
     */
    private function addExport(array $objectData, $classMeta)
    {
        $class = $classMeta->getReflectionClass()->getName();
        if (!isset($this->export[$class])) {
            $this->export[$class] = array();
        }
        if (!$this->isExported($objectData, $classMeta)) {
            $this->export[$class][] = $objectData;
        }
    }

    /**
     * @param object             $object
     * @param ClassMetadata|null $classMeta
     * @return array
     */
    private function handleIdentParams($object, ClassMetadata $classMeta = null)
    {
        if (!$classMeta) {
            $classMeta = $this->getClassMetadata($this->getRealClass($object));
        }
        $params = $this->getIdentCriteria($object, $classMeta);
        return $this->createInstanceIdent($object, $params);
    }

    /**
     * Normalizes an array.
     *
     * @param array $array array
     * @return array normalized array
     */
    private function handleArray($array)
    {
        $result = array();
        foreach ($array as $key => $item) {
            $result[$key] = $this->handleValue($item);
        }
        return $result;
    }

    /**
     * @param $value
     * @return array|string
     */
    public function handleValue($value)
    {
        if ($value === null || is_integer($value) || is_float($value) || is_string($value) || is_bool($value)) {
            return $value;
        } elseif (is_array($value)) {
            return $this->handleArray($value);
        } elseif (is_object($value)) {
            $realClass = $this->getRealClass($value);
            try {
                $this->em->getRepository($realClass);
                return $this->normalizeEntity($value, $this->getClassMetadata($realClass));
            } catch (MappingException $e) {
                return $this->normalizeObject($value, $this->getReflectionClass($realClass));
            }
        } else {
            return 'unsupported';
        }
    }

    /**
     * @param object $object
     * @param ClassMetadata $classMeta
     * @return array
     */
    public function normalizeEntity($object, ClassMetadata $classMeta)
    {
        $this->em
            ->getConnection()
            ->getConfiguration()
            ->setSQLLogger(null);
        gc_enable();
        $this->em->refresh($object);
        $data = $this->handleIdentParams($object, $classMeta);
        $this->addInProcess($data, $classMeta);
        foreach ($classMeta->getFieldNames() as $fieldName) {
            if (!in_array($fieldName, $classMeta->getIdentifier())
                && $getMethod = $this->getReturnMethod($fieldName, $classMeta->getReflectionClass())) {
                $data[$fieldName] = $this->handleValue($getMethod->invoke($object));
            }
        }
        foreach ($classMeta->getAssociationMappings() as $assocItem) {
            $fieldName = $assocItem['fieldName'];
            if ($getMethod = $this->getReturnMethod($fieldName, $classMeta->getReflectionClass())) {
                $subObject = $getMethod->invoke($object);
                if (!$subObject) {
                    $data[$fieldName] = null;
                } elseif ($subObject instanceof PersistentCollection) {
                    $data[$fieldName] = array();
                    foreach ($subObject as $item) {
                        $ident = $this->handleIdentParams($item);
                        $data[$fieldName][] = $ident;
                        $itemRealClass = $this->getRealClass($item);
                        $itemClassMeta = $this->getClassMetadata($itemRealClass);
                        if (!$this->isInProcess($ident, $itemClassMeta)) {
                            $this->normalizeEntity($item, $itemClassMeta);
                        }
                    }
                } else {
                    $data[$fieldName] = $this->handleIdentParams($subObject);
                    $subObjectRealClass = $this->getRealClass($subObject);
                    $subObjectClassMeta = $this->getClassMetadata($subObjectRealClass);
                    if (!$this->isInProcess($data[$fieldName], $subObjectClassMeta)) {
                        $this->normalizeEntity($subObject, $subObjectClassMeta);
                    }
                }
            }
        }
        $this->addExport($data, $classMeta);
        gc_collect_cycles();
        return $data;
    }

    public function normalizeObject($object, \ReflectionClass $class)
    {
        $data = $this->createInstanceIdent($object);
        foreach ($class->getProperties() as $property) {
            if ($getMethod = $this->getReturnMethod($property->getName(), $class)) {
                $data[$property->getName()] = $this->handleValue($getMethod->invoke($object));
            }
        }
        gc_collect_cycles();
        return $data;
    }
}
