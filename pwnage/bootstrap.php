<?php
// Set PWNAGE_ROOT to the directory above this one
$current_path = explode('/', dirname(__FILE__));
array_pop($current_path);
define(PWNAGE_ROOT, implode('/', $current_path));
unset($current_path);

// Load string helper manually, since autoloading depends on it
require_once PWNAGE_ROOT.'/pwnage/lib/string_helper.class.php';

// Allow the autoloading of Wearables_ and Pwnage_ classes
function __autoload($class_name) {
  static $models;
  if(!$models) {
    $models = array_map('basename', glob(PWNAGE_ROOT.'/app/models/*.class.php'));
  }
  
  list($prefix, $name) = explode('_', $class_name);
  $filename = Pwnage_StringHelper::fromCamelCase($name).'.class.php';
  $directory = in_array($filename, $models) ? '/app/models/' : '/pwnage/lib/';
  require_once PWNAGE_ROOT.$directory.$filename;
}
?>
