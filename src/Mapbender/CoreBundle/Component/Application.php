<?php
namespace Mapbender\CoreBundle\Component;

use Assetic\Asset\StringAsset;
use Doctrine\Common\Persistence\ObjectRepository;
use Mapbender\CoreBundle\Component\Presenter\Application\ConfigService;
use Mapbender\CoreBundle\Component\Presenter\ApplicationService;
use Mapbender\CoreBundle\Entity\Application as Entity;
use Mapbender\CoreBundle\Entity\Layerset;
use Mapbender\CoreBundle\Entity\SourceInstance;
use Mapbender\CoreBundle\Utils\ArrayUtil;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Filesystem\Exception\IOException;

/**
 * Collection of servicy behaviors related to application
 *
 * @deprecated
 * @internal
 * @author Christian Wygoda
 */
class Application implements IAssetDependent
{
    /**
     * @var ContainerInterface $container The container
     */
    protected $container;

    /**
     * @var Template $template The application template class
     */
    protected $template;

    /**
     * @var Element[][] $element lists by region
     */
    protected $elements;

    /**
     * @var array $layers The layers
     */
    protected $layers;

    /**
     * @var Entity
     */
    protected $entity;

    /**
     * @param ContainerInterface $container The container
     * @param Entity             $entity    The configuration entity
     */
    public function __construct(ContainerInterface $container, Entity $entity)
    {
        $this->container = $container;
        $this->entity    = $entity;
    }

    /**
     * Get the configuration entity.
     *
     * @return Entity $entity
     */
    public function getEntity()
    {
        return $this->entity;
    }

    /**
     * Get the application ID
     *
     * @return integer
     */
    public function getId()
    {
        return $this->entity->getId();
    }

    /**
     * Get the application slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->entity->getSlug();
    }

    /**
     * Get the application title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->entity->getTitle();
    }

    /**
     * Get the application description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->entity->getDescription();
    }

    /*************************************************************************
     *                                                                       *
     *                              Frontend stuff                           *
     *                                                                       *
     *************************************************************************/

    /**
     * Render the application
     *
     * @return string $html The rendered HTML
     */
    public function render()
    {
        $template = $this->getTemplate();
        return $template->render();
    }

    /**
     * @return string[]
     */
    public function getValidAssetTypes()
    {
        return array(
            'js',
            'css',
            'trans',
        );
    }

    /**
     * Lists assets.
     *
     * @return array
     */
    public function getAssets()
    {
        return array(
            'js'    => array(
                '@MapbenderCoreBundle/Resources/public/stubs.js',
                '@MapbenderCoreBundle/Resources/public/mapbender.application.js',
                '@MapbenderCoreBundle/Resources/public/mapbender-model/sourcetree-util.js',
                '@MapbenderCoreBundle/Resources/public/init/projection.js',
                '@MapbenderCoreBundle/Resources/public/mapbender.model.js',
                '@MapbenderCoreBundle/Resources/public/mapbender.trans.js',
                '@MapbenderCoreBundle/Resources/public/mapbender.application.wdt.js',
                '@MapbenderCoreBundle/Resources/public/mapbender.element.base.js',
                '@MapbenderCoreBundle/Resources/public/polyfills.js',
            ),
            'css'   => array(),
            'trans' => array('@MapbenderCoreBundle/Resources/public/mapbender.trans.js')
        );
    }

