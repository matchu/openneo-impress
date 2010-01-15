<?php
class Wearables_Color extends Wearables_PetAttribute {
  protected $type = 'color';
  
  static function all() {
    $all = array();
    $all_names = self::allNamesByType('color');
    foreach($all_names as $i => $name) {
      $color = new Wearables_Color($i + 1);
      $color->name = $name;
      $all[] = $color;
    }
    return $all;
  }
}
?>
