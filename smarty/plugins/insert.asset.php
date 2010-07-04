<?php
define('ASSETS_DEBUG_MODE', (PWNAGE_ENVIRONMENT == 'development' || isset($_GET['debug'])) && !isset($_GET['force_timestamps']));
function smarty_insert_asset($params, &$smarty) {
  static $timestamps;
  if(!isset($timestamps)) {
    $timestamps_path = PWNAGE_ROOT.'/tmp/asset_timestamps.php';
    $timestamps = file_exists($timestamps_path) ? include($timestamps_path) : array();
  }
  
  $file = $params['file'];
  $src = "/assets/";
  if(isset($timestamps[$file])) {
    $src .= "timestamped/${timestamps[$file]}";
  } else {
    $src .= "$file";
  }
  return $src;
}
