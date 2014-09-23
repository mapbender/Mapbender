<?php

/**
 * TODO: License
 */

namespace Mapbender\CoreBundle\Controller;

use Mapbender\CoreBundle\Asset\ApplicationAssetCache;
use Mapbender\CoreBundle\Component\Application;
use Mapbender\CoreBundle\Entity\Application as ApplicationEntity;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Security\Acl\Domain\ObjectIdentity;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Assetic\Filter\CssRewriteFilter;
use Assetic\Asset\StringAsset;

/**
 * Application controller.
 *
 * @author Christian Wygoda
 */
class ApplicationController extends Controller
{

    /**
     * Get runtime URLs
     *
     * @param string $slug
     * @return array
     */
    private function getUrls($slug)
    {
        $base_url = $this->get('request')->getBaseUrl();
        $element_url = $this->get('router')
            ->generate('mapbender_core_application_element', array('slug' => $slug));
        $translation_url = $this->get('router')
            ->generate('mapbender_core_translation_trans');
        $proxy_url = $this->get('router')
            ->generate('owsproxy3_core_owsproxy_entrypoint');
        $metadata_url = $this->get('router')
            ->generate('mapbender_core_application_metadata', array('slug' => $slug));

        // hack to get proper urls when embedded in drupal
        $drupal_mark = function_exists('mapbender_menu') ? '?q=mapbender' : 'mapbender';
        $base_url = str_replace('mapbender', $drupal_mark, $base_url);
        $element_url = str_replace('mapbender', $drupal_mark, $element_url);
        $translation_url = str_replace('mapbender', $drupal_mark, $translation_url);
        $proxy_url = str_replace('mapbender', $drupal_mark, $proxy_url);
        $metadata_url = str_replace('mapbender', $drupal_mark, $metadata_url);

        return array(
            'base' => $base_url,
            // @TODO: Can this be done less hack-ish?
            'asset' => rtrim($this->get('templating.helper.assets')->getUrl('.'), '.'),
            'element' => $element_url,
            'trans' => $translation_url,
            'proxy' => $proxy_url,
            'metadata' => $metadata_url);
    }

    /**
     * Asset controller.
     *
     * Dumps the assets for the given application and type. These are up to
     * date and this controller will be used during development mode.
     *
     * @Route("/application/{slug}/assets/{type}")
     */
    public function assetsAction($slug, $type)
    {
        $response = new Response();

        // Load required assets for application
        $application = $this->getApplication($slug);
        $cache = new ApplicationAssetCache($this->container, $application->getAssets($type), $type);
        $useTimestamp = !$this->container->getParameter('mapbender.static_assets');
        $assets = $cache->fill($slug, $useTimestamp);

        // Determine last-modified timestamp for both DB- and YAML-based apps
        $application_update_time = new \DateTime();
        $application_entity = $this->getApplication($slug)->getEntity();

        $assets_mtime = 0;
        foreach ($assets as $asset) {
            $assets_mtime = max($assets_mtime, $asset->getLastModified());
        }
        $asset_modification_time = new \DateTime();
        $asset_modification_time->setTimestamp($assets_mtime);

        if ($application->getEntity()->getSource() === ApplicationEntity::SOURCE_DB) {
            $updateTime = max($application->getEntity()->getUpdated(), $asset_modification_time);
        } else {
            $cacheUpdateTime = new \DateTime($this->container->getParameter('mapbender.cache_creation'));
            $updateTime = max($cacheUpdateTime, $asset_modification_time);
        }

        // runtime rewrite which takes into account if the action was called
        // with app.php in the URL or not.
        if('css' === $type) {
            // The target path assumed by the cache has been used by the
            // cache's rewrite and all URLs in the cached assets are already
            // rewritten for it. Now we rewrite from these normalized URLs to
            // the final, runtime URLs and therefore the cache's target path
            // is our source path.
            $source = str_replace(array('{slug}', '{type}'),
                                  array($slug, $type),
                                  $assets->getTargetPath());

            // Let's build the runtime target path
            $request = $this->getRequest();
            $webDir = str_replace('\\', '/',
                realpath($this->container->get('kernel')->getRootDir() .
                    '/../web/'));
            $target = $webDir . substr(
                $request->getRequestUri(),
                strlen($request->getBasePath()));

            // And move everything into an StringAsset which gets added the
            // CssRewriteFilter
            $css = $assets->dump();
            $assets = new StringAsset($css,
                                 array(),
                                 null, $source);
            $assets->load();
            $assets->setTargetPath($target);
            $assets->ensureFilter(new CssRewriteFilter());
        }

        // Create HTTP 304 if possible
        $response->setLastModified($updateTime);
        $response->headers->set('X-Asset-Modification-Time', $asset_modification_time->format('c'));
        if ($response->isNotModified($this->get('request'))) {
            return $response;
        }

        // Dump assets to client
        $mimetypes = array(
            'css' => 'text/css',
            'js' => 'application/javascript',
            'trans' => 'application/javascript');

        $response->headers->set('Content-Type', $mimetypes[$type]);
        $response->setContent($assets->dump());
        return $response;
    }

