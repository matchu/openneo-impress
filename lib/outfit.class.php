<?php
require_once dirname(__FILE__).'/swf_asset_parent.class.php';
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_Outfit {
  private $objects = array();
  
  public function addObjectById($object_id) {
    $object = Wearables_Object::find($object_id, array('select' => 'id, name'));
    $this->objects[] = $object;
  }
  
  protected function getAssets() {
    if(!$this->assets) {
      Wearables_SWFAssetParent::preloadAssetsForCollection($this->getPetType(), $this->getObjects());
      $this->assets = array_merge($this->getBiologyAssets(), $this->getObjectAssets());
    }
    return $this->assets;
  }

  protected function getBiologyAssets() {
    return $this->getPetType()->getAssets();
  }
  
  public function getColor() {
    return $this->getPetType()->getColor();
  }

  protected function getObjectAssets() {
    if(!$this->object_assets) {
      $this->object_assets = array();
      foreach($this->getObjects() as $object) {
        $this->object_assets = array_merge($this->object_assets,
          $object->getAssets(array(
            'where' => 'body_id = '.intval($this->getPetType()->getBodyId())
          )));
      }
    }
    return $this->object_assets;
  }
  
  protected function getObjects() {
    return $this->objects;
  }

  protected function getPetType() {
    return $this->pet_type;
  }
  
  public function getSpecies() {
    return $this->getPetType()->getSpecies();
  }
  
  public function getPreviewHTML() {
    Wearables_SWFAsset::preloadZonesForCollection($this->getAssets());
    $output = '<ol class="pet-swf-image">';
    $assets = $this->getAssets();
    foreach($assets as $asset) {
      $output .= $asset->overlayHTML();
    }
    $output .= '</ol>';
    return $output;
  }
}
?>
