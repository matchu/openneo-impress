#!/usr/bin/php
<?php
define('BASE', dirname(__FILE__).'/../');
define('ASSETS_PATH', BASE.'www/assets/');
define('ASSETS_PATH_LENGTH', strlen(ASSETS_PATH));
define('CACHE_LOCATION', BASE.'tmp/asset_timestamps.php');
$static_dirs = array('css', 'images', 'js');

$timestamps = array();

foreach($static_dirs as $static_dir) {
  $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(ASSETS_PATH.$static_dir));

  foreach($iterator as $file) {
    if($file->isFile()) {
      $path_from_assets = substr($file, ASSETS_PATH_LENGTH);
      $steps_from_assets = explode('/', $path_from_assets);
      foreach($steps_from_assets as $step) {
        if(substr($step, 0, 1) == '.') {
          continue 2;
        }
      }
      $timestamps[$path_from_assets] = $file->getMTime();
    }
  }
}

file_put_contents(CACHE_LOCATION, '<?php return '.var_export($timestamps, true).';');
echo "Wrote asset timestamps\n";
