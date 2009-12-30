<?php
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_ObjectAsset extends Wearables_SWFAsset {
  protected $type = 'object';
  
  function __construct($data=null) {
    if($data) {
      $this->id = $data->asset_id;
      $this->parent_id = $data->obj_info_id;
    }
    parent::__construct($data);
  }
  
  static function all($options) {
    $options['where'] = self::mergeConditions($options['where'],
      'type = "object"'
    );
    return parent::all($options, self::$table, __CLASS__);
  }
}
?>
