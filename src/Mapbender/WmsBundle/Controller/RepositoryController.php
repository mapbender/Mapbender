<?php

namespace Mapbender\WmsBundle\Controller;

use FOM\ManagerBundle\Configuration\Route as ManagerRoute;
use Mapbender\CoreBundle\Component\EntityHandler;
use Mapbender\CoreBundle\Component\SourceMetadata;
use Mapbender\CoreBundle\Component\XmlValidator;
use Mapbender\WmsBundle\Component\WmsCapabilitiesParser;
use Mapbender\WmsBundle\Entity\WmsSource;
use Mapbender\WmsBundle\Form\Type\WmsInstanceInstanceLayersType;
use Mapbender\WmsBundle\Form\Type\WmsSourceSimpleType;
use OwsProxy3\CoreBundle\Component\ProxyQuery;
use OwsProxy3\CoreBundle\Component\CommonProxy;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Acl\Domain\ObjectIdentity;
use Symfony\Component\Security\Acl\Domain\UserSecurityIdentity;
use Symfony\Component\Security\Acl\Permission\MaskBuilder;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @ManagerRoute("/repository/wms")
 *
 * @author Christian Wygoda
 */
class RepositoryController extends Controller
{

    public static $WMS_DIR = "xml/wms";

    /**
     * @ManagerRoute("/new")
     * @Method({ "GET" })
     * @Template
     */
    public function newAction()
    {
        $form = $this->get("form.factory")->create(new WmsSourceSimpleType(), new WmsSource());
        return array(
            "form" => $form->createView()
        );
    }

    /**
     * @ManagerRoute("/start")
     * @Method({ "GET" })
     * @Template("MapbenderWmsBundle:Repository:form.html.twig")
     */
    public function startAction()
    {
        $form = $this->get("form.factory")->create(new WmsSourceSimpleType(), new WmsSource());
        return array(
            "form" => $form->createView()
        );
    }

    /**
     * @ManagerRoute("{wms}")
     * @Method({ "GET"})
     * @Template
     */
    public function viewAction(WmsSource $wms)
    {
        $securityContext = $this->get('security.context');
        $oid = new ObjectIdentity('class', 'Mapbender\CoreBundle\Entity\Source');
        if (!$securityContext->isGranted('VIEW', $oid) && !$securityContext->isGranted('VIEW', $wms)) {
            throw new AccessDeniedException();
        }
        return array("wms" => $wms);
    }

