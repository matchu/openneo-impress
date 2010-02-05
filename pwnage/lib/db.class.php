<?php
require_once PWNAGE_ROOT.'/pwnage/lib/spyc.php';

class PwnageCore_Db {
  protected $query_log = array();
  protected $pdo;
  static $_instance;
  
  protected function __construct() {
    static $registered_function = false;
    if(!$registered_function && PWNAGE_ENVIRONMENT == 'development') {
      register_shutdown_function(array($this, 'outputQueryLog'));
      $registered_function = true;
    }
    $config = $this->getEnvironmentConfig();
    $this->pdo = new PDO($this->getDSN(),
      $config['user'], $config['password']);
    $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }
  
  protected function __clone() {}
  
  public function beginTransaction() {
    $this->pdo->beginTransaction();
  }
  
  public function commit() {
    $this->pdo->commit();
  }
  
  protected function getDSN() {
    $config = $this->getEnvironmentConfig();
    return "${config['type']}:host=${config['host']};"
      ."port=${config['port']};dbname=${config['database']}";
  }
  
  protected function getEnvironmentConfig() {
    $config = self::getConfig();
    return $config[PWNAGE_ENVIRONMENT];
  }
  
  public function exec($str) {
    $this->logQuery($str);
    return $this->pdo->exec($str);
  }
  
  public function lastInsertId() {
    return $this->pdo->lastInsertId();
  }
  
  protected function logQuery($str) {
    if(PWNAGE_ENVIRONMENT == 'development') $this->query_log[] = $str;
  }
  
  public function outputQueryLog() {
    if(isset($_GET) && $_GET['show_query_log']) {
      echo '<h6>Query Log:</h6><ol style="font-size: 80%">';
      foreach($this->query_log as $query) {
        echo "<li>$query</li>";
      }
      echo '</ol>';
    }
  }
  
  public function prepare($str) {
    return $this->pdo->prepare($str);
  }
  
  public function query($str, $params=array()) {
    $this->logQuery($str);
    if($params) {
      $statement = $this->pdo->prepare($str);
      $statement->execute($params);
      return $statement;
    } else {
      return $this->pdo->query($str);
    }
  }
  
  public function quote($str) {
    return $this->pdo->quote($str);
  }
  
  public function rollBack() {
    $this->pdo->rollBack();
  }
  
  static function getConfig() {
    return Spyc::YAMLLoad(PWNAGE_ROOT.'/config/database.yml');
  }
  
  static function getInstance() {
    if(!self::$_instance) {
      self::$_instance = new self;
    }
    return self::$_instance;
  }
}
?>
