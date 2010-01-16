<?php
class Pwnage_ParentSwfAssetRelationship extends PwnageCore_DbObject {
  static $table = 'parents_swf_assets';
  static $columns = array('parent_id', 'swf_asset_id', 'swf_asset_type');
  
  function __construct($asset) {
    $this->parent_id = $asset->getParentId();
    $this->swf_asset_id = $asset->id;
    $this->swf_asset_type = $asset->type;
  }
  
  static function saveCollection($objs) {
    return parent::saveCollection($objs, self::$table, self::$columns);
  }
}
?>
