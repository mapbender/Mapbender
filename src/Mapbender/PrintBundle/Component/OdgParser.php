<?php
namespace Mapbender\PrintBundle\Component;

use Symfony\Component\HttpFoundation\Response;

class OdgParser
{

    public function __construct($container)
    {
        $this->container = $container;
    }

    private function readOdgFile($template, $file)
    {
        $resource_dir = $this->container->getParameter('kernel.root_dir') . '/Resources/MapbenderPrintBundle';
        $odgfile = $resource_dir . '/templates/' . $template . '.odg';
        $open = zip_open($odgfile);
        while ($zip_entry = zip_read($open)) {
            if (zip_entry_name($zip_entry) == $file) {
                zip_entry_open($open, $zip_entry);
                $xml = zip_entry_read($zip_entry, 51200);
                break;
            }
        }
        zip_close($open);
        return $xml;
    }

    public function getMapSize($template)
    {
        $xml = $this->readOdgFile($template, 'content.xml');
        $doc = new \DOMDocument();
        $doc->loadXML($xml);
        $xpath = new \DOMXPath($doc);

        $node = $xpath->query("//draw:custom-shape[@draw:name='map']");
        $width = $node->item(0)->getAttribute('svg:width');
        $height = $node->item(0)->getAttribute('svg:height');

        $data = array();
        $data['width'] = substr($width, 0, -2);
        $data['height'] = substr($height, 0, -2);

        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->setContent(json_encode($data));
        return $response;
    }

    public function getConf($template)
    {
        $data = array();

        //orientation
        $stylexml = $this->readOdgFile($template, 'styles.xml');
        $doc = new \DOMDocument();
        $doc->loadXML($stylexml);
        $xpath = new \DOMXPath($doc);
        $node = $xpath->query("//style:page-layout-properties");
        $orientation = $node->item(0)->getAttribute('style:print-orientation');
        $data['orientation'] = $orientation;


        $contentxml = $this->readOdgFile($template, 'content.xml');
        $doc = new \DOMDocument();
        $doc->loadXML($contentxml);
        $xpath = new \DOMXPath($doc);


        //$node = $xpath->query("//draw:custom-shape[@draw:name='map']");
        $imagenodes = $xpath->query("//draw:custom-shape");

        foreach ($imagenodes as $node) {
            $name = $node->getAttribute('draw:name');
            $width = $node->getAttribute('svg:width');
            $height = $node->getAttribute('svg:height');
            $x = $node->getAttribute('svg:x');
            $y = $node->getAttribute('svg:y');

            $data[$name]['width'] = substr($width, 0, -2);
            $data[$name]['height'] = substr($height, 0, -2);
            $data[$name]['x'] = substr($x, 0, -2);
            $data[$name]['y'] = substr($y, 0, -2);
        }

        $contextnode = $doc->getElementsByTagName('drawing')->item(0);
        $textnodes = $xpath->query("draw:page/draw:frame", $contextnode);
        foreach ($textnodes as $node) {
            $name = $node->getAttribute('draw:name');
            if ($name == '') {
                continue;
            }
            $width = $node->getAttribute('svg:width');
            $height = $node->getAttribute('svg:height');
            $x = $node->getAttribute('svg:x');
            $y = $node->getAttribute('svg:y');

            $data['fields'][$name]['width'] = substr($width, 0, -2);
            $data['fields'][$name]['height'] = substr($height, 0, -2);
            $data['fields'][$name]['x'] = substr($x, 0, -2);
            $data['fields'][$name]['y'] = substr($y, 0, -2);


            $textnode = $xpath->query("draw:text-box/text:p/text:span", $node)->item(0);
            if ($textnode) {
                $style = $textnode->getAttribute('text:style-name');
                $stylenode = $xpath->query('//style:style[@style:name="' . $style . '"]/style:text-properties');
                $fontsize = $stylenode->item(0)->getAttribute('fo:font-size');
                $font = $stylenode->item(0)->getAttribute('fo:font-family');
                $data['fields'][$name]['fontsize'] = $fontsize;
                $data['fields'][$name]['font'] = $font;
                $trans = $node->getAttribute('draw:transform');
                if($trans) {
                    $matches = array();
                    if(preg_match('/rotate.[(]([^)]+)[)].translate.[(]([0-9.]+)cm.([0-9.]+)cm[)]/', $trans, $matches) === 1) {
                        $data['fields'][$name]['rotation'] = $matches[1];
                        $data['fields'][$name]['x'] = $matches[2];
                        $data['fields'][$name]['y'] = $matches[3];
                    }
                }
            }
        }
        return $data;
    }

}