<?php
function smarty_insert_js($params, &$smarty) {
  static $timestamps;
  if(!isset($timestamps)) {
    $timestamps_path = PWNAGE_ROOT.'/tmp/asset_timestamps.php';
    $timestamps = file_exists($timestamps_path) ? include($timestamps_path) : array();
  }
  $base_file = $params['src'];
  $file = "js/$base_file.js";
  $src = '/assets/';
  if(isset($_GET['debug'])) {
    $src .= 'js/debug.php?file='.$base_file;
  } elseif(isset($timestamps[$file])) {
    $src .= "timestamped/${timestamps[$file]}";
  } else {
    $src .= "js/$file";
  }
  return '<script type="text/javascript" src="'.htmlentities($src).'"></script>';
}
