<?php
// Set PWNAGE_ROOT to the directory above this one
$current_path = explode('/', dirname(__FILE__));
array_pop($current_path);
define('PWNAGE_ROOT', implode('/', $current_path));
unset($current_path);

// Set PWNAGE_ENVIRONMENT to whatever is set by Apache
if(function_exists('apache_getenv')) {
  $environment = apache_getenv('WearablesEnv');
}
if(!$environment) $environment = 'development';
define('PWNAGE_ENVIRONMENT', $environment);
unset($environment);
?>
