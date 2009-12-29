<?php
class Wearables_Outfit {
  protected function getBiologyAssets() {
    return $this->getPetType()->getAssets();
  }
  
  public function getColor() {
    return $this->getPetType()->getColor();
  }

  protected function getObjectAssets() {
    return array(); // FIXME
  }

  protected function getPetType() {
    return $this->pet_type;
  }
  
  public function getSpecies() {
    return $this->getPetType()->getSpecies();
  }
  
  public function getPreviewHTML() {
    $output = '<ol class="pet-swf-image">';
    $object_assets = $this->getObjectAssets();
    $biology_assets = $this->getBiologyAssets();
    $assets = array_merge($object_assets, $biology_assets);
    foreach($assets as $asset) {
      $output .= $asset->overlayHTML();
    }
    $output .= '</ol>';
    return $output;
  }
}
?>
