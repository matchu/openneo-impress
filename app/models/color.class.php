<?php
class Pwnage_Color extends Pwnage_PetAttribute {
  const GENDER_REGEX = '/(boy|girl)$/';
  protected $type = 'color';
  static $standard_names = array('blue', 'green', 'red', 'yellow');
  static $standard_ids = array(8, 34, 61, 84);
  
  public function getDisplayName() {
    return preg_replace(self::GENDER_REGEX, '', $this->getName());
  }
  
  public function getGender() {
    if(preg_match(self::GENDER_REGEX, $this->getName(), $matches)) {
      return $matches[1] == 'boy' ? 'Male' : 'Female';
    } else {
      return false;
    }
  }
  
  static function all() {
    $all = array();
    $all_names = self::allNamesByType('color');
    foreach($all_names as $i => $name) {
      $color = new Pwnage_Color($i + 1);
      $color->name = $name;
      $all[] = $color;
    }
    return $all;
  }
  
  static function getStandardIds() {
    return self::$standard_ids;
  }
  
  static function getStandardNames() {
    return self::$standard_names;
  }
}
?>
