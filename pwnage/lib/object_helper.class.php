<?php
class PwnageCore_ObjectHelper {
  static function sanitize($objects_or_object, $attributes) {
    if(is_array($objects_or_object)) {
      $sanitized_objects = array();
      foreach($objects_or_object as $object) {
        $sanitized_objects[] = self::sanitize($object, &$attributes);
      }
      return $sanitized_objects;
    } else {
      $sanitized_object = new stdClass;
      foreach($attributes as $attribute) {
        $sanitized_object->$attribute = $objects_or_object->$attribute;
      }
      return $sanitized_object;
    }
  }
}
?>
