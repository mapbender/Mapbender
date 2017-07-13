<?php

namespace Mapbender\CoreBundle\Command;

use Doctrine\ORM\EntityManager;
use Mapbender\CoreBundle\Entity\Element;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class DatabaseUpgradeCommand
 *
 */
class DatabaseUpgradeCommand extends ContainerAwareCommand {

    protected function configure() {
        $this
            ->setHelp('The <info>mapbender:database:upgrade</info> command updates the Datesbase to the new schema of mapbender version 3.0.6')
            ->setName('mapbender:database:upgrade')
            ->setDescription('Updates database scheme');
    }


    /**
     * Execute command
     * @Todo Add logic to execute different action depended on the used MB3 Version
     * @param InputInterface  $input
     * @param OutputInterface $output
     * @return int|null|void
     */

    protected function execute(InputInterface $input, OutputInterface $output) {
        $this->changeMapsImagePath();
    }

    /**
     * Change imagesPath configuration value from all MB3 map elements in the database
     * from  "bundles/mapbendercore/mapquery/lib/openlayers/img"
     * to "components/mapquery/lib/openlayers/img"
     */
    protected function changeMapsImagePath(){

        /**
         * @var EntityManager $em
         * @var Element $map
         */
        $doctrine=$this->getContainer()->get('doctrine');
        $em = $doctrine->getManager();
        $maps = $em->getRepository('MapbenderCoreBundle:Element')->findBy(array('class'=>'Mapbender\CoreBundle\Element\Map'));
        foreach ($maps as $map) {
            $config = $map->getConfiguration();

            if ($config['imgPath'] == 'bundles/mapbendercore/mapquery/lib/openlayers/img') {
                $config['imgPath']= 'components/mapquery/lib/openlayers/img';
                $map->setConfiguration($config);
                $em->persist($map);
            }
        }
        $em->flush();
    }
}

