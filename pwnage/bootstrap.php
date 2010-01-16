<?php
// Set PWNAGE_ROOT to the directory above this one
$current_path = explode('/', dirname(__FILE__));
array_pop($current_path);
define(PWNAGE_ROOT, implode('/', $current_path));
unset($current_path);

// Start session, with saving to tmp folders
session_start();

// Set PWNAGE_ENVIRONMENT to whatever is set by Apache
$environment = apache_getenv('WearablesEnv');
if(!$environment) $environment = 'development';
define(PWNAGE_ENVIRONMENT, $environment);
unset($environment);

// Load string helper manually, since autoloading depends on it
require_once PWNAGE_ROOT.'/pwnage/lib/string_helper.class.php';

// Allow the autoloading of Pwnage and PwnageCore classes
function __autoload($class_name) {
  list($prefix, $name) = explode('_', $class_name);
  $filename = PwnageCore_StringHelper::fromCamelCase($name).'.class.php';
  if($prefix == 'PwnageCore') {
    $directory = '/pwnage/lib/';
  } elseif($prefix == 'Pwnage') {
    if(preg_match('/Controller$/', $class_name)) {
      $directory = '/app/controllers/';
    } else {
      $directory = '/app/models/';
    }
  }
  if($directory) require_once PWNAGE_ROOT.$directory.$filename;
}

// Establish, search routes
require PWNAGE_ROOT.'/config/routes.php';
list($path, $query) = explode('?', $_SERVER['REQUEST_URI'], 2);
$route = PwnageCore_RouteManager::getInstance()->find_by_path($path);
if($route) {
  $controller = PwnageCore_Controller::getByName($route->getController())->
    doAction($route->getAction());
} else {
  header('HTTP/1.0 404 Not Found');
  die('404 Not Found');
}
?>
