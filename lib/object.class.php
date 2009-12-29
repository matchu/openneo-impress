<?php
require_once dirname(__FILE__).'/object_asset.class.php';

/* Class definition for wearable objects, since that's what Neo calls them */

class Wearables_Object extends Wearables_DBObject {
  static $table = 'objects';
  static $columns = array('id', 'zones_restrict', 'thumbnail_url', 'name',
    'description', 'category', 'type', 'rarity', 'rarity_index', 'price',
    'weight_lbs', 'species_support_ids');
  
  public function __construct($data) {
    foreach($data as $key => $value) {
      $this->$key = $value;
    }
    $this->id = $data->obj_info_id;
  }
  
  protected function beforeSave() {
    $this->species_support_ids = implode(',', $this->species_support);
  }
  
  public function getAssets() {
    return $this->assets;
  }
  
  public function setAssetRegistry($registry) {
    $this->assets = array();
    foreach($this->assets_by_zone as $asset_id) {
      $asset_data = $registry[$asset_id]->getAMFData();
      $this->assets[] = new Wearables_ObjectAsset($asset_data);
    }
  }
  
  static function deepSaveCollection($objects, $db) {
    self::saveCollection($objects, $db, self::$table, self::$columns);
    $assets = array();
    foreach($objects as $object) {
      $assets = array_merge($assets, $object->getAssets());
    }
    Wearables_ObjectAsset::saveCollection($assets, $db);
  }
}
?>
