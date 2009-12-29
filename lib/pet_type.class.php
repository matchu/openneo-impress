<?php
require_once dirname(__FILE__).'/biology_asset.class.php';
require_once dirname(__FILE__).'/color.class.php';
require_once dirname(__FILE__).'/db.class.php';
require_once dirname(__FILE__).'/outfit.class.php';
require_once dirname(__FILE__).'/species.class.php';

class Wearables_PetType {
  public function __construct($species_id, $color_id) {
    $this->species_id = $species_id;
    $this->color_id = $color_id;
  }
  
  public function createOutfit() {
    if(!$this->getAssets()) throw new Wearables_BiologyAssetsNotFoundException();
    $outfit = new Wearables_Outfit();
    $outfit->pet_type = &$this;
    return $outfit;
  }
  
  public function getAssets() {
    if(!$this->assets) {
      $db = new Wearables_DB();
      $query = $db->query('SELECT * FROM swf_assets WHERE type = "biology" AND '
        .'parent_id = '.intval($this->getId())
      );
      $this->assets = array();
      while($obj = $query->fetchObject('Wearables_BiologyAsset')) {
        $this->assets[] = $obj;
      }
    }
    return $this->assets;
  }
  
  public function getColor() {
    return new Wearables_Color($this->color_id);
  }
  
  private function getId() {
    if(!$this->id) $this->loadId(new Wearables_DB());
    return $this->id;
  }
  
  public function getSpecies() {
    return new Wearables_Species($this->species_id);
  }
  
  private function isSaved($db) {
    if($this->id) return true;
    return $this->loadId($db);
  }
  
  private function loadId($db) {
    $query = $db->query('SELECT id FROM pet_types WHERE '
      .'species_id = '.intval($this->species_id).' AND '
      .'color_id = '.intval($this->color_id).' LIMIT 1');
    $id = (int) $query->fetchColumn();
    if($id) {
      $this->id = $id;
      return true;
    } else {
      return false;
    }
  }
  
  public function setBiology($biology) {
    $this->assets = array();
    foreach($biology as $asset_typed_obj) {
      $asset = new Wearables_BiologyAsset($asset_typed_obj->getAMFData());
      $asset->setParent($this);
      $this->assets[] = $asset;
    }
  }
  
  public function deepSave($db) {
    if(!$this->isSaved($db)) {
      $db->exec('INSERT INTO pet_types (color_id, species_id) '
        .'VALUES ('
        .intval($this->color_id).', '
        .intval($this->species_id)
        .')'
      );
      $this->id = $db->lastInsertId();
    }
    Wearables_BiologyAsset::saveCollection($this->assets, $db);
  }
}

class Wearables_BiologyAssetsNotFoundException extends Exception {}
?>
