<?php

namespace Mapbender\CoreBundle\Element;

use Mapbender\Component\Element\AbstractElementService;
use Mapbender\Component\Element\TemplateView;
use Mapbender\CoreBundle\Component\ElementBase\ConfigMigrationInterface;
use Mapbender\CoreBundle\Entity\Element;
use Mapbender\CoreBundle\Utils\ArrayUtil;

/**
 * Featureinfo element
 *
 * This element will provide feature info for most layer types
 *
 * @author Christian Wygoda
 */
class FeatureInfo extends AbstractElementService
    implements ConfigMigrationInterface
{
    /**
     * @inheritdoc
     */
    public static function getClassTitle()
    {
        return "mb.core.featureinfo.class.title";
    }

    /**
     * @inheritdoc
     */
    public static function getClassDescription()
    {
        return "mb.core.featureinfo.class.description";
    }

    /**
     * @inheritdoc
     */
    public function getClientConfiguration(Element $element)
    {
        $config = $element->getConfiguration();
        $defaults = self::getDefaultConfiguration();
        // Amend config values with null defaults to working values
        if (empty($config['width'])) {
            $config['width'] = $defaults['width'];
        }
        if (empty($config['height'])) {
            $config['height'] = $defaults['height'];
        }
        if (empty($config['maxCount']) || $config['maxCount'] < 0) {
            $config['maxCount'] = $defaults['maxCount'];
        }
        return $config + $defaults;
    }

    /**
     * @inheritdoc
     */
    public static function getDefaultConfiguration()
    {
        return array(
            "autoActivate" => false,
            "deactivateOnClose" => true,
            "printResult" => false,
            "onlyValid" => false,
            "displayType" => 'tabs',
            "width" => 700,
            "height" => 500,
            "maxCount" => 100,
            'highlighting' => false,
            'fillColorDefault' => '#ffa500',
            'fillColorHover' => '#ff0000',
            'strokeColorDefault' => '#ff4466',
            'strokeColorHover' => '#ff0000',
            'opacityDefault' => 40,
            'opacityHover' => 70,
            'strokeWidthDefault' => 1,
            'strokeWidthHover' => 3,
        );
    }

    /**
     * @inheritdoc
     */
    public function getWidgetName(Element $element)
    {
        return 'mapbender.mbFeatureInfo';
    }

    /**
     * @inheritdoc
     */
    public static function getType()
    {
        return 'Mapbender\CoreBundle\Element\Type\FeatureInfoAdminType';
    }

    /**
     * @inheritdoc
     */
    public function getRequiredAssets(Element $element)
    {
        return array(
            'js' => array(
                '@MapbenderCoreBundle/Resources/public/mapbender.element.featureInfo.js',
            ),
            'css' => array(
                '@MapbenderCoreBundle/Resources/public/sass/element/featureinfo.scss',
            ),
            'trans' => array(
                'mb.core.featureinfo.error.*',
            ),
        );
    }

    public function getView(Element $element)
    {
        $view = new TemplateView('MapbenderCoreBundle:Element:featureinfo.html.twig');
        $view->attributes['class'] = 'mb-element-featureinfo';
        $view->attributes['data-title'] = $element->getTitle();
        $config = $element->getConfiguration() ?: array();
        $view->variables['displayType'] = ArrayUtil::getDefault($config, 'displayType', 'tabs');
        $view->variables['iframe_scripts'] = array(
            '@MapbenderCoreBundle/Resources/public/element/featureinfo-mb-action.js',
        );
        if (!empty($config['highlighting'])) {
            $view->variables['iframe_scripts'][] = '@MapbenderCoreBundle/Resources/public/element/featureinfo-highlighting.js';
        }
        return $view;
    }

    /**
     * @inheritdoc
     */
    public static function getFormTemplate()
    {
        return 'MapbenderCoreBundle:ElementAdmin:featureinfo.html.twig';
    }

    public static function updateEntityConfig(Element $entity)
    {
        $config = $entity->getConfiguration();
        if (!empty($config['featureColorDefault'])) {
            $config += array('fillColorDefault' => $config['featureColorDefault']);
        }
        if (!empty($config['featureColorHover'])) {
            $config += array('fillColorHover' => $config['featureColorHover']);
        }
        unset($config['featureColorDefault']);
        unset($config['featureColorHover']);
        $entity->setConfiguration($config);
    }
}
