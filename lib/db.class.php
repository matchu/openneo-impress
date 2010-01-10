<?php
require_once dirname(__FILE__).'/spyc.php';

class Wearables_DB {
  protected $query_log = array();
  protected $pdo;
  static $_instance;
  
  protected function __construct() {
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
  
  protected function getEnvironment() {
    static $registered_function = false;
    $environment = apache_getenv('WearablesEnv');
    if(!$environment) $environment = 'development';
    if(!$registered_function && $environment == 'development') {
      register_shutdown_function(array($this, 'outputQueryLog'));
      $registered_function = true;
    }
    return $environment;    
  }
  
  protected function getEnvironmentConfig() {
    $config = self::getConfig();
    return $config[$this->getEnvironment()];
  }
  
  public function exec($str) {
    $this->logQuery($str);
    return $this->pdo->exec($str);
  }
  
  public function lastInsertId() {
    return $this->pdo->lastInsertId();
  }
  
  protected function logQuery($str) {
    if($this->getEnvironment() == 'development') $this->query_log[] = $str;
  }
  
  public function outputQueryLog() {
    if($_GET['show_query_log']) {
      echo '<h6>Query Log:</h6><ol style="font-size: 80%">';
      foreach($this->query_log as $query) {
        echo "<li>$query</li>";
      }
      echo '</ol>';
    }
  }
  
  public function query($str) {
    $this->logQuery($str);
    return $this->pdo->query($str);
  }
  
  public function quote($str) {
    return $this->pdo->quote($str);
  }
  
  public function rollBack() {
    $this->pdo->rollBack();
  }
  
  static function getConfig() {
    return Spyc::YAMLLoad(dirname(__FILE__).'/../config/database.yml');
  }
  
  static function getInstance() {
    if(!self::$_instance) {
      self::$_instance = new Wearables_DB();
    }
    return self::$_instance;
  }
}
?>
