<?php
class Wearables_SWFImageAsset {
  private $data;

  public function __construct($data) {
    $this->data = $data;
  }
  
  public function overlayHTML() {
    $asset_url = $this->data->asset_url;
    $zone_id = $this->data->zone_id;
    return "<li data-zone-id='$zone_id' data-asset-url='$asset_url'>"
      ."Zone $zone_id: $asset_url"
      ."</li>";
  }
}
?>
