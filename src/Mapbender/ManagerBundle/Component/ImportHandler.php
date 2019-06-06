<?php
namespace Mapbender\ManagerBundle\Component;

use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\ORMException;
use FOM\UserBundle\Component\AclManager;
use Mapbender\CoreBundle\Component\ElementFactory;
use Mapbender\CoreBundle\Component\Exception\ElementErrorException;
use Mapbender\CoreBundle\Entity\Application;
use Mapbender\CoreBundle\Entity\Source;
use Mapbender\ManagerBundle\Component\Exception\ImportException;
use Mapbender\ManagerBundle\Component\Exchange\EntityHelper;
use Mapbender\ManagerBundle\Component\Exchange\EntityPool;
use Symfony\Component\Security\Acl\Domain\ObjectIdentity;
use Symfony\Component\Security\Acl\Domain\UserSecurityIdentity;
use Symfony\Component\Security\Acl\Exception\InvalidDomainObjectException;
use Symfony\Component\Security\Acl\Model\EntryInterface;
use Symfony\Component\Security\Acl\Model\MutableAclInterface;
use Symfony\Component\Security\Acl\Model\MutableAclProviderInterface;
use Symfony\Component\Security\Acl\Permission\MaskBuilder;
use Symfony\Component\Yaml\Yaml;

/**
 * Description of ImportHandler
 *
 * @author Paul Schmidt
 */
class ImportHandler extends ExchangeHandler
{
    /** @var ElementFactory */
    protected $elementFactory;
    /** @var MutableAclProviderInterface */
    protected $aclProvider;
    /** @var AclManager */
    protected $aclManager;

    /**
     * @inheritdoc
     */
    public function __construct(EntityManagerInterface $entityManager,
                                ElementFactory $elementFactory,
                                MutableAclProviderInterface $aclProvider,
                                AclManager $aclManager)
    {
        parent::__construct($entityManager);
        $this->elementFactory = $elementFactory;
        $this->aclProvider = $aclProvider;
        $this->aclManager = $aclManager;
    }

    /**
     * @param array $data
     * @param bool $copyHint set to true to enable optimizations for a same-db / same-id-space scenario
     * @return Application[]
     * @throws ImportException
     */
    public function importApplicationData(array $data, $copyHint=false)
    {
        $denormalizer = new ExchangeDenormalizer($this->em, $data);
        $entityPool = new EntityPool();
        try {
            $this->importSources($entityPool, $denormalizer, $data, $copyHint);
            $apps = $this->importApplicationEntities($entityPool, $denormalizer, $data);
            if (!$apps) {
                throw new ImportException("No applications found");
            }
            $this->em->flush();

            return $apps;
        } catch (ORMException $e) {
            throw new ImportException("Database error {$e->getMessage()}", 0, $e);
        }
    }

    /**
     * Extracts array from input. Supports json / yaml serialized string inputs and files.
     *
     * @param \SplFileInfo|array|string $data
     * @return array
     * @throws ImportException
     */
    public static function parseImportData($data)
    {
        if (!$data) {
            throw new \InvalidArgumentException("Invalid empty input data");
        } elseif (is_array($data)) {
            return $data;
        } elseif ($data instanceof \SplFileInfo) {
            return static::parseImportData(file_get_contents($data->getRealPath()));
        } elseif (is_string($data)) {
            try {
                $dec = json_decode($data, true);
                if ($dec === null && trim($data) !== json_encode(null)) {
                    throw new ImportException("Dummy text");
                }
                return $dec;
            } catch (\Exception $e) {
                try {
                    return Yaml::parse($data);
                } catch (\Exception $e) {
                    throw new ImportException("Input string could not be parsed into an array", 0, $e);
                }
            }
        } else {
            throw new \InvalidArgumentException("Invalid input type " . (is_object($data) ? get_class($data) : gettype($data)));
        }
    }

    /**
     * Imports sources.
     * @param EntityPool $entityPool
     * @param ExchangeDenormalizer $denormalizer
     * @param array $data data to import
     * @param bool $copyHint
     * @throws ORMException
     */
    private function importSources(EntityPool $entityPool, $denormalizer, $data, $copyHint)
    {
        foreach ($data as $class => $content) {
            if (is_a($class, 'Mapbender\CoreBundle\Entity\Source', true)) {
                foreach ($content as $item) {
                    if (!$this->findMatchingSource($entityPool, $denormalizer, $item, $copyHint)) {
                        $source = $denormalizer->handleData($entityPool, $item);
                        $this->em->persist($source);
                        $this->em->flush();
                    }
                }
            }
        }
    }

    /**
     * @param EntityPool $entityPool
     * @param ExchangeDenormalizer $denormalizer
     * @param array $data data to import
     * @param bool $copyHint
     * @return Source|null
     */
    private function findMatchingSource(EntityPool $entityPool, $denormalizer, $data, $copyHint)
    {
        $className = $this->extractClassName($data);
        if (!$copyHint) {
            // Avoid inserting "new" sources that are duplicates of already existing ones
            // Finding equivalent sources is relatively expensive
            $identFields = array(
                'title',
                'type',
                'name',
                'onlineResource',
            );
        } else {
            // Performance hack: when "importing" from the same DB (actually just copying an
            // application), detecting source duplicates based purely on id is sufficient
            $classMeta = $this->em->getClassMetadata($className);
            $identFields = $classMeta->getIdentifier();
        }
        $criteria = $this->extractArrayFields($data, $identFields);
        foreach ($this->em->getRepository($className)->findBy($criteria) as $source) {
            $tempPool = new EntityPool();
            if ($this->compareSource($tempPool, $denormalizer, $source, $data)) {
                // Move references to Source and its layers over into the "already imported" set,
                // so no new entities will be created and persisted
                $entityPool->merge($tempPool);
                return $source;
            }
        }
        return null;
    }

