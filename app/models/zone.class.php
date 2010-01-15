<?php
class Wearables_Zone extends Pwnage_DbObject {
  static $table = 'zones';
  
  function getId() {
    return $this->id;
  }
  
  static function all($options=array()) {
    return parent::all($options, self::$table, __CLASS__);
  }
}
?>
