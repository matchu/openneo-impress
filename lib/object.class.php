<?php
require_once dirname(__FILE__).'/object_asset.class.php';

/* Class definition for wearable objects, since that's what Neo calls them */

class Wearables_Object extends Wearables_DBObject {
  public function __construct($data) {
    foreach($data as $key => $value) {
      $this->$key = $value;
    }
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
}
?>