    /**
     * @ManagerRoute("/create")
     * @Method({ "POST" })
     * @Template("MapbenderWmsBundle:Repository:new.html.twig")
     */
    public function createAction()
    {
        $request = $this->get('request');
        $wmssource_req = new WmsSource();

        $securityContext = $this->get('security.context');
        $oid = new ObjectIdentity('class', 'Mapbender\CoreBundle\Entity\Source');
        if (false === $securityContext->isGranted('CREATE', $oid)) {
            throw new AccessDeniedException();
        }

        $form = $this->get("form.factory")->create(new WmsSourceSimpleType(), $wmssource_req);
        $form->bind($request);
        $onlyvalid = $form->get('onlyvalid')->getData();
        if ($form->isValid()) {
            $purl = parse_url($wmssource_req->getOriginUrl());
            if (!isset($purl['scheme']) || !isset($purl['host'])) {
                $this->get("logger")->debug("The url is not valid.");
                $this->get('session')->getFlashBag()->set('error', "The url is not valid.");
                return $this->redirect($this->generateUrl(
                            "mapbender_manager_repository_new", array(), true));
            }
            $proxy_config = $this->container->getParameter("owsproxy.proxy");
            $proxy_query = ProxyQuery::createFromUrl(trim($wmssource_req->getOriginUrl()), $wmssource_req->getUsername(), $wmssource_req->getPassword());
            if ($proxy_query->getGetPostParamValue("request", true) === null) {
                $proxy_query->addQueryParameter("request", "GetCapabilities");
            }
            if ($proxy_query->getGetPostParamValue("service", true) === null) {
                $proxy_query->addQueryParameter("service", "WMS");
            }
            $wmssource_req->setOriginUrl($proxy_query->getGetUrl());
            $proxy = new CommonProxy($proxy_config, $proxy_query);

            $wmssource = null;
            try {
                $browserResponse = $proxy->handle();
                $content = $browserResponse->getContent();
                $doc = WmsCapabilitiesParser::createDocument($content);
                if ($onlyvalid === true) {
                    $validator = new XmlValidator($this->container, $proxy_config, "xmlschemas/");
                    $doc = $validator->validate($doc);
                    $wmsParser = WmsCapabilitiesParser::getParser($doc);
                    $wmssource = $wmsParser->parse();
                    $wmssource->setValid(true);
                } else {
                    try {
                        $validator = new XmlValidator($this->container, $proxy_config, "xmlschemas/");
                        $doc = $validator->validate($doc);
                        $wmsParser = WmsCapabilitiesParser::getParser($doc);
                        $wmssource = $wmsParser->parse();
                        $wmssource->setValid(true);
                    } catch (\Exception $e) {
                        $this->get("logger")->warn($e->getMessage());
                        $this->get('session')->getFlashBag()->set('warning', $e->getMessage());
                        $wmsParser = WmsCapabilitiesParser::getParser($doc);
                        $wmssource = $wmsParser->parse();
                        $wmssource->setValid(false);
                    }
                }
            } catch (\Exception $e) {
                $this->get("logger")->err($e->getMessage());
                $this->get('session')->getFlashBag()->set('error', $e->getMessage());
                return $this->redirect($this->generateUrl(
                            "mapbender_manager_repository_new", array(), true));
            }

            if (!$wmssource) {
                $this->get("logger")->err('Could not parse data for url "'
                    . $wmssource_req->getOriginUrl() . '"');
                $this->get('session')->getFlashBag()->set('error', 'Could not parse data for url "'
                    . $wmssource_req->getOriginUrl() . '"');
                return $this->redirect($this->generateUrl(
                            "mapbender_manager_repository_new", array(), true));
            }
            $wmsWithSameTitle = $this->getDoctrine()
                ->getManager()
                ->getRepository("MapbenderWmsBundle:WmsSource")
                ->findByTitle($wmssource->getTitle());

            if (count($wmsWithSameTitle) > 0) {
                $wmssource->setAlias(count($wmsWithSameTitle));
            }

            $wmssource->setOriginUrl($wmssource_req->getOriginUrl());
            $rootlayer = $wmssource->getLayers()->get(0);
            $this->getDoctrine()->getManager()->persist($rootlayer);
            $this->saveLayer($this->getDoctrine()->getManager(), $rootlayer);
            $this->getDoctrine()->getManager()->persist($wmssource);
            $this->getDoctrine()->getManager()->flush();

            // ACL
            $aclProvider = $this->get('security.acl.provider');
            $objectIdentity = ObjectIdentity::fromDomainObject($wmssource);
            $acl = $aclProvider->createAcl($objectIdentity);

            $securityContext = $this->get('security.context');
            $user = $securityContext->getToken()->getUser();
            $securityIdentity = UserSecurityIdentity::fromAccount($user);

            $acl->insertObjectAce($securityIdentity, MaskBuilder::MASK_OWNER);
            $aclProvider->updateAcl($acl);

            $this->get('session')->getFlashBag()->set('success', "Your WMS has been created");
            return $this->redirect($this->generateUrl(
                        "mapbender_manager_repository_view", array(
                        "sourceId" => $wmssource->getId()), true));
        }

        return array(
            'form' => $form->createView(),
            'form_name' => $form->getName());
    }

    private function saveLayer($em, $layer)
    {
        foreach ($layer->getSublayer() as $sublayer) {
            $em->persist($sublayer);
            $this->saveLayer($em, $sublayer);
        }
    }

    /**
     * Removes a WmsSource
     *
     * @ManagerRoute("/{sourceId}/delete")
     * @Method({"GET"})
     */
    public function deleteAction($sourceId)
    {
        $wmssource = $this->getDoctrine()
            ->getRepository("MapbenderWmsBundle:WmsSource")
            ->find($sourceId);
        $wmsinstances = $this->getDoctrine()
            ->getRepository("MapbenderWmsBundle:WmsInstance")
            ->findBySource($sourceId);
        $em = $this->getDoctrine()->getManager();
        $em->getConnection()->beginTransaction();

        $aclProvider = $this->get('security.acl.provider');
        $oid = ObjectIdentity::fromDomainObject($wmssource);
        $aclProvider->deleteAcl($oid);

        foreach ($wmsinstances as $wmsinstance) {
            $wmsinsthandler = EntityHandler::createHandler($this->container, $wmsinstance);
            $wmsinsthandler->remove();
            $em->flush();
        }
        $wmshandler = EntityHandler::createHandler($this->container, $wmssource);
        $wmshandler->remove();
        $em->getConnection()->commit();
        $this->get('session')->getFlashBag()->set('success', "Your WMS has been deleted");
        return $this->redirect($this->generateUrl("mapbender_manager_repository_index"));
    }

