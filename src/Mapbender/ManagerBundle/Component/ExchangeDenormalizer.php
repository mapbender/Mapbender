<?php
namespace Mapbender\ManagerBundle\Component;

use Doctrine\ORM\EntityManagerInterface;
use Mapbender\CoreBundle\Utils\EntityUtil;
use Mapbender\ManagerBundle\Component\Exchange\AbstractObjectHelper;
use Mapbender\ManagerBundle\Component\Exchange\ObjectHelper;
use Mapbender\ManagerBundle\Component\Exchange\EntityHelper;
use Mapbender\ManagerBundle\Component\Exchange\EntityPool;

/**
 *
 *
 * @author Paul Schmidt
 */
class ExchangeDenormalizer extends ExchangeHandler
{

    protected $data;

    /**
     * Creates an instance.
     * @param EntityManagerInterface $em
     * @param array §data
     */
    public function __construct(EntityManagerInterface $em, array $data)
    {
        parent::__construct($em);
        $this->data   = $data;
    }

    public function isReference($data, array $criteria)
    {
        return !array_diff_key($criteria, $data);
    }

    public function getEntityData($class, array $criteria)
    {
        if (isset($this->data[$class])) {
            foreach ($this->data[$class] as $item) {
                $found = true;
                foreach ($criteria as $key => $value) {
                    if (!array_key_exists($key, $item) || $item[$key] !== $value) {
                        $found = false;
                        break;
                    }
                }
                if ($found) {
                    return $item;
                }
            }
        }
        return null;
    }

    /**
     * @param EntityPool $entityPool
     * @param mixed $data
     * @return array|null|number|string|object
     * @throws \Doctrine\ORM\ORMException
     */
    public function handleData(EntityPool $entityPool, $data)
    {
        if ($className = $this->extractClassName($data)) {
            if ($entityInfo = EntityHelper::getInstance($this->em, $className)) {
                $identValues = $this->extractArrayFields($data, $entityInfo->getClassMeta()->getIdentifier());
                if ($this->isReference($data, $identValues)) {
                    if ($object = $entityPool->get($className, $identValues)) {
                        return $object;
                    } elseif ($objectData = $this->getEntityData($className, $identValues)) {
                        return $this->handleEntity($entityPool, $entityInfo, $objectData);
                    } else {
                        return null;
                    }
                } else {
                    return $this->handleEntity($entityPool, $entityInfo, $data);
                }
            } else {
                $classInfo = ObjectHelper::getInstance($className);
                return $this->handleClass($entityPool, $classInfo, $data);
            }
        } elseif (is_array($data)) {
            $result = array();
            foreach ($data as $key => $item) {
                $result[$key] = $this->handleData($entityPool, $item);
            }
            return $result;
        } elseif ($data === null || is_integer($data) || is_float($data) || is_string($data) || is_bool($data)) {
            return $data;
        } else {
            return null;
        }
    }

    /**
     * @param EntityPool $entityPool
     * @param EntityHelper $entityInfo
     * @param array $data
     * @return object|null
     * @throws \Doctrine\ORM\ORMException
     */
    protected function handleEntity(EntityPool $entityPool, EntityHelper $entityInfo, array $data)
    {
        $classMeta = $entityInfo->getClassMeta();
        $className = $classMeta->getName();
        $identFieldNames = $classMeta->getIdentifier();

        $setters = $entityInfo->getSetters();
        $object = new $className();
        $nonIdentifierFieldNames = array_diff($classMeta->getFieldNames(), $identFieldNames);
        foreach ($nonIdentifierFieldNames as $fieldName) {
            if (isset($data[$fieldName]) && array_key_exists($fieldName, $setters)) {
                $setter = $setters[$fieldName];
                $value = $this->handleData($entityPool, $data[$fieldName]);
                $fm    = $classMeta->getFieldMapping($fieldName);
                if ($fm['unique']) {
                    $value =
                        EntityUtil::getUniqueValue($this->em, $classMeta->getName(), $fm['columnName'], $value, '_imp');
                }
                $setter->invoke($object, $value);
            }
        }

        $this->em->persist($object);
        $entityPool->add($object, $this->extractArrayFields($data, $identFieldNames));

        foreach ($classMeta->getAssociationMappings() as $assocItem) {
            if ($this->isEntityClassBlacklisted($assocItem['targetEntity'])) {
                continue;
            }
            $assocFieldName = $assocItem['fieldName'];
            if (array_key_exists($assocFieldName, $setters) && isset($data[$assocFieldName])) {
                $setter = $setters[$assocFieldName];
                $result = $this->handleData($entityPool, $data[$assocItem['fieldName']]);
                if (is_array($result)) {
                    if (count($result)) {
                        $collection = new \Doctrine\Common\Collections\ArrayCollection($result);
                        $setter->invoke($object, $collection);
                    }
                } else {
                    $setter->invoke($object, $result);
                }
                $this->em->persist($object);
            }
        }
        return $object;
    }

    /**
     * @param EntityPool $entityPool
     * @param AbstractObjectHelper $classInfo
     * @param array $data
     * @return object
     * @throws \Doctrine\ORM\ORMException
     */
    protected function handleClass(EntityPool $entityPool, AbstractObjectHelper $classInfo, array $data)
    {
        $className = $classInfo->getClassName();
        $object = new $className();
        foreach ($classInfo->getSetters(array_keys($data)) as $propertyName => $setter) {
            if ($data[$propertyName] !== null) {
                $value = $this->handleData($entityPool, $data[$propertyName]);
                if (!is_array($value) || count($value)) {
                    $setter->invoke($object, $value);
                }
            }
        }
        return $object;
    }
}
