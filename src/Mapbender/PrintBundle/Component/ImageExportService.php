<?php
namespace Mapbender\PrintBundle\Component;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * Image export service.
 *
 * @author Stefan Winkelmann
 */
class ImageExportService
{

    protected $data;
    protected $format;

    /** @var  array */
    protected $requests;

    /** @var  int */
    protected $image_height;

    /** @var  int */
    protected $image_width;

    public function __construct($container)
    {
        $this->container = $container;
        $this->tempdir = sys_get_temp_dir();
    }

    /**
     * Todo
     *
     * @param $content
     */
    public function export($content)
    {
        $this->data     = $content;
        $this->format   = $content['format'];
        $this->requests = $content['requests'];
        $this->getImages();
    }

    /**
     * Todo
     *
     */
    private function getImages()
    {
        $temp_names = array();
        foreach ($this->requests as $k => $url) {

            $url    = strstr($url, '&WIDTH', true);
            $width  = '&WIDTH=' . $this->data['width'];
            $height = '&HEIGHT=' . $this->data['height'];
            $url .= $width . $height;
            
            $this->container->get("logger")->debug("Image Export Request Nr.: " . $k . ' ' . $url);
            $attributes = array();
            $attributes['_controller'] = 'OwsProxy3CoreBundle:OwsProxy:entryPoint';
            $subRequest = new Request(array(
                'url' => $url
                ), array(), $attributes, array(), array(), array(), '');
            $response = $this->container->get('http_kernel')->handle($subRequest,
                HttpKernelInterface::SUB_REQUEST);

            $tempdir = $this->tempdir;
            $imagename = tempnam($tempdir, 'mb_imgexp');
            $temp_names[] = $imagename;

            file_put_contents($imagename, $response->getContent());
            $im = null;
            switch (trim($response->headers->get('content-type'))) {
                case 'image/png; mode=8bit' : 
                case 'image/png' :
                    $im = imagecreatefrompng($imagename);
                    break;
                case 'image/jpeg' :
                    $im = imagecreatefromjpeg($imagename);
                    break;
                case 'image/gif' :
                    $im = imagecreatefromgif($imagename);
                    break;
                default:
                    continue;
                    $this->container->get("logger")->debug("Unknown mimetype " . trim($response->headers->get('content-type')));
                //throw new \RuntimeException("Unknown mimetype " . trim($response->headers->get('content-type')));
            }

            if ($im !== null) {
                imagesavealpha($im, true);
                imagepng($im, $imagename);

                $this->image_width = imagesx($im);
                $this->image_height = imagesy($im);
            }
        }

        // create final merged image
        $finalimagename = tempnam($tempdir, 'mb_imgexp_merged');
        $finalImage = imagecreatetruecolor($this->image_width,
            $this->image_height);
        $bg = ImageColorAllocate($finalImage, 255, 255, 255);
        imagefilledrectangle($finalImage, 0, 0, $this->image_width,
            $this->image_height, $bg);
        imagepng($finalImage, $finalimagename);
        foreach ($temp_names as $temp_name) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            if (is_file($temp_name) && finfo_file($finfo, $temp_name) == 'image/png') {
                $dest = imagecreatefrompng($finalimagename);
                $src = imagecreatefrompng($temp_name);
                imagecopy($dest, $src, 0, 0, 0, 0, $this->image_width,
                    $this->image_height);
                imagepng($dest, $finalimagename);
            }
            unlink($temp_name);
            finfo_close($finfo);
        }

        $image = imagecreatefrompng($finalimagename);
        header("Content-type: image/" . ($this->format == 'jpg' ? 'jpeg' : $this->format));
        header("Content-Disposition: attachment; filename=export_" . date("YmdHis") . "." . $this->format);
        header('Content-Length: ' . filesize($finalimagename));
        if ($this->format == 'png') {
            imagepng($image);
        } else {
            imagejpeg($image, null, 85);
        }
        unlink($finalimagename);
        exit();
    }
}
