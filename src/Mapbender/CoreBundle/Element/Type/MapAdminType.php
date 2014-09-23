<?php

namespace Mapbender\CoreBundle\Element\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Mapbender\CoreBundle\Form\Type\ExtentType;
use Mapbender\CoreBundle\Form\EventListener\MapFieldSubscriber;

/**
 * 
 */
class MapAdminType extends AbstractType
{

    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'map';
    }

    /**
     * @inheritdoc
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'application' => null,
            'available_templates' => array()));
    }

    /**
     * @inheritdoc
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $subscriber = new MapFieldSubscriber($builder->getFormFactory());
        $builder->addEventSubscriber($subscriber);
        $builder
            ->add('layerset', 'app_layerset',
                array(
                'application' => $options['application'],
                'property_path' => '[layerset]',
                'required' => true))
            ->add('dpi', 'text', array(
                'label' => 'DPI'))
            ->add('srs', 'text', array(
                'label' => 'SRS'))
            ->add('units', 'choice',
                array(
                'label' => 'Map units',
                'choices' => array(
                    'degrees' => 'Degrees',
                    'm' => 'Meters',
                    'ft' => 'Feet',
                    'mi' => 'Miles',
                    'inches' => 'Inches')))
            ->add('extent_max', new ExtentType(),
                array(
                'label' => 'Max. extent',
                'property_path' => '[extents][max]'))
            ->add('extent_start', new ExtentType(),
                array(
                'label' => 'Start. extent',
                'property_path' => '[extents][start]'))
            ->add('scales', 'text',
                array(
                'label' => 'Scales (csv)',
                'required' => true))
            ->add('maxResolution', 'text', array(
                'label' => 'Max. resolution'))
            ->add('imgPath', 'text', array(
                'label' => 'OL image path'))
            ->add('otherSrs', 'text',
                array(
                'label' => 'Other SRS',
                'required' => false));
    }

}
