<?php
require_once dirname(__FILE__).'/spyc.php';

class Wearables_DB {
  static $pdo;
  
  function __construct() {
    $config = self::getEnvironmentConfig();
    if(!self::$pdo) {
      self::$pdo = new PDO(self::getDSN(),
      $config['user'], $config['password']);
      self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
  }
  
  function query($str) {
    return self::$pdo->query($str);
  }
  
  function quote($str) {
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
    $environment = $_ENV['WearablesEnvironment'];
    if(!$environment) $environment = 'development';
    return $environment;
  }
  
  static function getEnvironmentConfig() {
    $config = self::getConfig();
    return $config[self::getEnvironment()];
  }
}
?>
