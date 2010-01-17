<?php
class PwnageCore_ObjectHelper {
  static function sanitize($objects, $attributes) {
    $sanitized_objects = array();
    foreach($objects as $object) {
      $sanitized_object = new stdClass;
      foreach($attributes as $attribute) {
        $sanitized_object->$attribute = $object->$attribute;
      }
      $sanitized_objects[] = $sanitized_object;
    }
    return $sanitized_objects;
  }
}
?>
