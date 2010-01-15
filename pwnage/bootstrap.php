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
  list($prefix, $name) = explode('_', $class_name);
  $name = Pwnage_StringHelper::fromCamelCase($name);
  if($prefix == 'Pwnage') {
    require_once PWNAGE_ROOT."/pwnage/lib/$name.class.php";
  } elseif($prefix == 'Wearables') {
    require_once PWNAGE_ROOT."/app/models/$name.class.php";
  }
}
?>
