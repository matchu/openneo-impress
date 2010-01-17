<?php
class Pwnage_PetType extends Pwnage_SwfAssetParent {
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
    if(!$this->getId()) throw new Pwnage_BiologyAssetsNotFoundException();
    $outfit = new Pwnage_Outfit();
    $outfit->pet_type = &$this;
    return $outfit;
  }
  
  public function getAssets() {
    if(!$this->preloaded_assets && !$this->assets) {
      $this->assets = Pwnage_BiologyAsset::all(
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
    return new Pwnage_Color($this->color_id);
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
    return new Pwnage_Species($this->species_id);
  }
  
  protected function isSaved() {
    return $this->getImageHash() ? true : false;
  }
  
  private function load($select='*') {
    $db = PwnageCore_Db::getInstance();
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
      $asset = new Pwnage_BiologyAsset($asset_typed_obj->getAMFData());
      $asset->setOriginPetType($this);
      $this->assets[] = $asset;
    }
  }
  
  public function save() {
    $new_id = parent::save(self::$table, self::$columns);
    if(!$this->id) $this->id = $new_id;
  }
  
  static function all($options) {
    return parent::all($options, Pwnage_PetType::$table,
      'Pwnage_PetType');
  }
}

class Pwnage_BiologyAssetsNotFoundException extends Exception {}

class Pwnage_PetTypeAPIAccessor extends Pwnage_ApiAccessor {
  public function allColorsAndSpecies() {
    return array(
      'color' => Pwnage_Color::all(), 
      'species' => Pwnage_Species::all()
    );
  }
  
  public function getImageHashBySpeciesAndColor($params) {
    $select = array('image_hash');
    $select_str = implode(', ', $select);
    
    $results = Pwnage_PetType::all(array(
      'select' => 'image_hash',
      'where' => 'species_id = '.intval($params['species_id'])
      .' AND color_id = '.intval($params['color_id']),
      'limit' => 1
    ));
    return $results[0]->image_hash;
  }
  
  public function findBySpeciesAndColor($params) {
    $pet_types = Pwnage_PetType::all(array(
      'select' => 'id, body_id',
      'where' => 'species_id = '.intval($params['species_id']).' AND '
        .'color_id = '.intval($params['color_id']),
      'limit' => 1
    ));
    $pet_type = $pet_types[0];
    if($pet_type) {
      $assets_select = array('id', 'url', 'zone_id', 'depth', 'parent_id');
      $assets_select_str = 'swf_assets.id, swf_assets.url, swf_assets.zone_id, z.depth, parents_swf_assets.parent_id';
      $pet_type->assets = $this->resultObjects(Pwnage_BiologyAsset::getAssetsByParents(
        array($pet_type->id), array(
          'select' => $assets_select_str,
          'joins' => 'INNER JOIN zones z ON z.id = swf_assets.zone_id'
        )
      ), $assets_select);
    }
    $objects = $this->resultObjects($pet_types, array('id', 'body_id', 'assets'));
    return $objects[0];
  }
}
?>
