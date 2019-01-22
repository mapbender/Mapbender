<?php
namespace Mapbender\CoreBundle\Asset;

use Assetic\Asset\StringAsset;
use Assetic\Filter\FilterInterface;
use Symfony\Component\Config\FileLocatorInterface;
use Symfony\Component\Templating\EngineInterface;

/**
 * Compiles and merges JavaScript, (S)CSS and translation assets.
 * Registered in container at mapbender.asset_compiler.service
 *
 * @author Christian Wygoda <christian.wygoda@wheregroup.com>
 * @author Andriy Oblivantsev <andriy.oblivantsev@wheregroup.com>
 * @package Mapbender\CoreBundle\Asset
 */
class AssetFactory extends AssetFactoryBase
{
    /** @var FilterInterface */
    protected $sassFilter;
    /** @var FilterInterface */
    protected $cssRewriteFilter;
    /** @var EngineInterface */
    protected $templateEngine;

    /**
     * @param FileLocatorInterface $fileLocator
     * @param string $webDir
     * @param EngineInterface $templateEngine
     * @param FilterInterface $sassFilter
     * @param FilterInterface $cssRewriteFilter
     */
    public function __construct(FileLocatorInterface $fileLocator,
                                $webDir,
                                EngineInterface $templateEngine,
                                FilterInterface $sassFilter,
                                FilterInterface $cssRewriteFilter)
    {
        $this->sassFilter = $sassFilter;
        $this->cssRewriteFilter = $cssRewriteFilter;
        $this->templateEngine = $templateEngine;
        parent::__construct($fileLocator, $webDir);
    }

    /**
     * Perform simple concatenation of all input assets. Some uniquification will take place.
     *
     * @param (FileAsset|StringAsset)[] $inputs
     * @return string
     */
    public function compileRaw($inputs)
    {
        return $this->buildAssetCollection($inputs, null)->dump();
    }

    /**
     * @param (StringAsset|string)[] $inputs
     * @param string $sourcePath for adjusting relative urls in css rewrite filter
     * @param string $targetPath
     * @param bool $minify
     * @return string
     */
    public function compileCss($inputs, $sourcePath, $targetPath, $minify=false)
    {
        $content = $this->buildAssetCollection($inputs, $targetPath)->dump();

        $sass = clone $this->sassFilter;
        $sass->setStyle($minify ? 'nested' : 'compressed');
        $filters = array(
            $sass,
            $this->cssRewriteFilter,
        );
        $content = $this->squashImports($content);

        $assets = new StringAsset($content, $filters, '/', $sourcePath);
        $assets->setTargetPath($targetPath);
        return $assets->dump();
    }

    /**
     * @param string[] $inputs names of json.twig files
     * @return string JavaScript initialization code
     */
    public function compileTranslations($inputs)
    {
        $translations = array();
        foreach ($inputs as $transAsset) {
            $renderedTranslations = json_decode($this->templateEngine->render($transAsset), true);
            $translations = array_merge($translations, $renderedTranslations);
        }
        $translationsJson = json_encode($translations, JSON_FORCE_OBJECT);
        $jsLogic = $this->templateEngine->render($this->getTranslationLogicTemplate());
        return $jsLogic . "\nMapbender.i18n = {$translationsJson};";
    }

    /**
     * @return string a twig path
     */
    protected function getTranslationLogicTemplate()
    {
        return '@MapbenderCoreBundle/Resources/public/mapbender.trans.js';
    }

    /**
     * @param $content
     * @return string
     */
    protected function squashImports($content)
    {
        preg_match_all('/\@import\s*\".*?;/s', $content, $imports, PREG_SET_ORDER);
        $imports = array_map(function($item) {
            return $item[0];
        }, $imports);
        $imports = array_unique($imports);
        $content = preg_replace('/\@import\s*\".*?;/s', '', $content);

        return implode($imports, "\n") . "\n" . $content;
    }

}
