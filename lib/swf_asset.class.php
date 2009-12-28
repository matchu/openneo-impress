<?php
class Wearables_SWFAsset {
  static $columns = array('type', 'id', 'url', 'zone_id', 'zones_restrict');

  public function __construct($data) {
    $this->zone_id = $data->zone_id;
    $this->url = $data->asset_url;
  }
  
  public function overlayHTML() {
    return "<li data-zone-id='$this->zone_id' data-asset-url='$this->url'>"
      ."Zone $this->zone_id: $this->url"
      ."</li>";
  }
  
  public function getValueSet($db) {
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
    $db->query('REPLACE INTO swf_assets ('.implode(', ', self::$columns).')'
      .' VALUES '.implode(', ', $value_sets));
  }
}
?>