    /**
     * Get the list of asset paths of the given type ('css', 'js', 'trans')
     * Filters can be applied later on with the ensureFilter method.
     *
     * @param string $type use 'css' or 'js' or 'trans'
     * @return string[]
     */
    public function getAssetGroup($type)
    {
        if (!\in_array($type, $this->getValidAssetTypes(), true)) {
            throw new \RuntimeException('Asset type \'' . $type .
                '\' is unknown.');
        }

        // Add all assets to an asset manager first to avoid duplication
        //$assets = new LazyAssetManager($this->container->get('assetic.asset_factory'));
        $assets            = array();
        $templating        = $this->container->get('templating');
        $appTemplate = $this->getTemplate();

        $ownAssets = $this->getAssets();
        if (!empty($ownAssets[$type])) {
            $assets = array_merge($assets, $ownAssets[$type]);
        }
        $assetSources = array(
            array(
                'object' => $appTemplate,
                'assets' => array(
                    $type => $appTemplate->getAssets($type),
                ),
            ),
        );

        // Collect asset definitions from elements configured in the application
        // Skip grants checks here to avoid issues with application asset caching.
        // Non-granted Elements will skip HTML rendering and config and will not be initialized.
        // Emitting the base js / css / translation assets OTOH is always safe to do
        foreach ($this->getService()->getActiveElements($this->entity, false) as $element) {
            $assetSources[] = array(
                'object' => $element,
                'assets' => $element->getAssets(),
            );
        }

        // Collect all layer asset definitions
        foreach ($this->entity->getLayersets() as $layerset) {
            foreach ($this->filterActiveSourceInstances($layerset) as $layer) {
                $assetSources[] = array(
                    'object' => $layer,
                    'assets' => $layer->getAssets(),
                );
            }
        }

        $assetSources[] = array(
            'object' => $appTemplate,
            'assets' => array(
                $type => $appTemplate->getLateAssets($type),
            ),
        );

        if ($type === 'trans') {
            // mimic old behavior: ONLY for trans assets, avoid processing repeated inputs
            $transAssetInputs = array();
            $translations = array();
            foreach ($assetSources as $assetSource) {
                if (!empty($assetSource['assets'][$type])) {
                    foreach (array_unique($assetSource['assets'][$type]) as $transAsset) {
                        $transAssetInputs[$transAsset] = $transAsset;
                    }
                }
            }
            foreach ($transAssetInputs as $transAsset) {
                $renderedTranslations = json_decode($templating->render($transAsset), true);
                $translations         = array_merge($translations, $renderedTranslations);
            }
            $assets[] = new StringAsset('Mapbender.i18n = ' . json_encode($translations, JSON_FORCE_OBJECT) . ';');
        } else {
            $assetRefs = array();
            foreach ($assetSources as $assetSource) {
                if (!empty($assetSource['assets'][$type])) {
                    foreach ($assetSource['assets'][$type] as $asset) {
                        $assetRef = $this->getReference($assetSource['object'], $asset);
                        if (!array_key_exists($assetRef, $assetRefs)) {
                            $assets[] = $assetRef;
                            $assetRefs[$assetRef] = true;
                        }
                    }
                }
            }
        }

        // Append `extra_assets` references (only occurs in YAML application, see ApplicationYAMLMapper)
        $extraYamlAssets = $this->getEntity()->getExtraAssets();
        if (is_array($extraYamlAssets) && array_key_exists($type, $extraYamlAssets)) {
            foreach ($extraYamlAssets[$type] as $asset) {
                $assets[] = trim($asset);
            }
        }

        // add client initialization last, so everything is already in place
        if ($type === 'js') {
            $appLoaderTemplate = '@MapbenderCoreBundle/Resources/views/application.config.loader.js.twig';
            $appLoaderContent = $templating->render($appLoaderTemplate, array(
                'application' => $this,
            ));
            $assets[] = new StringAsset($appLoaderContent);
        }

        if ($type === 'css') {
            $customCss = $this->getEntity()->getCustomCss();
            if ($customCss) {
                $assets[] = new StringAsset($customCss);
            }
        }

        return $assets;
    }

    /**
     * @return ConfigService
     */
    private function getConfigService()
    {
        /** @var ConfigService $presenter */
        $presenter = $this->container->get('mapbender.presenter.application.config.service');
        return $presenter;
    }

    /**
     * Get the configuration (application, elements, layers) as an StringAsset.
     * Filters can be applied later on with the ensureFilter method.
     *
     * @return string Configuration as JSON string
     */
    public function getConfiguration()
    {
        $configService = $this->getConfigService();
        $configuration = $configService->getConfiguration($this->entity);

        // Convert to asset
        $asset = new StringAsset(json_encode((object)$configuration));
        return $asset->dump();
    }

