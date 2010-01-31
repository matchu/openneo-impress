<?php
class Pwnage_AuthServer extends PwnageCore_DbObject {
  static $table = 'auth_servers';
  static $columns = array('id', 'short_name', 'name', 'icon', 'gateway',
    'secret');
  
  static function find($id, $options=array()) {
    return parent::find($id, $options, self::$table, __CLASS__);
  }
  
  static function first($options=array()) {
    return parent::first($options, self::$table, __CLASS__);
  }
}
?>
