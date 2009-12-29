<?php
class Wearables_DBObject {
  public function beforeSave() {}
  
  public function getValueSet($db, $columns) {
    $this->beforeSave();
    $values = array();
    foreach($columns as $column) {
      $values[] = $db->quote($this->$column);
    }
    return '('.implode(', ', $values).')';
  }
  
  static function saveCollection($assets, $db, $columns) {
    $value_sets = array();
    foreach($assets as $asset) {
      $value_sets[] = $asset->getValueSet($db, $columns);
    }
    $db->exec('REPLACE INTO swf_assets ('.implode(', ', $columns).')'
      .' VALUES '.implode(', ', $value_sets));
  }
}
?>