    /**
     * Removes a WmsInstance
     *
     * @ManagerRoute("/{slug}/instance/{instanceId}/delete")
     * @Method({"GET"})
     */
    public function deleteInstanceAction($slug, $instanceId)
    {
        $instance = $this->getDoctrine()
            ->getRepository("MapbenderCoreBundle:SourceInstance")
            ->find($instanceId);
        $em = $this->getDoctrine()->getManager();
        $em->getConnection()->beginTransaction();
        $instance->getLayerSet()->getApplication()->setUpdated(new \DateTime());
        $insthandler = EntityHandler::createHandler($this->container, $instance);
        $insthandler->remove();
        $em->flush();
        $em->getConnection()->commit();
        $this->get('session')->getFlashBag()->set('success', 'Your source instance has been deleted.');
        return new Response();
    }

    /**
     * Edits, saves the WmsInstance
     *
     * @ManagerRoute("/instance/{slug}/{instanceId}")
     * @Template("MapbenderWmsBundle:Repository:instance.html.twig")
     */
    public function instanceAction($slug, $instanceId)
    {
        $wmsinstance = $this->getDoctrine()
            ->getRepository("MapbenderWmsBundle:WmsInstance")
            ->find($instanceId);

        if ($this->getRequest()->getMethod() == 'POST') { //save
            $form = $this->createForm(new WmsInstanceInstanceLayersType(), $wmsinstance);
            $form->bind($this->get('request'));
            if ($form->isValid()) { //save
                $em = $this->getDoctrine()->getManager();
                $em->getConnection()->beginTransaction();
                foreach ($wmsinstance->getLayers() as $layer) {
                    $em->persist($layer);
                    $em->flush();
                    $em->refresh($layer);
                }
                $em->persist($wmsinstance);
                $wmsinstance->getLayerSet()->getApplication()->setUpdated(new \DateTime());
                $em->flush();
                $em->getConnection()->commit();
                $wmsinstance = $this->getDoctrine()
                    ->getRepository("MapbenderWmsBundle:WmsInstance")
                    ->find($wmsinstance->getId());
                $entityHandler = EntityHandler::createHandler($this->container, $wmsinstance);
                $entityHandler->generateConfiguration();
                $em->persist($entityHandler->getEntity());
                $em->flush();

                $this->get('session')->getFlashBag()->set(
                    'success', 'Your Wms Instance has been changed.');
                return $this->redirect($this->generateUrl(
                            'mapbender_manager_application_edit', array("slug" => $slug)) . '#layersets');
            } else { // edit
                return array(
                    "form" => $form->createView(),
                    "slug" => $slug,
                    "instance" => $wmsinstance);
            }
        } else { // edit
            $form = $this->createForm(new WmsInstanceInstanceLayersType(), $wmsinstance);
            return array(
                "form" => $form->createView(),
                "slug" => $slug,
                "instance" => $wmsinstance,
                );
        }
    }

