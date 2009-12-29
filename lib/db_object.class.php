<?php
class Wearables_DBObject {
  protected function beforeSave() {}
  
  public function getValueSet($db, $columns) {
    $this->beforeSave();
    $values = array();
    foreach($columns as $column) {
      $values[] = $db->quote($this->$column);
    }
    return '('.implode(', ', $values).')';
  }
  
  public function save($db, $table, $columns) {
    if(!$this->isSaved($db)) { // to be determined by subclass
      self::saveCollection(array($this), $db, $table, $columns);
      return $db->lastInsertId();
    }
  }
  
  static function getColumnSet($columns) {
    return '('.implode(', ', $columns).')';
  }
  
  static function saveCollection($objects, $db, $table, $columns) {
    if($objects) {
      $value_sets = array();
      foreach($objects as $object) {
        $value_sets[] = $object->getValueSet($db, $columns);
      }
      $db->exec("REPLACE INTO $table ".self::getColumnSet($columns)
        .' VALUES '.implode(', ', $value_sets));
    }
  }
}
?>
