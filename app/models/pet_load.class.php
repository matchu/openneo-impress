<?php
class Pwnage_PetLoad extends PwnageCore_DbObject {
  static $table = 'pet_loads';
  static $columns = array('pet_name', 'amf');
  
  public function setOriginPet($pet) {
    $this->pet_name = $pet->getName();
    $this->setAMFData($pet->getViewerData());
  }

  public function getAMFData() {
    return unserialize($this->amf);
  }
  
  public function getName() {
    return $this->pet_name;
  }
  
  protected function setAMFData($data) {
    $this->amf = serialize($data);
  }
  
  public function save() {
    parent::save(self::$table, self::$columns);
  }
  
  static function find($id, $options) {
    return parent::find($id, $options, self::$table, __CLASS__);
  }
}
