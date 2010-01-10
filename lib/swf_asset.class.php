<?php
require_once dirname(__FILE__).'/db_object.class.php';
require_once dirname(__FILE__).'/parent_swf_asset_relationship.class.php';
require_once dirname(__FILE__).'/zone.class.php';

class Wearables_SWFAsset extends Wearables_DBObject {
  static $table = 'swf_assets';
  static $columns = array('type', 'id', 'url', 'zone_id', 'zones_restrict',
    'body_id');
  
  public function __construct($data=null) {
    if($data) {
      $this->zone_id = $data->zone_id;
      $this->url = $data->asset_url;
    }
  }
  
  public function getParentId() {
    if(!$this->parent_id) {
      $this->parent_id = $this->parent->getId();
    }
    return $this->parent_id;
  }
  
  public function getZone() {
    return $this->zone;
  }
  
  public function overlayHTML() {
    return "<li data-zone-id='$this->zone_id' "
      ."data-zone-depth='".$this->getZone()->depth."' "
      ."data-asset-url='$this->url'>"
      ."Zone $this->zone_id: $this->url"
      ."</li>";
  }
  
  public function setOriginPetType($pet_type) {
    $this->body_id = $pet_type->getBodyId();
  }
  
  static function all($options, $table=null, $subclass=__CLASS__) {
    if(!$table) $table = self::$table;
    if(!$options['select']) $options['select'] = 'zone_id, url';
    return parent::all($options, $table, $subclass);
  }
  
  static function preloadZonesForCollection($assets, $options=array()) {
    $assets_by_zone = array();
    $assets_needing_zones = 0;
    foreach($assets as &$asset) {
      if($asset->zone) continue;
      $assets_by_zone[$asset->zone_id][] = &$asset;
      $assets_needing_zones++;
    }
    if($assets_needing_zones > 1) {
      $options = array_merge(array(
        'select' => 'id, depth',
        'where' => 'id IN ('.implode(', ', array_keys($assets_by_zone)).')'
      ), $options);
      $zones = Wearables_Zone::all($options);
      foreach($zones as &$zone) {
        foreach($assets_by_zone[$zone->id] as &$asset) {
          $asset->zone = &$zone;
        }
      }
    }
  }
  
  static function saveCollection($assets) {
    self::preloadZonesForCollection($assets, array(
      'select' => 'id, depth, type_id'
    ));
    $relationships = array();
    foreach($assets as $asset) {
      $relationships[] =
        new Wearables_ParentSWFAssetRelationship($asset);
    }
    $db = Wearables_DB::getInstance();
    $db->beginTransaction();
    try {
      parent::saveCollection($assets, self::$table, self::$columns);
      Wearables_ParentSWFAssetRelationship::saveCollection($relationships);
    } catch(PDOException $e) {
      $db->rollBack();
    }
    $db->commit();
  }
  
  static function getAssetsByParents($type, $parent_ids, $options) {
    $parent_ids = implode(', ', array_map('intval', $parent_ids));
    $where = Wearables_SWFAsset::mergeConditions(
      "swf_assets.type = \"$type\" AND parents_swf_assets.parent_id IN ($parent_ids)",
      $options['where']
    );
    return Wearables_SWFAsset::all(array(
      'select' => $options['select'],
      'joins' => 'INNER JOIN parents_swf_assets ON '
                .'parents_swf_assets.swf_asset_type = swf_assets.type AND '
                .'parents_swf_assets.swf_asset_id = swf_assets.id '.$options['joins'],
      'where' => $where
    ));
  }
}
?>
