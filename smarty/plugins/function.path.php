<?php
function smarty_function_path($params, &$smarty) {
  $to = $params['to'];
  unset($params['to']);
  return PwnageCore_RouteManager::getInstance()->find_by_name($to)->
    getPath();
}
?>
