<?php
require_once dirname(__FILE__).'/db_object.class.php';

class Wearables_Zone extends Wearables_DBObject {
  static $table = 'zones';
  
  function getId() {
    return $this->id;
  }
  
  static function all($options=array()) {
    return parent::all($options, self::$table, __CLASS__);
  }
}
?>
