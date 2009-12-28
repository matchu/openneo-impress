<?php
class Wearables_PetAttribute {
  public function __construct($id) {
    $this->id = $id;
  }
  
  public function getId() {
    return $this->id;
  }
  
  public function getName() {
    return "#$this->id";
  }
}
?>
