<?php


namespace Mapbender\WmsBundle\Command;

use Mapbender\ManagerBundle\Form\Model\HttpOriginModel;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Console command mapbender:wms:reload:file
 */
class FileReloadCommand extends AbstractCapabilitiesProcessingCommand
{

    protected function configure()
    {
        $this
            ->setName('mapbender:wms:reload:file')
            ->setDescription('Reloads a WMS source from given capabilities document file')
            ->addArgument('id', InputArgument::REQUIRED, 'Id of the source')
            ->addArgument('path', InputArgument::REQUIRED)
            ->addOption('validate', null, InputOption::VALUE_NONE)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $targetId = $input->getArgument('id');
        $target = $this->getSourceById($targetId);
        $reloaded = $this->getReloadSource($input->getArgument('path'), $input);
        $initialOrigin = HttpOriginModel::extract($target);
        $em = $this->getEntityManager();
        $em->beginTransaction();
        try {
            $em->persist($target);
            $instanceUpdateOptions = $this->getImporter()->getDefaultInstanceUpdateOptions($target);
            $this->getImporter()->updateSource($target, $reloaded, $instanceUpdateOptions);
            // Restore origin url and credentials (source from file import produces empty values)
            $this->getImporter()->updateOrigin($target, $initialOrigin);
            $em->flush();
            $em->commit();
        } catch (\Exception $e) {
            $em->rollback();
            throw $e;
        }
    }

    protected function getReloadSource($path, InputInterface $input)
    {
        if (!\file_exists($path) || !\is_readable($path)) {
            throw new \LogicException("No such file or file not readable");
        }
        $content = \file_get_contents($path);
        if ($this->getValidationOption($input)) {
            $this->getImporter()->validateResponseContent($content);
        }
        return  $this->getImporter()->parseResponseContent($content);
    }

    protected function getValidationOption(InputInterface $input)
    {
        return $input->getOption('validate');
    }
}
