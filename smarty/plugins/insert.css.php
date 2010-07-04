<?php
require_once dirname(__FILE__).'/insert.asset.php';
function smarty_insert_css($params, &$smarty) {
  $src = "css/${params['src']}.css";
  if(ASSETS_DEBUG_MODE) {
    $src = "/assets/$src";
  } else {
    $src = smarty_insert_asset(array('file' => $src), $smarty);
  }
  return '<link type="text/css" rel="stylesheet" href="'.htmlentities($src).'" />';
}