    /**
     * Build an Assetic reference path from a given objects bundle name(space)
     * and the filename/path within that bundles Resources/public folder.
     *
     * @todo: This is duplicated in DumpMapbenderAssetsCommand
     * @todo: the AssetFactory should do the ref collection and Bundle => path resolution
     *
     * @param object $object
     * @param string $file
     * @return string
     */
    private function getReference($object, $file)
    {
        // If it starts with an @ we assume it's already an assetic reference
        $firstChar = $file[0];
        if ($firstChar == "/") {
            return "../../web/" . substr($file, 1);
        } elseif ($firstChar == ".") {
            return $file;
        } elseif ($firstChar !== '@') {
            if (!$object) {
                throw new \RuntimeException("Can't resolve asset path $file with empty object context");
            }
            $namespaces = explode('\\', get_class($object));
            $bundle     = sprintf('%s%s', $namespaces[0], $namespaces[1]);
            return sprintf('@%s/Resources/public/%s', $bundle, $file);
        } else {
            return $file;
        }
    }

    /**
     * Get template object
     *
     * @return Template
     */
    public function getTemplate()
    {
        if (!$this->template) {
            $template       = $this->entity->getTemplate();
            $this->template = new $template($this->container, $this);
        }
        return $this->template;
    }

    /**
     * Get region elements, optionally by region.
     * This called almost exclusively from twig templates, with or without the region paraemter.
     *
     * @param string $regionName deprecated; Region to get elements for. If null, all elements  are returned.
     * @return Element[][] keyed by region name (string)
     */
    public function getElements($regionName = null)
    {
        $appService = $this->getService();
        if ($this->elements === null) {
            $activeElements = $appService->getActiveElements($this->entity, true);
            $this->elements = array();
            foreach ($activeElements as $elementComponent) {
                $elementRegion = $elementComponent->getEntity()->getRegion();
                if (!array_key_exists($elementRegion, $this->elements)) {
                    $this->elements[$elementRegion] = array();
                }
                $this->elements[$elementRegion][] = $elementComponent;
            }
        }
        if ($regionName) {
            return ArrayUtil::getDefault($this->elements, $regionName, array());
        } else {
            return $this->elements;
        }
    }

    /**
     * Extracts active source instances from given Layerset entity.
     *
     * @param Layerset $entity
     * @return SourceInstance[]
     */
    protected static function filterActiveSourceInstances(Layerset $entity)
    {
        $isYamlApp = $entity->getApplication()->isYamlBased();
        $activeInstances = array();
        foreach ($entity->getInstances() as $instance) {
            if ($isYamlApp || $instance->getEnabled()) {
                $activeInstances[] = $instance;
            }
        }
        return $activeInstances;
    }

    /**
     * Checks and generates a valid slug.
     *
     * @param ContainerInterface $container container
     * @param string             $slug      slug to check
     * @param string             $suffix
     * @return string a valid generated slug
     */
    public static function generateSlug($container, $slug, $suffix = 'copy')
    {
        $application = $container->get('mapbender')->getApplicationEntity($slug);
        if (!$application) {
            return $slug;
        } else {
            $count = 0;
        }
        /** @var ObjectRepository $rep */
        $rep = $container->get('doctrine')->getRepository('MapbenderCoreBundle:Application');
        do {
            $copySlug = $slug . "_" . $suffix . ($count > 0 ? '_' . $count : '');
            $count++;
        } while ($rep->findOneBy(array('slug' => $copySlug)));
        return $copySlug;
    }

    /**
     * Returns the public "uploads" directory.
     * NOTE: this has nothing to with applications. Some legacy usages passed in an application
     * slug as a second argument, but it was only ever evaluated as a boolean.
     *
     * @param ContainerInterface $container Container
     * @param bool               $webRelative
     * @return string the path to uploads dir or null.
     * @deprecated use the uploads_manager service
     */
    public static function getUploadsDir($container, $webRelative = false)
    {
        $ulm = self::getServiceStatic($container)->getUploadsManager();
        try {

            if ($webRelative) {
                return $ulm->getWebRelativeBasePath(true);
            } else {
                return $ulm->getAbsoluteBasePath(true);
            }
        } catch (\RuntimeException $e) {
            return null;
        }
    }

