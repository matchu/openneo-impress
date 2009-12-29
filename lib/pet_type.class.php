<?php
require_once dirname(__FILE__).'/biology_asset.class.php';
require_once dirname(__FILE__).'/color.class.php';
require_once dirname(__FILE__).'/db.class.php';
require_once dirname(__FILE__).'/db_object.class.php';
require_once dirname(__FILE__).'/outfit.class.php';
require_once dirname(__FILE__).'/species.class.php';

class Wearables_PetType extends Wearables_DBObject {
  static $table = 'pet_types';
  static $columns = array('species_id', 'color_id', 'body_id');
  
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
  
  public function getBodyId() {
    if(!$this->body_id) {
      $this->load('body_id', new Wearables_DB());
    }
    return $this->body_id;
  }
  
  public function getColor() {
    return new Wearables_Color($this->color_id);
  }
  
  public function getId() {
    if(!$this->id) {
      $this->load('id', new Wearables_DB());
    }
    return $this->id;
  }
  
  public function getSpecies() {
    return new Wearables_Species($this->species_id);
  }
  
  protected function isSaved($db) {
    if($this->id) return true;
    return $this->load('id', $db);
  }
  
  private function load($select='*', $db) {
    $query = $db->query("SELECT $select FROM pet_types WHERE "
      .'species_id = '.intval($this->species_id).' AND '
      .'color_id = '.intval($this->color_id).' LIMIT 1');
    $row = $query->fetch(PDO::FETCH_ASSOC);
    if($row) {
      foreach($row as $key => $value) {
        $this->$key = $value;
      }
      return true;
    } else {
      return false;
    }
  }
  
  public function setBiology($biology) {
    $this->assets = array();
    foreach($biology as $asset_typed_obj) {
      $asset = new Wearables_BiologyAsset($asset_typed_obj->getAMFData());
      $asset->setOriginPetType($this);
      $this->assets[] = $asset;
    }
  }
  
  public function deepSave($db) {
    $new_id = $this->save($db, self::$table, self::$columns);
    if(!$this->id) $this->id = $new_id;
    Wearables_BiologyAsset::saveCollection($this->assets, $db);
  }
}

class Wearables_BiologyAssetsNotFoundException extends Exception {}
?>
