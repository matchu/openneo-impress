<?php
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_BiologyAsset extends Wearables_SWFAsset {
  protected $type = 'biology';
  
  public function __construct($data=null) {
    if($data) $this->id = $data->part_id;
    parent::__construct($data);
  }
  
  public function setOriginPetType($pet_type) {
    $this->parent_id = &$pet_type->id;
    parent::setOriginPetType($pet_type);
  }
}
?>
