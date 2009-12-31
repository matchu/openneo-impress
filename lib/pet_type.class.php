<?php
require_once dirname(__FILE__).'/biology_asset.class.php';
require_once dirname(__FILE__).'/color.class.php';
require_once dirname(__FILE__).'/db.class.php';
require_once dirname(__FILE__).'/db_object.class.php';
require_once dirname(__FILE__).'/outfit.class.php';
require_once dirname(__FILE__).'/species.class.php';

class Wearables_PetType extends Wearables_SWFAssetParent {
  const IMAGE_CPN_FORMAT = 'http://pets.neopets.com/cpn/%s/1/1.png';
  const IMAGE_CP_HEADER_REGEX = '%^Location: /cp/(.+?)/1/1\.png$%';
  protected $asset_type = 'biology';
  static $table = 'pet_types';
  static $columns = array('species_id', 'color_id', 'body_id', 'image_hash');
  
  public function __construct($species_id=null, $color_id=null) {
    if($species_id) $this->species_id = $species_id;
    if($color_id) $this->color_id = $color_id;
  }
  
  public function beforeSave() {
    // get image_hash value
    $cpn_url = sprintf(self::IMAGE_CPN_FORMAT, $this->origin_pet->getName());
    $ch = curl_init($cpn_url);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_NOBODY, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    if($response) {
      list($headers, $body) = explode("\r\n\r\n", $response, 2);
      $header_array = explode("\r\n", $headers);
      foreach($header_array as $header) {
        if(preg_match(self::IMAGE_CP_HEADER_REGEX, $header, $matches)) {
          $this->image_hash = $matches[1];
        }
      }
    }
  }
  
  public function createOutfit() {
    if(!$this->getId()) throw new Wearables_BiologyAssetsNotFoundException();
    $outfit = new Wearables_Outfit();
    $outfit->pet_type = &$this;
    return $outfit;
  }
  
  public function getAssets() {
    if(!$this->preloaded_assets && !$this->assets) {
      $this->assets = Wearables_BiologyAsset::all(
        array(
          'where' => 'parent_id = '.intval($this->getId())
        )
      );
    }
    return $this->assets;
  }
  
  public function getBodyId() {
    if(!$this->body_id) {
      $this->load('body_id');
    }
    return $this->body_id;
  }
  
  public function getColor() {
    return new Wearables_Color($this->color_id);
  }
  
  public function getId() {
    if(!$this->id) {
      $this->load('id');
    }
    return $this->id;
  }
  
  public function getImageHash() {
    if(!$this->image_hash) $this->load('image_hash');
    return $this->image_hash;
  }
  
  public function getSpecies() {
    return new Wearables_Species($this->species_id);
  }
  
  protected function isSaved() {
    return $this->getImageHash() ? true : false;
  }
  
  private function load($select='*') {
    $db = new Wearables_DB();
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
  
  public function needsToLoadAssets() {
    return !$this->preloaded_assets && empty($this->assets);
  }
  
  public function setOriginPet($pet) {
    $this->origin_pet = $pet;
    $this->assets = array();
    foreach($pet->getBiology() as $asset_typed_obj) {
      $asset = new Wearables_BiologyAsset($asset_typed_obj->getAMFData());
      $asset->setOriginPetType($this);
      $this->assets[] = $asset;
    }
  }
  
  public function save() {
    $new_id = parent::save(self::$table, self::$columns);
    if(!$this->id) $this->id = $new_id;
  }
}

class Wearables_BiologyAssetsNotFoundException extends Exception {}

class Wearables_PetTypeAPIAccessor {
  public function findBySpeciesAndColor($params) {
    if(!is_array($params['select'])) return null;
    $select = array();
    foreach($params['select'] as $column) {
      if(in_array($column, Wearables_PetType::$columns)) {
        $select[] = $column;
      }
    }
    $select_str = implode(', ', $select);
    $results = Wearables_PetType::all(array(
      'select' => $select_str,
      'where' => 'species_id = '.intval($params['species_id'])
        .' AND color_id = '.intval($params['color_id'])
    ), Wearables_PetType::$table, 'Wearables_PetType');
    $result = $results[0];
    if($result) {
      $general_result = new stdClass();
      foreach($select as $column) {
        $general_result->$column = $result->$column;
      }
      return $general_result;
    } else {
      return null;
    }
  }
}
?>
