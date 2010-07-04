<?php
function smarty_insert_js($params, &$smarty) {
  static $timestamps;
  if(!isset($timestamps)) {
    $timestamps_path = PWNAGE_ROOT.'/tmp/asset_timestamps.php';
    $timestamps = file_exists($timestamps_path) ? include($timestamps_path) : array();
  }
  $file = $params['src'];
  $src = '/assets/';
  if(isset($_GET['debug'])) {
    $src .= 'js/debug.php?file='.basename($file);
  } elseif(isset($timestamps[$file])) {
    $src .= "$file?v=${timestamps[$file]}";
  }
  return '<script type="text/javascript" src="'.htmlentities($src).'"></script>';
}
