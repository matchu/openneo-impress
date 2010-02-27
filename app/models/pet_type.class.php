<?php
class Pwnage_PetType extends PwnageCore_DbObject {
  const IMAGE_CPN_FORMAT = 'http://pets.neopets.com/cpn/%s/1/1.png';
  const IMAGE_CP_HEADER_REGEX = '%^Location: /cp/(.+?)/1/1\.png$%';
  protected $asset_type = 'biology';
  static $table = 'pet_types';
  static $columns = array('species_id', 'color_id', 'body_id', 'image_hash');
  
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
  
  public function getBodyId() {
    if(!$this->body_id) {
      $this->load('body_id');
    }
    return $this->body_id;
  }
  
  public function getColor() {
    return new Pwnage_Color($this->color_id);
  }
  
  public function getColorId() {
    return $this->color_id;
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
  
  public function getNeededObjects($options) {
    /*
      In this case, two queries seems suboptimal, but MySQL 5.1's query
      optimizer interprets the subquery as dependent (even though it's not).
      This forces us, in the interest of actually reasonable performance, to
      handle that logic procedurally. Booooo.
    */
    $objects_not_needed = Pwnage_Object::all(array(
      'select' => 'objects.id',
      'joins' => 'INNER JOIN parents_swf_assets psa '.
        'ON objects.id = psa.parent_id AND psa.swf_asset_type = "object" '.
        'INNER JOIN swf_assets sa ON psa.swf_asset_id = sa.id ',
      'where' => array('sa.body_id IN (0, ?)', $this->getBodyId())
    ));
    foreach($objects_not_needed as &$object) {
      $object = (int) $object->getId();
    }
    $s = $this->getSpeciesId();
    // Note that PDO can not bind an array for IN(), but since it's a
    // comma-delimited list of strings, should be safe for the query itself.
    return Pwnage_Object::all(array_merge($options, array(
      'where' => array(
        'objects.id NOT IN ('.implode(',', $objects_not_needed).') AND '.
        '('.
          'objects.species_support_ids LIKE ? '.
          'OR objects.species_support_ids LIKE ? '.
          'OR objects.species_support_ids LIKE ?'.
        ')',
        "$s,%",
        "%,$s",
        "%,$s,%"
      )
    )));
  }
  
  public function getSpecies() {
    return new Pwnage_Species($this->species_id);
  }
  
  public function getSpeciesId() {
    return $this->species_id;
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
  
  public function setOriginPet($pet) {
    $this->origin_pet = $pet;
    $this->color_id = $pet->getPetData()->color_id;
    $this->species_id = $pet->getPetData()->species_id;
    $this->body_id = $pet->getPetData()->body_id;
  }
  
  public function save() {
    $new_id = parent::save(self::$table, self::$columns);
    if(!$this->id) $this->id = $new_id;
  }
  
  static function all($options) {
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function allByIdsOrChildren($ids, &$children, $options) {
    $children_by_parent_id = array();
    foreach($children as &$child) {
      $parent_id = $child->getPetTypeId();
      if(!in_array($id, $ids)) $ids[] = $parent_id;
      $children_by_parent_id[$parent_id] =& $child;
    }
    $parents = self::find($ids, $options);
    foreach($parents as $parent) {
      $parent_id = $parent->getId();
      if(isset($children_by_parent_id[$parent_id])) {
        $children_by_parent_id[$parent_id]->setPetType($parent);
      }
    }
    return $parents;
  }
  
  static function find($id, $options) {
    return parent::find($id, $options, self::$table, __CLASS__);
  }
  
  static function first($options) {
    return parent::first($options, self::$table, __CLASS__);
  }
  
  static function findBySpeciesIdAndColorId($species_id, $color_id, $options) {
    return Pwnage_PetType::first(array(
      'select' => $options['select'],
      'where' => array('species_id = ? AND color_id = ?', $species_id, $color_id)
    ));
  }
}
?>
