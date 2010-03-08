<?php
class Pwnage_Color extends Pwnage_PetAttribute {
  const GENDER_REGEX = '/(boy|girl)$/';
  protected $type = 'color';
  static $all;
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
  
  static function all($options=array()) {
    if(!isset(self::$all)) {
      self::$all = array();
      $all_names = self::allNamesByType('color');
      foreach($all_names as $i => $name) {
        $id = $i + 1;
        $color = new Pwnage_Color($id);
        $color->name = $name;
        self::$all[] = $color;
      }
    }
    if(isset($options['ids'])) {
      $desired_colors = array();
      foreach(self::$all as $color) {
        if(in_array($color->getId(), $options['ids'])) {
          $desired_colors[] = $color;
        }
      }
      return $desired_colors;
    } else {
      return self::$all;
    }
  }
  
  static function getStandardIds() {
    return self::$standard_ids;
  }
  
  static function getStandardNames() {
    return self::$standard_names;
  }
}
?>
