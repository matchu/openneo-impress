<?php
require_once dirname(__FILE__).'/pet_attribute.class.php';

class Wearables_Color extends Wearables_PetAttribute {
  function getName() {
    $all_color_names = self::all_color_names();
    $returning = $all_color_names[$this->getId()-1];
    return $returning ? $returning : parent::getName();
  }
  
  static function all_color_names() {
    return explode("\n", file_get_contents(dirname(__FILE__).'/colors.txt'));
  }
}
?>
