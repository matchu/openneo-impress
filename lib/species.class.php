<?php
require_once dirname(__FILE__).'/pet_attribute.class.php';

class Wearables_Species extends Wearables_PetAttribute {
  function getName() {
    $all_species_names = self::all_species_names();
    $returning = $all_species_names[$this->getId()-1];
    return $returning ? $returning : parent::getName();
  }
  
  static function all_species_names() {
    return explode("\n", file_get_contents(dirname(__FILE__).'/species.txt'));
  }
}
?>