    /**
     * Changes the priority of WmsInstanceLayers
     *
     * @ManagerRoute("/{slug}/instance/{instanceId}/priority/{instLayerId}")
     */
    public function instanceLayerPriorityAction($slug, $instanceId, $instLayerId)
    {
        $number = $this->get("request")->get("number");
        $instLay = $this->getDoctrine()
            ->getRepository('MapbenderWmsBundle:WmsInstanceLayer')
            ->findOneById($instLayerId);

        if (!$instLay) {
            return new Response(json_encode(array(
                    'error' => 'The wms instance layer with'
                    . ' the id "' . $instanceId . '" does not exist.',
                    'result' => '')), 200, array('Content-Type' => 'application/json'));
        }
        if (intval($number) === $instLay->getPriority()) {
            return new Response(json_encode(array(
                    'error' => '',
                    'result' => 'ok')), 200, array('Content-Type' => 'application/json'));
        }
        $em = $this->getDoctrine()->getManager();
        $instLay->setPriority($number);
        $em->persist($instLay);
        $em->flush();
        $query = $em->createQuery(
            "SELECT il FROM MapbenderWmsBundle:WmsInstanceLayer il"
            . " WHERE il.wmsinstance=:wmsi ORDER BY il.priority ASC");
        $query->setParameters(array("wmsi" => $instanceId));
        $instList = $query->getResult();

        $num = 0;
        foreach ($instList as $inst) {
            if ($num === intval($instLay->getPriority())) {
                if ($instLay->getId() === $inst->getId()) {
                    $num++;
                } else {
                    $num++;
                    $inst->setPriority($num);
                    $num++;
                }
            } else {
                if ($instLay->getId() !== $inst->getId()) {
                    $inst->setPriority($num);
                    $num++;
                }
            }
        }
        $em->getConnection()->beginTransaction();
        foreach ($instList as $inst) {
            $em->persist($inst);
        }
        $em->flush();
        $wmsinstance = $this->getDoctrine()
            ->getRepository("MapbenderCoreBundle:SourceInstance")
            ->find($instanceId);
        $wmsinstance->generateConfiguration();
        $em->persist($wmsinstance);
        $em->flush();
        $em->getConnection()->commit();
        return new Response(json_encode(array(
                'error' => '',
                'result' => 'ok')), 200, array(
            'Content-Type' => 'application/json'));
    }

    /**
     * Sets enabled/disabled for the WmsInstance
     *
     * @ManagerRoute("/instance/{slug}/enabled/{instanceId}")
     * @Method({ "POST" })
     */
    public function instanceEnabledAction($slug, $instanceId)
    {
        $enabled = $this->get("request")->get("enabled");
        $wmsinstance = $this->getDoctrine()
            ->getRepository("MapbenderWmsBundle:WmsInstance")
            ->find($instanceId);
        if (!$wmsinstance) {
            return new Response(json_encode(array(
                    'error' => 'The wms instance with the id "' . $instanceId . '" does not exist.')), 200, array('Content-Type' => 'application/json'));
        } else {
            $enabled_before = $wmsinstance->getEnabled();
            $enabled = $enabled === "true" ? true : false;
            $wmsinstance->setEnabled($enabled);
            $em = $this->getDoctrine()->getManager();
            $em->persist($wmsinstance);
            $wmsinstance->getLayerSet()->getApplication()->setUpdated(new \DateTime());
            $em->flush();
            return new Response(json_encode(array(
                    'success' => array(
                        "id" => $wmsinstance->getId(),
                        "type" => "instance",
                        "enabled" => array(
                            'before' => $enabled_before,
                            'after' => $enabled)))), 200, array('Content-Type' => 'application/json'));
        }
    }

    /**
     * Get Metadata for a wms service
     *
     * @ManagerRoute("/instance/metadata")
     * @Method({ "POST" })
     */
    public function metadataAction()
    {
        $sourceId = $this->container->get('request')->get("sourceId", null);
        $instance = $this->container->get("doctrine")
                ->getRepository('Mapbender\CoreBundle\Entity\SourceInstance')->find($sourceId);
        $securityContext = $this->get('security.context');
        $oid = new ObjectIdentity('class', 'Mapbender\CoreBundle\Entity\Application');
        if (!$securityContext->isGranted('VIEW', $oid) && !$securityContext->isGranted('VIEW',
                $instance->getLayerset()->getApplication())) {
            throw new AccessDeniedException();
        }
        $layerName = $this->container->get('request')->get("layerName", null);
        $metadata = $instance->getMetadata();
        $metadata->setContenttype(SourceMetadata::$CONTENTTYPE_ELEMENT);
        $metadata->setContainer(SourceMetadata::$CONTAINER_ACCORDION);
        $content = $metadata->render($this->container->get('templating'), $layerName);
        $response = new Response();
        $response->setContent($content);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    private function getErrorMessages(\Symfony\Component\Form\Form $form)
    {
        $errors = array();

        foreach ($form->getErrors() as $key => $error) {
            $errors[] = $error->getMessage();
        }

        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors[$child->getName()] = $this->getErrorMessages($child);
            }
        }

        return $errors;
    }

}
