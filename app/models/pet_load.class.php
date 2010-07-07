<?php
class Pwnage_PetLoad extends PwnageCore_DbObject {
  static $table = 'pet_loads';
  static $columns = array('pet_name', 'amf');
  
  public function setOriginPet($pet) {
    $this->pet_name = $pet->getName();
    $this->setAMF($pet->getViewerData());
  }
  
  protected function setAMF($data) {
    $this->amf = serialize($data);
  }
  
  public function save() {
    parent::save(self::$table, self::$columns);
  }
}
