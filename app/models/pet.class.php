<?php
class Pwnage_Pet extends Pwnage_Outfit {
  private $viewer_data;
  
  public function exists() {
    try {
      $this->loadViewerData();
      return true;
    } catch(Pwnage_PetNotFoundException $e) {
      return false;
    }
  }
  
  public function getBiology() {
    return $this->getPetData()->biology_by_zone;
  }
  
  public function getObjects() {
    if(!isset($this->objects)) {
      $object_info_registry = $this->getViewerData()->object_info_registry;
      $this->objects = array();
      foreach($object_info_registry as $object_info) {
        $object = new Pwnage_Object($object_info->getAMFData());
        $object->setAssetRegistry($this->getViewerData()->object_asset_registry);
        $object->setOriginPetType($this->getPetType());
        $this->objects[] = $object;
      }
    }
    return $this->objects;
  }
  
  public function getName() {
    return $this->name;
  }
  
  protected function getPetType() {
    if(!isset($this->pet_type)) {
      $this->pet_type = new Pwnage_PetType($this->getPetData()->species_id,
        $this->getPetData()->color_id);
      $this->pet_type->body_id = $this->getPetData()->body_id;
      $this->pet_type->setOriginPet($this);
    }
    return $this->pet_type;
  }
  
  private function getViewerData() {
    if(!isset($this->viewer_data)) {
      $this->loadViewerData();
    }
    return $this->viewer_data;
  }
  
  private function getPetData() {
    $viewer_data = $this->getViewerData();
    return $viewer_data->custom_pet->getAMFData();
  }
  
  private function loadViewerData() {
    $amf = new Pwnage_Amf();
    try {
      $response = $amf->sendRequest('getViewerData',
        array($this->name, null));
    } catch(Pwnage_AmfResponseError $e) {
      throw new Pwnage_PetNotFoundException();
    }
    $this->viewer_data = $response->getAMFData();
  }
  
  public function saveData() {
    // Save pet type
    $this->getPetType()->save();
    
    // Save objects
    Pwnage_Object::saveCollection($this->getObjects());
    
    // Save assets
    Pwnage_SwfAsset::saveCollection($this->getAssets());
  }
}

class Pwnage_PetNotFoundException extends Exception {}
?>
