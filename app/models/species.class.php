<?php
class Wearables_Species extends Wearables_PetAttribute {
  protected $type = 'species';
  
  static function all() {
    $all = array();
    $all_names = self::allNamesByType('species');
    foreach($all_names as $i => $name) {
      $color = new Wearables_Color($i + 1);
      $color->name = $name;
      $all[] = $color;
    }
    return $all;
  }
}
?>
