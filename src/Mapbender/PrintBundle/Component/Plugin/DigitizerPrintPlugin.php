<?php


namespace Mapbender\PrintBundle\Component\Plugin;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Extends PrintClient http API with a "getDigitizerTemplates" action
 *
 * @todo: This belongs in the Digitizer bundle (separate repository); included here only for historical reasons.
 *        The equivalent non-plugin implementation shipped with Mapbender itself, not as part of Digitizer.
 * @todo: TBD if there's any reason against performing the entire template rewriting magic server side, with no http
 *        interaction at all.
 */
class DigitizerPrintPlugin implements PluginBaseInterface, PrintClientHttpPluginInterface
{
    /** @var ContainerInterface */
    protected $container;
    /** @var string */
    protected $featureTypeParamName;

    /**
     * @param ContainerInterface $container
     * @param $featureTypeParamName
     */
    public function __construct(ContainerInterface $container, $featureTypeParamName)
    {
        $this->container = $container;
        $this->featureTypeParamName = $featureTypeParamName;
    }

    public function getDomainKey()
    {
        return 'digitizer';
    }

    public function handleHttpRequest(Request $request)
    {
        switch ($request->attributes->get('action')) {
            case 'getDigitizerTemplates':
                $featureType = $request->get('schemaName');
                $featureTypeConfig = $this->container->getParameter($this->featureTypeParamName);
                $templates = $featureTypeConfig[$featureType]['print']['templates'];

                if (!isset($templates)) {
                    throw new \RuntimeException('Template configuration missing');
                }
                return new JsonResponse($templates);
            default:
                return null;
        }
    }
}
