<?php
class Pwnage_Pet extends Pwnage_Outfit {
  private $viewer_data;
  static $table = 'pets';
  static $columns = array('name', 'pet_type_id');
  
  protected function beforeSave() {
    $this->pet_type_id = $this->getPetType()->getId();
  }
  
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
  
  public function getPetData() {
    $viewer_data = $this->getViewerData();
    return $viewer_data->custom_pet->getAMFData();
  }
  
  protected function getPetState() {
    if(!isset($this->pet_state)) {
      $this->pet_state = new Pwnage_PetState();
      $this->pet_state->setOriginPet($this);
    }
    return $this->pet_state;
  }
  
  protected function getPetType() {
    if(!isset($this->pet_type)) {
      $this->pet_type = $this->getPetState()->getPetType();
    }
    return $this->pet_type;
  }
  
  private function getViewerData() {
    if(!isset($this->viewer_data)) {
      $this->loadViewerData();
    }
    return $this->viewer_data;
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
    if($pet_state = $this->getPetState()) {
      $pet_state->save();
    }
    
    // Save objects
    if($objects = $this->getObjects()) {
      Pwnage_Object::saveCollection($objects);
    }
    
    // Save assets
    if($assets = $this->getAssets()) {
      Pwnage_SwfAsset::saveCollection($assets);
    }
  }
  
  public function save() {
    $this->saveData();
    parent::save(self::$table, self::$columns);
  }
  
  static function saveCollection($pets) {
    parent::saveCollection($pets, self::$table, self::$columns);
  }
}

class Pwnage_PetNotFoundException extends Exception {}
?>
