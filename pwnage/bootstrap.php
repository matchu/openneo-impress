<?php
require_once dirname(__FILE__).'/environment.php';

// Turn errors into ErrorExceptions so we can catch them
function exception_error_handler($errno, $errstr, $errfile, $errline ) {
  throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}
set_error_handler('exception_error_handler', E_ERROR);

// Start session, with saving to tmp folders
session_start();

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
$route = PwnageCore_RouteManager::getInstance()->findByPath($base_path);

function output404() {
  header('HTTP/1.0 404 Not Found');
  die('404 Not Found');
}

if($route) {
  try {
    $controller = PwnageCore_Controller::getByName($route->getController());
    $controller->setFormat($format);
    $controller->setPathData($route->getParams());
    $controller->doAction($route->getAction());
  } catch(Pwnage_InvalidFormatException $e) {
    output404();
  }
} else {
  output404();
}
?>
