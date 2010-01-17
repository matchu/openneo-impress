<?php
class Pwnage_ObjectAsset extends Pwnage_SwfAsset {
  public $type = 'object';
  
  function __construct($data=null) {
    if($data) {
      $this->id = $data->asset_id;
      $this->parent_id = $data->obj_info_id;
    }
    parent::__construct($data);
  }
  
  function beforeSave() {
    if(!$this->isBodySpecific()) $this->body_id = null;
  }
  
  function getZone() {
    return $this->zone;
  }
  
  function isBodySpecific() {
    return $this->getZone()->type_id < 3;
  }
  
  static function all($options) {
    $options['where'] = self::mergeConditions($options['where'],
      self::$table.'.type = "object"'
    );
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function getAssetsByParents($parent_ids, $options) {
    return parent::getAssetsByParents('object', $parent_ids, $options);
  }
}
?>
