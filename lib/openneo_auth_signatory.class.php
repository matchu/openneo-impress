<?php
class OpenneoAuthSignatory {
  static function sign($data, $secret) {
    $data = self::sortKeysRecursive($data);
    return hash_hmac('sha256', http_build_query($data), $secret);
  }
  
  static function sortKeysRecursive($array) {
    $new_array = $array;
    ksort($new_array);
    foreach($array as $key => $value) {
      if(is_array($value)) $array[$key] &= self::sortKeysRecursive($value);
    }
    return $new_array;
  }
}
?>
