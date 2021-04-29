<?php

namespace FOM\UserBundle;

use FOM\UserBundle\DependencyInjection\Compiler\ForwardUserEntityClassPass;
use Mapbender\ManagerBundle\Component\Menu\MenuItem;
use Mapbender\ManagerBundle\Component\Menu\RegisterMenuRoutesPass;
use Symfony\Bundle\SecurityBundle\DependencyInjection\SecurityExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use FOM\UserBundle\DependencyInjection\Factory\SspiFactory;
use Mapbender\ManagerBundle\Component\ManagerBundle;

/**
 * FOMUserBundle - provides user management
 *
 * @author Christian Wygoda
 */
class FOMUserBundle extends ManagerBundle
{
    public function build(ContainerBuilder $container)
    {
        /** @var SecurityExtension $extension */
        $extension = $container->getExtension('security');
        $extension->addSecurityListenerFactory(new SspiFactory());
        $this->addMenu($container);
        $container->addCompilerPass(new ForwardUserEntityClassPass('fom.user_entity', 'FOM\UserBundle\Entity\User'));
    }

    protected function addMenu(ContainerBuilder $container)
    {
        $securityItem = MenuItem::create('mb.terms.security', false)
            ->setWeight(100)
            ->addChildren(array(
                MenuItem::create('fom.user.userbundle.users', 'fom_user_user_index'),
                MenuItem::create('fom.user.userbundle.new_user', 'fom_user_user_create')
                    ->requireEntityGrant('FOM\UserBundle\Entity\User', 'CREATE'),
                MenuItem::create('fom.user.userbundle.groups', 'fom_user_group_index')
                    ->requireEntityGrant('FOM\UserBundle\Entity\Group', 'VIEW'),
                MenuItem::create('fom.user.userbundle.new_group', 'fom_user_group_create')
                    ->requireEntityGrant('FOM\UserBundle\Entity\Group', 'CREATE'),
                MenuItem::create('fom.user.userbundle.acls', 'fom_user_acl_index')
                    ->requireEntityGrant('Symfony\Component\Security\Acl\Domain\Acl', 'EDIT'),
            ))
        ;
        $groupItem = MenuItem::create('fom.user.userbundle.groups', 'fom_user_group_index')
            ->setWeight(110)
            ->addChildren(array(
            ))
        ;
        $aclItem = MenuItem::create('fom.user.userbundle.acls', 'fom_user_acl_index')
            ->setWeight(120)
            ->requireEntityGrant('Symfony\Component\Security\Acl\Domain\Acl', 'EDIT')
        ;
        $container->addCompilerPass(new RegisterMenuRoutesPass($securityItem));
    }

    public function getACLClasses()
    {
        $trans = $this->container->get('translator');
        return array(
            'Symfony\Component\Security\Acl\Domain\Acl' => $trans->trans("fom.user.userbundle.classes.acls"),
            'FOM\UserBundle\Entity\User' => $trans->trans("fom.user.userbundle.classes.users"),
            'FOM\UserBundle\Entity\Group' => $trans->trans("fom.user.userbundle.classes.groups"),
        );
    }
}
