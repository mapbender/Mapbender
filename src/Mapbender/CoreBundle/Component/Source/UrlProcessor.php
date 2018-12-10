<?php


namespace Mapbender\CoreBundle\Component\Source;


use Mapbender\CoreBundle\Component\Exception\SourceNotFoundException;
use Mapbender\CoreBundle\Component\Signer;
use Mapbender\CoreBundle\Component\Source\Tunnel\InstanceTunnelService;
use Mapbender\CoreBundle\Entity\SourceInstance;
use Mapbender\CoreBundle\Utils\UrlUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;

/**
 * Mangles and unmangles source urls.
 */
class UrlProcessor
{
    /** @var RouterInterface */
    protected $router;
    /** @var Signer */
    protected $signer;
    /** @var InstanceTunnelService */
    protected $tunnelService;
    /** @var string */
    protected $proxyRouteName;

    /**
     * @param RouterInterface $router
     * @param Signer $signer
     * @param InstanceTunnelService $tunnelService
     * @param string $proxyRouteName
     */
    public function __construct(RouterInterface $router,
                                Signer $signer,
                                InstanceTunnelService $tunnelService,
                                $proxyRouteName = 'owsproxy3_core_owsproxy_entrypoint')
    {
        $this->router = $router;
        $this->signer = $signer;
        $this->tunnelService = $tunnelService;
        $this->proxyRouteName = $proxyRouteName;
    }

    /**
     * Get base url for owsproxy controller action with no particular url.
     * Application config emits this for client-side proxy stripping / readding.
     *
     * @return string
     */
    public function getProxyBaseUrl()
    {
        return $this->getProxyUrl(array(), RouterInterface::ABSOLUTE_URL);
    }

    /**
     * Modify url to pass over Owsproxy controller action.
     *
     * @param string $url
     * @return string
     */
    public function proxifyUrl($url)
    {
        $params = array(
            'url' => $this->signer->signUrl($url),
        );
        return $this->getProxyUrl($params, RouterInterface::ABSOLUTE_URL);
    }

    /**
     * Tunnelify a fully-formed service request url.
     * This will add non-hidden vendor specifics and potentially other implicit parameters.
     *
     * @param SourceInstance $instance
     * @param string $url with additional GET params (every other part of the url is ignored).
     *        NOTE: AT least the 'request=...' paramter is required!
     * @return string
     * @throws \RuntimeException if
     */
    public function tunnelifyUrl(SourceInstance $instance, $url='')
    {
        return $this->tunnelService->getEndpoint($instance)->generatePublicUrl($url);
    }

    /**
     * Get the public base url of the instance tunnel action corresponding to given $instance.
     * This will include non-hidden vendor specifics and potentially other implicit parameters.
     *
     * @param SourceInstance $instance
     * @return string
     */
    public function getPublicTunnelBaseUrl(SourceInstance $instance)
    {
        return $this->tunnelService->getEndpoint($instance)->getPublicBaseUrl();
    }

    /**
     * Inverse of proxification / tunnelification.
     * Removes proxy controller wrappings, resolves tunnel urls to complete internal urls.
     * If input $url is neither proxified nor tunneled, it gets returned unmodified.
     *
     * @param string $url
     * @param bool $localOnly default false; to also include the host name in matching
     *             NOTE: enabling this will cause conflicts on subdomain load-balancing
     * @return string
     * @throws SourceNotFoundException on tunnel match to deleted instance
     */
    public function getInternalUrl($url, $localOnly = false)
    {
        $routerMatch = UrlUtil::routeParamsFromUrl($this->router, $url, !$localOnly);
        if ($routerMatch) {
            if ($routerMatch['_route'] === $this->proxyRouteName) {
                $fullUrl = Request::create($url)->query->get('url');
                return $this->stripProxySignature($fullUrl);
            } else {
                $tunnelEndpoint = $this->tunnelService->matchRouteParams($routerMatch);
                if ($tunnelEndpoint) {
                    return $tunnelEndpoint->getInternalUrl(Request::create($url));
                }
            }
        }
        // no match, pass back unchanged
        return $url;
    }

    /**
     * Unpacks and returns the 'url' GET parameter from a proxified url. If input $url is
     * not matching the Owsproxy controller action, it gets returned unmodified.
     *
     * @param string $url
     * @param bool $localOnly
     * @return string
     */
    public function deproxifyUrl($url, $localOnly = false)
    {
        $routerMatch = UrlUtil::routeParamsFromUrl($this->router, $url, !$localOnly);
        if ($routerMatch && $routerMatch['_route'] === $this->proxyRouteName) {
            $fullUrl = Request::create($url)->query->get('url');
            return $this->stripProxySignature($fullUrl);
        }
        // no match, pass back unchanged
        return $url;
    }

    /**
     * @param string $url
     * @return string
     */
    public function stripProxySignature($url)
    {
        return preg_replace('#(?<=[\?\&])_signature(=)?[^&\#]*#', '', $url);
    }

    /**
     * Resolves a url targetting the instance tunnel action into the internal URL, including
     * hidden vendor specifics etc.
     * If input $url is not matching the tunnel controller action, it gets returned unmodified.
     *
     * @param string $url
     * @param bool $localOnly
     * @return string
     */
    public function detunnelifyUrl($url, $localOnly = false)
    {
        $tunnelEndpoint = $this->tunnelService->matchUrl($url, $localOnly);
        if ($tunnelEndpoint) {
            return $tunnelEndpoint->getInternalUrl(Request::create($url));
        }
        // no match, pass back unchanged
        return $url;
    }

    /**
     * Convenience method if you already have access to this service but don't want to
     * inject the signer as well.
     *
     * @param string $url
     * @return string
     */
    public function signUrl($url)
    {
        return $this->signer->signUrl($url);
    }

    /**
     * @param string[] $params
     * @param int $refType one of the UrlGeneratorInterface constants
     * @return string
     */
    protected function getProxyUrl($params, $refType)
    {
        return $this->router->generate($this->proxyRouteName, $params, $refType);
    }
}