    /**
     * Returns the web-relative path to the application's uploads directory.
     *
     * @param ContainerInterface $container Container
     * @param string             $slug      application's slug
     * @return boolean true if the application's directory already existed or has just been successfully created
     * @deprecated use the uploads_manager service
     */
    public static function getAppWebDir($container, $slug)
    {
        $ulm = static::getServiceStatic($container)->getUploadsManager();
        try {
            $ulm->getSubdirectoryPath($slug, true);
            return $ulm->getWebRelativeBasePath(false) . '/' . $slug;
        } catch (IOException $e) {
            return null;
        }
    }

    /**
     * If $oldSlug emptyish: Ensures Application-owned subdirectory under uploads exists,
     * returns true if creation succcessful or it already existed.
     *
     * If $oldSlug non-emptyish: Move / rename subdirectory from  $oldSlug to $slug and
     * returns a boolean indicating success.
     *
     * @deprecated for parameter-variadic behavior and swallowing exceptions; use the application_uploads_manager service directly
     *
     * @param ContainerInterface $container Container
     * @param string $slug subdirectory name for presence check / creation
     * @param string|null $oldSlug source subdirectory that will be renamed to $slug
     * @return boolean to indicate success or presence
     */
    public static function createAppWebDir($container, $slug, $oldSlug = null)
    {
        $ulm = static::getServiceStatic($container)->getUploadsManager();
        try {
            if ($oldSlug) {
                $ulm->renameSubdirectory($slug, $oldSlug, true);
            } else {
                $ulm->getSubdirectoryPath($slug, true);
            }
            return true;
        } catch (IOException $e) {
            return false;
        }
    }

    /**
     * Removes application's public directory, if present.
     *
     * @param ContainerInterface $container Container
     * @param string             $slug      application's slug
     * @return boolean true if the directory was removed or did not exist before the call.
     * @deprecated use uploads_manager or filesystem service directly
     */
    public static function removeAppWebDir($container, $slug)
    {
        $ulm = static::getServiceStatic($container)->getUploadsManager();
        try {
            $ulm->removeSubdirectory($slug);
            return true;
        } catch (IOException $e) {
            return false;
        }
    }

    /**
     * Returns an url to application's public directory.
     *
     * @param ContainerInterface $container Container
     * @param string             $slug      application's slug
     * @return string a url to wmc directory or to file with "$filename"
     */
    public static function getAppWebUrl($container, $slug)
    {
        return Application::getUploadsUrl($container) . "/" . $slug;
    }

    /**
     * Returns an url to public "uploads" directory.
     *
     * @param ContainerInterface $container Container
     * @return string an url to public "uploads" directory
     */
    public static function getUploadsUrl($container)
    {
        $base_url = Application::getBaseUrl($container);
        return $base_url . '/' . Application::getUploadsDir($container, true);
    }

    /**
     * Returns a base url.
     *
     * @param ContainerInterface $container Container
     * @return string a base url
     */
    public static function getBaseUrl($container)
    {
        $request = $container->get('request');
        return $request->getScheme() . '://' . $request->getHttpHost() . $request->getBasePath();
    }

    /**
     * Copies an application web order.
     *
     * @param ContainerInterface $container Container
     * @param string             $srcSlug  source application slug
     * @param string             $destSlug  destination application slug
     * @return boolean true if the application  order has been copied otherwise false.
     */
    public static function copyAppWebDir($container, $srcSlug, $destSlug)
    {
        $ulm = static::getServiceStatic($container)->getUploadsManager();
        try {
            $ulm->copySubdirectory($srcSlug, $destSlug);
            return true;
        } catch (IOException $e) {
            return false;
        }
    }

    /**
     * @deprected
     * @internal
     */
    public function addViewPermissions()
    {
        /** @var YamlApplicationImporter $service */
        $service = $this->container->get('mapbender.yaml_application_importer.service');
        $service->addViewPermissions($this->getEntity());
    }

    /**
     * @return ApplicationService
     */
    protected function getService()
    {
        /** @var ApplicationService $service */
        $service = $this->container->get('mapbender.presenter.application.service');
        return $service;
    }

    /**
     * @param ContainerInterface $container
     * @return ApplicationService
     */
    private static function getServiceStatic(ContainerInterface $container)
    {
        /** @var ApplicationService $service */
        $service = $container->get('mapbender.presenter.application.service');
        return $service;
    }
}
