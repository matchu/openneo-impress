<?php
class Pwnage_AuthServer extends PwnageCore_DbObject {
  static $table = 'auth_servers';
  static $columns = array('id', 'short_name', 'name', 'icon', 'gateway',
    'secret');
    
  public function getLoginUrl() {
    $app = 'impress';
    if(PWNAGE_ENVIRONMENT == 'development') {
      $app = 'beta'.$app;
    }
    $path = $_SERVER['REQUEST_URI'];
    if(!$path) $path = '/';
    return $this->gateway.'?'.http_build_query(array(
      'app' => $app,
      'path' => $path,
      'session_id' => session_id()
    ));
  }
    
  public function getName() {
    return $this->name;
  }
  
  public function getIcon() {
    return $this->icon;
  }
  
  static function all($options=array()) {
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function find($id, $options=array()) {
    return parent::find($id, $options, self::$table, __CLASS__);
  }
  
  static function first($options=array()) {
    return parent::first($options, self::$table, __CLASS__);
  }
}
?>
