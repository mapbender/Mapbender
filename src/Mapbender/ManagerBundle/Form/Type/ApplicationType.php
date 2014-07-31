<?php

namespace Mapbender\ManagerBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Mapbender\ManagerBundle\Form\EventListener\RegionSubscriber;

class ApplicationType extends AbstractType
{

    public function getName()
    {
        return 'application';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'available_templates' => array(),
            'available_properties' => array()
        ));
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            // Base data
            ->add('title', 'text', array(
                'attr' => array(
                    'title' => 'The application title, as shown in the browser '
                    . 'title bar and in lists.')))
            ->add('slug', 'text', array(
                'label' => 'URL title',
                'attr' => array(
                    'title' => 'The URL title (slug) is based on the title and used in the '
                    . 'application URL.')))
            ->add('description', 'textarea', array(
                'required' => false,
                'attr' => array(
                    'title' => 'The description is used in overview lists.')))
            ->add('template', 'choice', array(
                'choices' => $options['available_templates'],
                'attr' => array(
                    'title' => 'The HTML template used for this '
                    . 'application.')))
            ->add('screenshotFile', 'file',
                array('label' => 'Screenshot',
                'attr' => array(
                    'title' => 'Screenshot',
                    'required' => false,
                    'accept'=>'image/jpeg,image/png,image/gif')))
            // Flag if set true, then screenshot should be 
            ->add('removeScreenShot', 'hidden',array(
                'mapped' => false
            ))
            ->add('regionProperties', 'collection', array(
                'type' => new RegionPropertiesType(),
                'options' => array(
                    'data_class' => 'Mapbender\CoreBundle\Entity\RegionProperties',
                    'available_properties' => $options['available_properties'],
                    'auto_initialize' => false,
                    'allow_add' => true,
//                    'allow_delete' => true,
            )))
            ->add('published', 'checkbox', array(
                'required' => false,
                'label' => 'Published'));

        // Security
        $builder->add('acl', 'acl', array(
            'mapped' => false,
            'data' => $options['data'],
            'permissions' => 'standard::object'));
    }

}
