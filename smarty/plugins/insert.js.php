<?php
require_once dirname(__FILE__).'/insert.asset.php';
function smarty_insert_js($params, &$smarty) {
  $base_file = $params['src'];
  if(ASSETS_DEBUG_MODE && (!isset($params['debug']) || $params['debug'] !== false)) {
    $src = '/assets/js/debug.php?file='.$base_file;
  } else {
    $src = smarty_insert_asset(array('file' => "js/$base_file.js"), $smarty);
  }
  return '<script type="text/javascript" src="'.htmlentities($src).'"></script>';
}
