<?php
function die_with_404($error='Error calling method') {
  header('HTTP/1.0 404 Not Found');
  die($error);
}

function die_unless($condition, $error) {
  if(!$condition) {
    die_with_404($error);
  }
}

set_error_handler('die_with_404', E_ERROR);

$class = $_GET['class'];
die_unless(preg_match('/^[a-z_]+$/', $class), 'Bad data type');

$lib_path = '../lib/'.$class.'.class.php';
die_unless(file_exists($lib_path), 'Non-existant data type');
require $lib_path;

$camel_cased_class = '';
foreach(explode('_', $class) as $class_part) {
  $camel_cased_class .= ucfirst($class_part);
}
$full_class = 'Wearables_'.$camel_cased_class.'APIAccessor';
$api_accessor = new $full_class;

$result = $api_accessor->$_GET['method']($_GET);
header('Content-type: application/json');
echo json_encode($result);
?>
