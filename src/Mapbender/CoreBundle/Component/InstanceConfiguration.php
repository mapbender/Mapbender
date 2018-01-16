<?php
namespace Mapbender\CoreBundle\Component;

/**
 * Description of SourceConfiguration
 *
 * @author Paul Schmidt
 */
abstract class InstanceConfiguration
{
    /**
     * @var string
     */
    public $type;

    /**
     * @var string
     */
    public $title;

    /**
     * @var InstanceConfigurationOptions
     */
    public $options;

    /**
     * @var array
     */
    public $children;
    
    /**
     * @var boolean
     */
    public $isBaseSource = true;

    /**
     * InstanceConfiguration constructor.
     */
    public function __construct()
    {
        $this->children = array();
    }

    /**
     * Sets a type
     *
     * @param string $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Returns a type
     * 
     * @return string type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Sets a title
     * 
     * @param string $title title
     * @return InstanceConfiguration 
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Returns a title
     * 
     * @return string title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Sets a isBaseSource
     * 
     * @param boolean $isBaseSource isBaseSource
     * @return InstanceConfiguration 
     */
    public function setIsBaseSource($isBaseSource)
    {
        $this->isBaseSource = $isBaseSource;
        return $this;
    }

    /**
     * Returns a isBaseSource
     * 
     * @return boolean isBaseSource
     */
    public function getIsBaseSource()
    {
        return $this->isBaseSource;
    }
    
    /**
     * Sets options
     * 
     * @param InstanceConfigurationOptions $options ServiceConfigurationOptions
     * @return InstanceConfiguration 
     */
    public abstract function setOptions(InstanceConfigurationOptions $options);

    /**
     * Returns options
     * 
     * @return InstanceConfigurationOptions|null
     */
    public abstract function getOptions();

    /**
     * Sets a children
     * 
     * @param array $children children
     * @return InstanceConfiguration 
     */
    public abstract function setChildren($children);

    /**
     * Returns a title
     * 
     * @return array children
     */
    public abstract function getChildren();
    
    /**
     * Returns InstanceConfiguration as array
     * 
     * @return array
     */
    public abstract function toArray();
    
    /**
     * Creates an InstanceConfiguration from options
     * 
     * @param array $options array with options
     * @return InstanceConfiguration
     */
    public static function fromArray($options)
    {
        if($options && is_array($options))
        {
            if(isset($options['type']) && $options['type'] === 'wms'){
                return \Mapbender\WmsBundle\Component\WmsInstanceConfiguration::fromArray($options);
            }
        }
        return null;
    }

}

