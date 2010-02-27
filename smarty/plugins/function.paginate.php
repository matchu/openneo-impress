<?php
function smarty_function_paginate($params, &$smarty) {
  static $cache = array();
  $name = $params['name'];
  if(!isset($cache[$name])) {
    $pagination_data = $params['with'];
    $pagination = new PwnageCore_Pagination;
    $pagination->items($pagination_data->total);
    $pagination->limit($pagination_data->per_page);
    $pagination->currentPage($pagination_data->page);
    $cache[$name] = $pagination->getOutput();
  }
  return $cache[$name];
}
?>
