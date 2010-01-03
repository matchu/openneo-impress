<?php
require_once dirname(__FILE__).'/api_accessor.class.php';
require_once dirname(__FILE__).'/swf_asset.class.php';
require_once dirname(__FILE__).'/zone.class.php';

class Wearables_ObjectAsset extends Wearables_SWFAsset {
  protected $type = 'object';
  
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
}

class Wearables_ObjectAssetAPIAccessor extends Wearables_APIAccessor {
  public function findByParentIdsAndBodyId($params) {
    if(!$params['parent_ids']) return array();
    $parent_ids = implode(', ', array_map('intval', $params['parent_ids']));
    $asset_select = array('url', 'zone_id', 'depth', 'parent_id', 'is_body_specific');
    return $this->resultObjects(Wearables_ObjectAsset::all(array(
      'select' => 'url, zone_id, depth, parent_id, z.type_id < 3 as is_body_specific',
      'joins' => 'INNER JOIN zones z ON z.id = swf_assets.zone_id',
      'where' => 'swf_assets.parent_id IN ('.$parent_ids.') AND '
        .'(body_id = '.intval($params['body_id']).' OR body_id = 0)'
    )), $asset_select);
  }
}
?>
