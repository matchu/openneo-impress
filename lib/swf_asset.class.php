<?php
class Wearables_SWFAsset {
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
  
  public function getValueSet($db) {
    if($this->parent) $this->parent_id = $this->parent->id;
    $values = array();
    foreach(self::$columns as $column) {
      $values[] = $db->quote($this->$column);
    }
    return '('.implode(', ', $values).')';
  }
  
  static function saveCollection($assets, $db) {
    $value_sets = array();
    foreach($assets as $asset) {
      $value_sets[] = $asset->getValueSet($db);
    }
    $db->exec('REPLACE INTO swf_assets ('.implode(', ', self::$columns).')'
      .' VALUES '.implode(', ', $value_sets));
  }
}
?>
