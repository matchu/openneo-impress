<?php
class Pwnage_Color extends Pwnage_PetAttribute {
  protected $type = 'color';
  static $standard_names = array('blue', 'green', 'red', 'yellow');
  static $standard_ids = array(8, 34, 61, 84);
  
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
