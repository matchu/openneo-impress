<?php
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_ObjectAsset extends Wearables_SWFAsset {
  protected $type = 'object';
  
  function __construct($data) {
    $this->id = $data->asset_id;
    $this->parent_id = $data->obj_info_id;
    parent::__construct($data);
  }
}
?>
