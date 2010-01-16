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

class Pwnage_ObjectAssetAPIAccessor extends Pwnage_ApiAccessor {
  public function findByParentIdsAndBodyId($params) {
    if(!$params['parent_ids']) return array();
    $asset_select = array('id', 'url', 'zone_id', 'depth', 'parent_id', 'is_body_specific');
    return $this->resultObjects(Pwnage_ObjectAsset::getAssetsByParents(
      $params['parent_ids'], array(
        'select' => 'swf_assets.id, url, zone_id, depth, parents_swf_assets.parent_id, z.type_id < 3 as is_body_specific',
        'joins' => 'INNER JOIN zones z ON z.id = swf_assets.zone_id',
        'where' => '(body_id = '.intval($params['body_id']).' OR body_id = 0)'
      )
    ), $asset_select);
  }
}
?>
