<?php
require_once dirname(__FILE__).'/spyc.php';

class Wearables_DB {
  static $query_log = array();
  static $pdo;
  
  function __construct() {
    $config = self::getEnvironmentConfig();
    if(!self::$pdo) {
      self::$pdo = new PDO(self::getDSN(),
      $config['user'], $config['password']);
      self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
  }
  
  public function exec($str) {
    $this->logQuery($str);
    return self::$pdo->exec($str);
  }
  
  public function lastInsertId() {
    return self::$pdo->lastInsertId();
  }
  
  private function logQuery($str) {
    if($this->getEnvironment() == 'development') self::$query_log[] = $str;
  }
  
  public function query($str) {
    $this->logQuery($str);
    return self::$pdo->query($str);
  }
  
  public function quote($str) {
    return self::$pdo->quote($str);
  }
  
  static function getConfig() {
    return Spyc::YAMLLoad(dirname(__FILE__).'/../config/database.yml');
  }
  
  static function getDSN() {
    $config = self::getEnvironmentConfig();
    return "${config['type']}:host=${config['host']};"
      ."port=${config['port']};dbname=${config['database']}";
  }
  
  static function getEnvironment() {
    static $registered_function = false;
    $environment = isset($_ENV['WearablesEnvironment']) ?
      $_ENV['WearablesEnvironment'] : 'development';
    if(!$registered_function && $environment == 'development') {
      register_shutdown_function(array('Wearables_DB', 'outputQueryLog'));
      $registered_function = true;
    }
    return $environment;
  }
  
  static function getEnvironmentConfig() {
    $config = self::getConfig();
    return $config[self::getEnvironment()];
  }
  
  static function outputQueryLog() {
    echo '<h6>Query Log:</h6><ol style="font-size: 80%">';
    foreach(self::$query_log as $query) {
      echo "<li>$query</li>";
    }
    echo '</ol>';
  }
}
?>
