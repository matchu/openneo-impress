<?php
function smarty_insert_userbar($params, &$smarty) {
  $caching = $smarty->caching;
  $smarty->caching = 0;
  $output = $smarty->fetch('shared/userbar.tpl');
  $smarty->caching = $caching;
  return $output;
}
?>
