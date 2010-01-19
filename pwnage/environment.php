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

// Set PWNAGE_ENVIRONMENT to whatever is set by Apache
if(function_exists('apache_getenv')) {
  $environment = apache_getenv('WearablesEnv');
}
if(!$environment) $environment = 'development';
define('PWNAGE_ENVIRONMENT', $environment);
unset($environment);
?>