    /**
     * Element action controller.
     *
     * Passes the request to the element's httpAction.
     * @Route("/application/{slug}/element/{id}/{action}",
     *     defaults={ "id" = null, "action" = null },
     *     requirements={ "action" = ".+" })
     */
    public function elementAction($slug, $id, $action)
    {
        $element = $this->getApplication($slug)->getElement($id);

        return $element->httpAction($action);
    }

    /**
     * Main application controller.
     *
     * @Route("/application/{slug}.{_format}", defaults={ "_format" = "html" })
     * @Template()
     */
    public function applicationAction($slug)
    {
        $application = $this->getApplication($slug);

        // At this point, we are allowed to acces the application. In order
        // to use the proxy in following request, we have to mark the session
        $this->get("session")->set("proxyAllowed", true);

        return new Response($application->render());
    }

    /**
     * Get the application by slug.
     *
     * Tries to get the application with the given slug and throws an 404
     * exception if it can not be found. This also checks access control and
     * therefore may throw an AuthorizationException.
     *
     * @return Mapbender\CoreBundle\Component\Application
     */
    private function getApplication($slug)
    {
        $application = $this->get('mapbender')
            ->getApplication($slug, $this->getUrls($slug));

        if ($application === null) {
            throw new NotFoundHttpException(
            'The application can not be found.');
        }

        $this->checkApplicationAccess($application);

        return $application;
    }

    /**
     * Check access permissions for given application.
     *
     * This will check if any ACE in the ACL for the given applications entity
     * grants the VIEW permission.
     *
     * @param Application $application
     */
    public function checkApplicationAccess(Application $application)
    {
        $securityContext = $this->get('security.context');

        $application_entity = $application->getEntity();
        if ($application_entity::SOURCE_YAML === $application_entity->getSource() && count($application_entity->yaml_roles)) {
            $passed = false;
            foreach ($application_entity->yaml_roles as $role) {
                if ($securityContext->isGranted($role)) {
                    $passed = true;
                    break;
                }
            }
            if (!$passed) {
                throw new AccessDeniedException('You are not granted view permissions for this application.');
            }
        }

        $granted = $securityContext->isGranted('VIEW', $application_entity);
        if (false === $granted) {
            throw new AccessDeniedException('You are not granted view permissions for this application.');
        }

        if (!$application_entity->isPublished() and ! $securityContext->isGranted('EDIT', $application_entity)) {
            throw new AccessDeniedException('This application is not published at the moment');
        }
    }

    /**
     * Metadata controller.
     *
     * @Route("/application/{slug}/metadata")
     */
    public function metadataAction($slug)
    {
        $securityContext = $this->get('security.context');
        $oid = new ObjectIdentity('class', 'Mapbender\CoreBundle\Entity\Source');
        $sourceId = $this->container->get('request')->get("sourceId", null);
        $instance = $this->container->get("doctrine")
                ->getRepository('Mapbender\CoreBundle\Entity\SourceInstance')->find($sourceId);
        $oid = new ObjectIdentity('class', 'Mapbender\CoreBundle\Entity\Application');
        if (!$securityContext->isGranted('VIEW', $oid) && !$securityContext->isGranted('VIEW', $instance->getLayerset()->getApplication())) {
             throw new AccessDeniedException();
        }

        $managers = $this->get('mapbender')->getRepositoryManagers();
        $manager = $managers[$instance->getSource()->getManagertype()];

        $path = array('_controller' => $manager['bundle'] . ":" . "Repository:metadata");
        $subRequest = $this->container->get('request')->duplicate(array(), null, $path);
        return $this->container->get('http_kernel')->handle(
                $subRequest, HttpKernelInterface::SUB_REQUEST);
    }

}
