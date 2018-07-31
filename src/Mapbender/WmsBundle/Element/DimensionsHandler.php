<?php

namespace Mapbender\WmsBundle\Element;

use Mapbender\CoreBundle\Component\Element;
use Mapbender\WmsBundle\Component\DimensionInst;
use Mapbender\WmsBundle\Entity\WmsInstance;

/**
 * Dimensions handler
 * @author Paul Schmidt
 */
class DimensionsHandler extends Element
{

    /**
     * @inheritdoc
     */
    public static function getClassTitle()
    {
        return "mb.wms.dimhandler.class.title";
    }

    /**
     * @inheritdoc
     */
    public static function getClassDescription()
    {
        return "mb.wms.dimhandler.class.description";
    }

    /**
     * @inheritdoc
     */
    public static function getClassTags()
    {
        return array("mb.wms.dimhandler.dimension", "mb.wms.dimhandler.handler");
    }

    /**
     * @inheritdoc
     */
    public static function getDefaultConfiguration()
    {
        return array(
            "tooltip" => "",
            "target" => null,
            'dimensionsets' => array()
            
        );
    }

    /**
     * @inheritdoc
     */
    public function getWidgetName()
    {
        return 'mapbender.mbDimensionsHandler';
    }

    /**
     * @inheritdoc
     */
    public static function listAssets()
    {
        return array(
            'js' => array(
                'mapbender.wms.dimension.js',
                'mapbender.element.dimensionshandler.js',
            ),
            'css' => array(
                '@MapbenderWmsBundle/Resources/public/sass/element/dimensionshandler.scss',
                '@MapbenderCoreBundle/Resources/public/sass/element/mbslider.scss'
            ),
            'trans' => array('MapbenderWmsBundle:Element:dimensionshandler.json.twig')
        );
    }

    /**
     * @inheritdoc
     */
    public static function getType()
    {
        return 'Mapbender\WmsBundle\Element\Type\DimensionsHandlerAdminType';
    }

    /**
     * @inheritdoc
     */
    public static function getFormTemplate()
    {
        return 'MapbenderWmsBundle:ElementAdmin:dimensionshandler.html.twig';
    }

    /**
     * @inheritdoc
     */
    public function render()
    {
        return $this->container->get('templating')->render(
            'MapbenderWmsBundle:Element:dimensionshandler.html.twig',
            array(
                'id' => $this->getId(),
                "title" => $this->getTitle(),
                'configuration' => $this->getConfiguration()
            )
        );
    }
    
    /**
     * @inheritdoc
     */
    public function getConfiguration()
    {
        $configuration = parent::getConfiguration();
        foreach ($configuration['dimensionsets'] as $key => &$value) {
            $value['dimension'] = $value['dimension']->getConfiguration();
        }
        return $configuration;
    }

    /**
     * Replace dimension entries in generated frontend config with our desired values.
     *
     * @param mixed[] $appConfig
     * @return mixed[]
     */
    public function updateAppConfig($appConfig)
    {
        $configuration = parent::getConfiguration();
        $instances = array();
        foreach ($configuration['dimensionsets'] as $key => $value) {
            for ($i = 0; isset($value['group']) && count($value['group']) > $i; $i++) {
                $item = explode("-", $value['group'][$i]);
                $instances[$item[0]] = $value['dimension'];
            }
        }
        if (!$instances) {
            // nothing to do, skip looping over all the layer configs
            return $appConfig;
        }

        foreach ($appConfig['layersets'] as &$layerList) {
            foreach ($layerList as &$layerMap) {
                foreach ($layerMap as $layerId => &$layerDef) {
                    if (empty($instances[$layerId]) || empty($layerDef['configuration']['options']['dimensions'])) {
                        // layer is not controllable through DimHandler, leave its config alone
                        continue;
                    }
                    $dimConfig = $instances[$layerId]->getConfiguration();
                    $this->updateDimensionConfig($layerDef['configuration']['options']['dimensions'], $dimConfig);
                }
            }
        }
        return $appConfig;
    }

    /**
     * Updates the $target list of dimension config arrays by reference with our own settings (from backend).
     * Matching is by type. If a dimension config entry matches on type, we copy our "extent" and "default" into it.
     *
     * @param mixed[] $target
     * @param mixed[] $dimensionConfig
     */
    public static function updateDimensionConfig(&$target, $dimensionConfig)
    {
        foreach ($target as &$dimensionDef) {
            if ($dimensionDef['type'] == $dimensionConfig['type']) {
                $dimensionDef['extent'] = $dimensionConfig['extent'];
                $dimensionDef['default'] = $dimensionConfig['default'];
            }
        }
    }

    /**
     * Copies Extent and Default from passed DimensionInst to any DimensionInst stored
     * in given SourceInstance->dimensions, if they match the same Type.
     *
     * @param WmsInstance $instance
     * @param DimensionInst $referenceDimension
     * @deprecated was only used by DimensionsHandler::postSave, which was removed
     *             Now a dangling legacy api fulfillment for @see WmsInstanceEntityHandler::mergeDimension
     */
    public static function reconfigureDimensions(WmsInstance $instance, DimensionInst $referenceDimension)
    {
        foreach ($instance->getDimensions() as $dim) {
            if ($dim->getType() === $referenceDimension->getType()) {
                $dim->setExtent($referenceDimension->getExtent());
                $dim->setDefault($referenceDimension->getDefault());
            }
        }
        $instance->setDimensions($instance->getDimensions());
    }
}
