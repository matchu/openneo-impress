<?php
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_BiologyAsset extends Wearables_SWFAsset {
  protected $type = 'biology';
  
  public function __construct($data=null) {
    if($data) $this->id = $data->part_id;
    parent::__construct($data);
  }
  
  public function beforeSave() {
    $this->parent_id = $this->parent->getId();
  }
  
  public function setOriginPetType($pet_type) {
    $this->parent = &$pet_type;
    parent::setOriginPetType($pet_type);
  }
  
  static function all($options) {
    $options['where'] = self::mergeConditions($options['where'],
      self::$table.'.type = "biology"'
    );
    return parent::all($options, self::$table, __CLASS__);
  }
}
?>