    /**
     * @param EntityPool $entityPool
     * @param ExchangeDenormalizer $denormalizer
     * @param array $data data to import
     * @return Application[]
     * @throws ORMException
     */
    private function importApplicationEntities(EntityPool $entityPool, $denormalizer, $data)
    {
        $apps = array();
        foreach ($data as $class => $content) {
            if (is_a($class, 'Mapbender\CoreBundle\Entity\Application', true)) {
                foreach ($content as $item) {
                    /** @var Application $app */
                    $app = $denormalizer->handleData($entityPool, $item);
                    $app->setScreenshot(null)->setSource(Application::SOURCE_DB);
                    $this->em->persist($app);
                    // Flush once to generate Application and Element ids before Element
                    // configuration update.
                    $this->em->flush();
                    $this->updateElementConfiguration($entityPool, $app);
                    // Flush again to store updated Element configuration
                    $this->em->flush();
                    $apps[] = $app;
                }
            }
        }
        return $apps;
    }

    /**
     * @param EntityPool $entityPool
     * @param \Mapbender\CoreBundle\Entity\Application $app
     */
    protected function updateElementConfiguration(EntityPool $entityPool, Application $app)
    {
        foreach ($app->getElements() as $element) {
            $configuration = $element->getConfiguration();
            if (!empty($configuration['target'])) {
                $newId = $entityPool->getIdentFromMapper(get_class($element), $configuration['target'], false);
                $configuration['target'] = $newId;
            }
            try {
                // allow Component\Element to fix relational data references post import (e.g. layerset ids on Map)
                $elmComp = $this->elementFactory->componentFromEntity($element);
                $configuration = $elmComp->denormalizeConfiguration($configuration, $entityPool);
            } catch (ElementErrorException $e) {
                // Likely an import from an application with custom element classes that are not defined here
                // => ignore, we still have the entity imported
            }
            $element->setConfiguration($configuration);
            $this->em->persist($element);
        }
    }

    /**
     * @param Application $application
     * @param mixed $currentUser
     */
    public function setDefaultAcls(Application $application, $currentUser)
    {
        $aces = array(
            array(
                'sid' => UserSecurityIdentity::fromAccount($currentUser),
                'mask' => MaskBuilder::MASK_OWNER
            ),
        );
        $this->aclManager->setObjectACL($application, $aces, 'object');
    }

    /**
     * @param Application $target
     * @param Application $source
     * @param $currentUser
     * @throws InvalidDomainObjectException
     * @throws \Symfony\Component\Security\Acl\Exception\Exception
     */
    public function copyAcls(Application $target, Application $source, $currentUser)
    {
        $this->setDefaultAcls($target, $currentUser);
        $sourceAcl = $this->aclProvider->findAcl(ObjectIdentity::fromDomainObject($source));
        /** @var MutableAclInterface $targetAcl */
        $targetAcl = $this->aclManager->getACL($target);
        $currentUserIdentity = UserSecurityIdentity::fromAccount($currentUser);

        // Quirky old behavior: current user has just been given MASK_OWNER, so access for that user
        // is as complete as it can get. We only copy aces for other user identities. Any other
        // entries for the current user are ignored and not copied over.
        // We also only copy the identity + mask portions of the Aces, nothing else.
        // @todo: Figure out if this really is the desired behaviour going forward.
        foreach ($sourceAcl->getObjectAces() as $sourceEntry) {
            /** @var EntryInterface $sourceEntry */
            $entryIdentity = $sourceEntry->getSecurityIdentity();
            if (!$currentUserIdentity->equals($entryIdentity)) {
                $targetAcl->insertObjectAce($entryIdentity, $sourceEntry->getMask());
            }
        }
        $this->aclProvider->updateAcl($targetAcl);
    }

    /**
     * @param EntityPool $entityPool
     * @param ExchangeDenormalizer $denormalizer
     * @param Source $source
     * @param array $data
     * @return bool
     */
    private function compareSource(EntityPool $entityPool, $denormalizer, $source, array $data)
    {
        foreach ($data['layers'] as $layerData) {
            $layerClass = $this->extractClassName($layerData);

            if (!$layerClass) {
                throw new ImportException("Missing source item class definition");
            }
            if (is_a($layerClass, 'Mapbender\WmsBundle\Entity\WmsLayerSource', true)) {
                $field = 'name';
            } elseif (is_a($layerClass, 'Mapbender\WmtsBundle\Entity\WmtsLayerSource', true)) {
                $field = 'identifier';
            } else {
                throw new ImportException("Unsupported layer type {$layerClass}");
            }
            $layerMeta = EntityHelper::getInstance($this->em, $layerClass)->getClassMeta();
            $layerIdentData = $this->extractArrayFields($layerData, $layerMeta->getIdentifier());
            $layerData = $denormalizer->getEntityData($layerClass, $layerIdentData) ?: $layerData;

            $criteria = Criteria::create()->where(Criteria::expr()->eq($field, $layerData[$field]));
            $match = $source->getLayers()->matching($criteria)->first();
            if ($match) {
                $entityPool->add($match, $layerIdentData);
            } else {
                return false;
            }
        }
        return true;
    }
}
