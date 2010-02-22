<?php
function smarty_function_path($params, &$smarty) {
  try {
    $route_manager = PwnageCore_RouteManager::getInstance();
    if(isset($params['for'])) {
      $route = $route_manager->findByResource($params['for'], $params['to']);
      unset($params['for']);
      unset($params['to']);
    } else {
      $route = $route_manager->findByName($params['to']);
      unset($params['to']);
    }
    $route->setParams($params);
    return $route->getPath();
  } catch(PwnageCore_RouteNotFoundError $e) {
    return '/404?route_name='.$e->getRouteName();
  }
}
?>
