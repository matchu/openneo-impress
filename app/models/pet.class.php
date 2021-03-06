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
    $biology = $this->getPetData()->biology_by_zone;
    if(isset($biology[''])) {
      // Do not consider Corridor of Chance effects to be a part of the biology,
      // but do store them in log files for reference.
      $effect_asset = $biology[''];
      unset($biology['']);
      $amf = $effect_asset->getAMFData();
      $body_id = $this->getPetType()->getBodyId();
      $effect_log_part_id_dir = PWNAGE_ROOT . '/log/effects/' . $amf->part_id;
      if(!is_dir($effect_log_part_id_dir)) {
        mkdir($effect_log_part_id_dir);
      }
      $effect_log_path = $effect_log_part_id_dir . '/' . $body_id . '.txt';
      if(!file_exists($effect_log_path)) {
        file_put_contents($effect_log_path, json_encode($amf));
      }
    }
    return $biology;
  }
  
  public function getContributions() {
    return array_merge(
      $this->getPetState()->getContributions(),
      Pwnage_Contribution::getContributionsFromCollection($this->getObjects(), 'Pwnage_Object'),
      Pwnage_Contribution::getContributionsFromCollection($this->getObjectAssets(), 'Pwnage_ObjectAsset')
    );
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
  
  public function getPetState() {
    if(!isset($this->pet_state)) {
      $this->pet_state = new Pwnage_PetState();
      $this->pet_state->setOriginPet($this);
    }
    return $this->pet_state;
  }
  
  public function getPetType() {
    if(!isset($this->pet_type)) {
      $this->pet_type = $this->getPetState()->getPetType();
    }
    return $this->pet_type;
  }
  
  public function getViewerData() {
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
    
    // Save pet load log
    $pet_load = new Pwnage_PetLoad();
    $pet_load->setOriginPet($this);
    $pet_load->save();
  }
  
  public function save() {
    $this->saveData();
    parent::save(self::$table, self::$columns);
  }
  
  public function setName($name) {
    $this->name = $name;
  }
  
  public function unsetPetState() {
    unset($this->pet_state);
  }
  
  public function update() {
    return parent::update(self::$table, self::$columns);
  }
  
  static function first($options) {
    return parent::first($options, self::$table, __CLASS__);
  }
  
  static function saveCollection($pets) {
    parent::saveCollection($pets, self::$table, self::$columns);
  }
}

class Pwnage_PetNotFoundException extends Exception {}
?>
