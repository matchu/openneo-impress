<?php
require_once dirname(__FILE__).'/pet_attribute.class.php';

class Wearables_Species extends Wearables_PetAttribute {
  public function getName() {
    $species_list = Wearables_AMF::getApplicationData()->species;
    foreach($species_list as $species_obj) {
      $species_data = $species_obj->getAMFData();
      if($species_data->id == $this->getId()) {
        return ucfirst(strtolower($species_data->type));
      }
    }
    // if all list items failed
    return parent::getName();
  }
}
?>
