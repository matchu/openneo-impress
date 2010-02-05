<?php
// Set PWNAGE_ROOT to the directory above this one
$current_path = explode('/', dirname(__FILE__));
array_pop($current_path);
define('PWNAGE_ROOT', implode('/', $current_path));
unset($current_path);

// Load string helper manually, since autoloading depends on it
require_once PWNAGE_ROOT.'/pwnage/lib/string_helper.class.php';

// Allow the autoloading of Pwnage and PwnageCore classes
function __autoload($class_name) {
  list($prefix, $name) = explode('_', $class_name, 2);
  if($prefix == 'PwnageCore') {
    $directory = '/pwnage/lib/';
  } elseif($prefix == 'Pwnage') {
    if(preg_match('/Controller$/', $class_name)) {
      $directory = '/app/controllers/';
    } else {
      $directory = '/app/models/';
    }
  } else {
    $directory = '/lib/';
    $name = $class_name;
  }
  $full_path = PWNAGE_ROOT.$directory.
    PwnageCore_StringHelper::fromCamelCase($name).'.class.php';
  if(file_exists($full_path)) {
    require_once $full_path;
  }
}

// Set PWNAGE_ENVIRONMENT to whatever is set by Apache
if(function_exists('apache_getenv')) {
  $environment = apache_getenv('PwnageEnv');
} elseif(isset($argv)) {
  foreach($argv as $arg) {
    if(preg_match('/PWNAGE_ENV=(.+)/', $arg, $matches)) {
      $environment = $matches[1];
    }
  }
}
if(!$environment) $environment = 'development';
define('PWNAGE_ENVIRONMENT', $environment);
unset($environment);
?>
