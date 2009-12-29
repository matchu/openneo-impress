<?php
require_once dirname(__FILE__).'/db_object.class.php';

class Wearables_SWFAsset extends Wearables_DBObject {
  static $columns = array('type', 'id', 'url', 'zone_id', 'zones_restrict',
    'parent_id');
  
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
  
  public function setParent($parent) {
    $this->parent_id = &$parent->id;
  }
  
  static function saveCollection($assets, $db) {
    return parent::saveCollection($assets, $db, self::$columns);
  }
}
?>
