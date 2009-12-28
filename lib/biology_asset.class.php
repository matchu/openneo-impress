<?php
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_BiologyAsset extends Wearables_SWFAsset {
  protected $type = 'biology';
  
  function __construct($data) {
    $this->id = $data->part_id;
    parent::__construct($data);
  }
}
?>
