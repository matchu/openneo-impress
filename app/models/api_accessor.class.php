<?php
class Pwnage_ApiAccessor {
  protected function resultObjects($results, $select) {
    $result_objects = array();
    foreach($results as $result) {
      if($result) {
        $general_result = new stdClass();
        foreach($select as $column) {
          $general_result->$column = $result->$column;
        }
      } else {
        $general_result = null;
      }
      $result_objects[] = $general_result;
    }
    return $result_objects;
  }
}
?>
