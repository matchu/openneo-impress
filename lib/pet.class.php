<?php
require_once dirname(__FILE__).'/amf.class.php';
require_once dirname(__FILE__).'/db.class.php';
require_once dirname(__FILE__).'/object.class.php';
require_once dirname(__FILE__).'/outfit.class.php';
require_once dirname(__FILE__).'/pet_type.class.php';
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_Pet extends Wearables_Outfit {
  private $viewer_data;
  
  public function exists() {
    try {
      $this->loadViewerData();
      return true;
    } catch(Wearables_PetNotFoundException $e) {
      return false;
    }
  }
  
  public function getBiology() {
    return $this->getPetData()->biology_by_zone;
  }
  
  public function getObjects() {
    if(!$this->objects) {
      $object_info_registry = $this->getViewerData()->object_info_registry;
      $this->objects = array();
      foreach($object_info_registry as $object_info) {
        $object = new Wearables_Object($object_info->getAMFData());
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
    if(!$this->pet_type) {
      $this->pet_type = new Wearables_PetType($this->getPetData()->species_id,
        $this->getPetData()->color_id);
      $this->pet_type->body_id = $this->getPetData()->body_id;
      $this->pet_type->setOriginPet($this);
    }
    return $this->pet_type;
  }
  
  private function getViewerData() {
    if(!$this->viewer_data) {
      $this->loadViewerData();
    }
    return $this->viewer_data;
  }
  
  private function getPetData() {
    $viewer_data = $this->getViewerData();
    return $viewer_data->custom_pet->getAMFData();
  }
  
  private function loadViewerData() {
    $amf = new Wearables_AMF();
    try {
      $response = $amf->sendRequest('getViewerData',
        array($this->name, null));
    } catch(Wearables_AMFResponseError $e) {
      throw new Wearables_PetNotFoundException();
    }
    $this->viewer_data = $response->getAMFData();
  }
  
  public function saveData() {
    // Save pet type
    $this->getPetType()->save();
    
    // Save objects
    Wearables_Object::saveCollection($this->getObjects());
    
    // Save assets
    Wearables_SWFAsset::saveCollection($this->getAssets());
  }
}

class Wearables_PetNotFoundException extends Exception {}
?>
