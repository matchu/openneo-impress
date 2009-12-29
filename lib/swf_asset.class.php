<?php
require_once dirname(__FILE__).'/db_object.class.php';

class Wearables_SWFAsset extends Wearables_DBObject {
  static $table = 'swf_assets';
  static $columns = array('type', 'id', 'url', 'zone_id', 'zones_restrict',
    'body_id', 'object_id');
  
  public function __construct($data=null) {
    if($data) {
      $this->zone_id = $data->zone_id;
      $this->url = $data->asset_url;
    }
  }
  
  public function overlayHTML() {
    return "<li data-zone-id='$this->zone_id' data-asset-url='$this->url'>"
      ."Zone $this->zone_id: $this->url"
      ."</li>";
  }
  
  public function setOriginPetType($pet_type) {
    $this->body_id = $pet_type->getBodyId();
  }
  
  static function saveCollection($assets, $db) {
    return parent::saveCollection($assets, $db, self::$table, self::$columns);
  }
}
?>
