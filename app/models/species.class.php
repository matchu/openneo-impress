<?php
class Pwnage_Species extends Pwnage_PetAttribute {
  protected $type = 'species';
  
  static function all() {
    $all = array();
    $all_names = self::allNamesByType('species');
    foreach($all_names as $i => $name) {
      $color = new Pwnage_Color($i + 1);
      $color->name = $name;
      $all[] = $color;
    }
    return $all;
  }
}
?>
