<?php
require_once '../pwnage/bootstrap.php';

function handle_error($errno, $errstr, $errfile, $errline) {
  throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}

function throw_500() {
  header('HTTP/1.0 500 Internal Server Error');
}

function die_with_404($error='Error calling method') {
  header('HTTP/1.0 404 Not Found');
  die($error);
}

function die_unless($condition, $error) {
  if(!$condition) {
    die_with_404($error);
  }
}

set_error_handler('handle_error', error_reporting());

$class = $_GET['class'];
die_unless(preg_match('/^[a-z_]+$/', $class), 'Bad data type');

$lib_path = '../app/models/'.$class.'.class.php';
die_unless(file_exists($lib_path), 'Non-existant data type');
require $lib_path;

$camel_cased_class = '';
foreach(explode('_', $class) as $class_part) {
  $camel_cased_class .= ucfirst($class_part);
}
$full_class = 'Pwnage_'.$camel_cased_class.'APIAccessor';
$api_accessor = new $full_class;

die_unless(method_exists($api_accessor, $_GET['method']), 'Method does not exist');
try {
  $result = $api_accessor->$_GET['method']($_GET);
} catch(Exception $e) {
  throw_500();
  throw $e;
}
header('Content-type: application/json');
echo json_encode($result);
?>
