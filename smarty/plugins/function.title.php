<?php
function smarty_function_title($params, &$smarty) {
  $smarty->assign('_title', $params['is']);
}
?>
