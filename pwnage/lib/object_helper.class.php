<?php
class PwnageCore_ObjectHelper {
  const SanitizeAssoc = true;
  static function sanitize($objects_or_object, $attributes, $is_assoc = false) {
    if(!$is_assoc && is_array($objects_or_object)) {
      $sanitized_objects = array();
      foreach($objects_or_object as $object) {
        $sanitized_objects[] = self::sanitize($object, &$attributes);
      }
      return $sanitized_objects;
    } else {
      $sanitized_object = $is_assoc ? array() : new stdClass;
      foreach($attributes as $attribute) {
        if($is_assoc) {
          $sanitized_object[$attribute] = $objects_or_object[$attribute];
        } else {
          $sanitized_object->$attribute = $objects_or_object->$attribute;
        }
      }
      return $sanitized_object;
    }
  }
}
?>
