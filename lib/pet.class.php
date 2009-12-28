<?php
require_once dirname(__FILE__).'/biology_asset.class.php';
require_once dirname(__FILE__).'/color.class.php';
require_once dirname(__FILE__).'/db.class.php';
require_once dirname(__FILE__).'/pet_type.class.php';
require_once dirname(__FILE__).'/species.class.php';
require_once dirname(__FILE__).'/swf_asset.class.php';

class Wearables_Pet {
  private $viewer_data;
  
  public function getImageHTML() {
    $output = '<ol class="pet-swf-image">';
    $object_asset_registry = $this->getViewerData()->object_asset_registry;
    $object_references = $this->getPetData()->equipped_by_zone;
    $object_assets = array();
    foreach($object_references as $object_reference) {
      $object_reference_data = $object_reference->getAMFData();
      $object_asset_id = $object_reference_data->asset_id;
      $object_assets[] = $object_asset_registry[$object_asset_id];
    }
    $biology_assets = $this->getPetData()->biology_by_zone;
    $assets = array_merge($object_assets, $biology_assets);
    foreach($assets as $asset_typed_obj) {
      $asset_data = $asset_typed_obj->getAMFData();
      $asset = new Wearables_SWFAsset(&$asset_data);
      $output .= $asset->overlayHTML();
    }
    $output .= '</ol>';
    return $output;
  }
  
  private function getBiologyAssets() {
    $asset_data = $this->getPetData()->biology_by_zone;
    $assets = array();
    foreach($asset_data as $asset_typed_obj) {
      $assets[] = new Wearables_BiologyAsset($asset_typed_obj->getAMFData());
    }
    return $assets;
  }
  
  public function getColor() {
    return new Wearables_Color($this->getColorId());
  }
  
  public function getColorId() {
    return $this->getPetData()->color_id;
  }
  
  public function getObjects() {
    $object_info_registry = $this->getViewerData()->object_info_registry;
    return Wearables_AMF::stripAMFCalls($object_info_registry);
  }
  
  public function getPetType() {
    $pet_type = new Wearables_PetType();
    $pet_type->species_id = $this->getSpeciesId();
    $pet_type->color_id = $this->getColorId();
    $pet_type->assets = $this->getBiologyAssets();
    return $pet_type;
  }
  
  public function getSpecies() {
    return new Wearables_Species($this->getSpeciesId());
  }
  
  public function getSpeciesId() {
    return $this->getPetData()->species_id;
  }
  
  public function getViewerData() {
    if(!$this->viewer_data) {
      require_once 'amf.class.php';
      $amf = new Wearables_AMF();
      try {
        $response = $amf->sendRequest('getViewerData',
          array($this->name, null));
      } catch(Wearables_AMFConnectionError $e) {
        throw new Wearables_PetNotFoundException();
      }
      $this->viewer_data = $response->getAMFData();
    }
    return $this->viewer_data;
  }
  
  private function getPetData() {
    $viewer_data = $this->getViewerData();
    return $viewer_data->custom_pet->getAMFData();
  }
  
  public function saveData() {
    $db = new Wearables_DB();
    
    // Save pet type
    $this->getPetType()->save($db);
    
    // Save biology assets
    $biology_assets = $this->getBiologyAssets();
    Wearables_SWFAsset::saveCollection($biology_assets, $db);
  }
}

class Wearables_PetNotFoundException extends Exception {}
?>
