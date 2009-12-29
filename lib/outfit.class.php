<?php
class Wearables_Outfit {
  public function getObjectAssets() {
    return array(); // FIXME
  }

  public function getPetType() {
    return $this->pet_type;
  }
  
  public function getPreviewHTML() {
    $output = '<ol class="pet-swf-image">';
    $object_assets = $this->getObjectAssets();
    $biology_assets = $this->getPetType()->getAssets();
    $assets = array_merge($object_assets, $biology_assets);
    foreach($assets as $asset) {
      $output .= $asset->overlayHTML();
    }
    $output .= '</ol>';
    return $output;
  }
}
?>
