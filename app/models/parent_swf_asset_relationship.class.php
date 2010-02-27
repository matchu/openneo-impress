<?php
class Pwnage_ParentSwfAssetRelationship extends PwnageCore_DbObject {
  static $table = 'parents_swf_assets';
  static $columns = array('parent_id', 'swf_asset_id', 'swf_asset_type');
  
  public function __construct($asset=null) {
    if($asset) {
      $this->parent_id = $asset->getParentId();
      $this->swf_asset_id = $asset->id;
      $this->swf_asset_type = $asset->type;
    }
  }
  
  public function getParentId() {
    return $this->parent_id;
  }
  
  public function getSwfAssetId() {
    return $this->swf_asset_id;
  }
  
  static function all($options) {
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function saveCollection($objs) {
    return parent::saveCollection($objs, self::$table, self::$columns);
  }
}
?>
