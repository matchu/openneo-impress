<?php
class PwnageCore_ObjectHelper {
  static function sanitizeCollection($objects, $attributes) {
    $sanitized_objects = array();
    foreach($objects as $object) {
      $sanitized_objects[] = self::sanitize($object, &$attributes);
    }
    return $sanitized_objects;
  }
  
  static function sanitize($object, $attributes) {
    $sanitized_object = new stdClass;
    foreach($attributes as $attribute) {
      $sanitized_object->$attribute = $object->$attribute;
    }
    return $sanitized_object;
  }
}
?>
