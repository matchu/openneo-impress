<?php
require_once dirname(__FILE__).'/amf.class.php';
require_once dirname(__FILE__).'/db.class.php';
require_once dirname(__FILE__).'/object.class.php';
require_once dirname(__FILE__).'/outfit.class.php';
require_once dirname(__FILE__).'/pet_type.class.php';

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
  
  protected function getObjectAssets() {
    $objects = $this->getObjects();
    $object_assets = array();
    foreach($objects as $object) {
      $object_assets = array_merge($object_assets, $object->getAssets());
    }
    return $object_assets;
  }
  
  public function getObjects() {
    $object_info_registry = $this->getViewerData()->object_info_registry;
    $objects = array();
    foreach($object_info_registry as $object_info) {
      $object = new Wearables_Object($object_info->getAMFData());
      $object->setAssetRegistry($this->getViewerData()->object_asset_registry);
      $object->setOriginPetType($this->getPetType());
      $objects[] = $object;
    }
    return $objects;
  }
  
  protected function getPetType() {
    if(!$this->pet_type) {
      $this->pet_type = new Wearables_PetType($this->getPetData()->species_id,
        $this->getPetData()->color_id);
      $this->pet_type->body_id = $this->getPetData()->body_id;
      $this->pet_type->setBiology($this->getPetData()->biology_by_zone);
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
    } catch(Wearables_AMFConnectionError $e) {
      throw new Wearables_PetNotFoundException();
    }
    $this->viewer_data = $response->getAMFData();
  }
  
  public function saveData() {
    $db = new Wearables_DB();
    
    // Save pet type, biology assets
    $this->getPetType()->deepSave($db);
    
    // Save objects, object assets
    Wearables_Object::deepSaveCollection($this->getObjects(), $db);
  }
}

class Wearables_PetNotFoundException extends Exception {}
?>
