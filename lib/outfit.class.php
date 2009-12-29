<?php
class Wearables_Outfit {
  private $objects = array();
  
  public function addObjectById($object_id) {
    $object = Wearables_Object::find($object_id, array('select' => 'id, name'));
    $this->objects[] = $object;
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
