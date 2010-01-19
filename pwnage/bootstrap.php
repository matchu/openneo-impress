<?php
require_once dirname(__FILE__).'/environment.php';

// Turn errors into ErrorExceptions so we can catch them
function exception_error_handler($errno, $errstr, $errfile, $errline ) {
  throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}
set_error_handler('exception_error_handler', E_ERROR);

// Start session, with saving to tmp folders
session_start();

// Load string helper manually, since autoloading depends on it
require_once PWNAGE_ROOT.'/pwnage/lib/string_helper.class.php';

// Allow the autoloading of Pwnage and PwnageCore classes
function __autoload($class_name) {
  list($prefix, $name) = explode('_', $class_name, 2);
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
$split_request = explode('?', $_SERVER['REQUEST_URI'], 2);
$split_path = explode('.', $split_request[0]);
if(count($split_path) > 1) {
  $format = array_pop($split_path);
} else {
  $format = 'html';
}
$base_path = implode('.', $split_path);
if($base_path != '/') $base_path = preg_replace('%/+$%', '', $base_path);
$route = PwnageCore_RouteManager::getInstance()->find_by_path($base_path);

function output404() {
  header('HTTP/1.0 404 Not Found');
  die('404 Not Found');
}

if($route) {
  try {
    $controller = PwnageCore_Controller::getByName($route->getController());
    $controller->setFormat($format);
    $controller->doAction($route->getAction());
  } catch(Pwnage_InvalidFormatException $e) {
    output404();
  }
} else {
  output404();
}
?>
