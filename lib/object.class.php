<?php
require_once dirname(__FILE__).'/object_asset.class.php';

/* Class definition for wearable objects, since that's what Neo calls them */

class Wearables_Object extends Wearables_DBObject {
  const CLASS_NAME = 'Wearables_Object';
  static $table = 'objects';
  static $columns = array('id', 'zones_restrict', 'thumbnail_url', 'name',
    'description', 'category', 'type', 'rarity', 'rarity_index', 'price',
    'weight_lbs', 'species_support_ids');
  
  public function __construct($data=null) {
    if($data) {
      foreach($data as $key => $value) {
        $this->$key = $value;
      }
      $this->id = $data->obj_info_id;
    }
  }
  
  protected function beforeSave() {
    $this->species_support_ids = implode(',', $this->species_support);
  }
  
  public function getAssets($query_options=array()) {
    if(!$this->assets) {
      if($this->assets_by_zone) {
        $this->assets = array();
        foreach($this->assets_by_zone as $asset_id) {
          $asset_data = $this->asset_registry[$asset_id]->getAMFData();
          $asset = new Wearables_ObjectAsset($asset_data);
          $asset->setOriginPetType($this->origin_pet_type);
          $this->assets[] = $asset;
        }
      } else {
        $query_options['where'] = self::mergeConditions(
          $query_options['where'],
          'type = "object" AND parent_id = '.intval($this->id)
        );
        $this->assets = Wearables_ObjectAsset::all($query_options);
      }
    }
    return $this->assets;
  }
  
  public function setAssetRegistry($registry) {
    $this->asset_registry = &$registry;
  }
  
  public function setAssetOrigin($pet) {
    foreach($this->assets as $asset) {
      $asset->body_id = $pet->getBodyId();
    }
  }
  
  public function setOriginPetType($pet_type) {
    $this->origin_pet_type = &$pet_type;
  }
  
  static function all($options=array()) {
    return parent::all($options, self::$table, self::CLASS_NAME);
  }
  
  static function find($id, $options=array()) {
    return parent::find($id, $options, self::$table, self::CLASS_NAME);
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
