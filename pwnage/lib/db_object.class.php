<?php
class PwnageCore_DbObject {
  protected function beforeSave() {}
  
  public function getValueSet($db, $columns) {
    $this->beforeSave();
    $values = array();
    foreach($columns as $column) {
      $values[] = $db->quote($this->$column);
    }
    return '('.implode(', ', $values).')';
  }
  
  public function save($table, $columns) {
    $db = PwnageCore_Db::getInstance();
    if(!$this->isSaved()) { // to be determined by subclass
      self::saveCollection(array($this), $table, $columns);
      return $db->lastInsertId();
    }
  }
  
  static function all($options=array(), $table, $subclass) {
    $options = array_merge(array(
      'select' => '*'
    ), $options);
    $sql = "SELECT ${options['select']} FROM $table";
    if($options['joins']) $sql .= " ${options['joins']}";
    if($options['where']) $sql .= " WHERE ${options['where']}";
    if($options['limit']) $sql .= " LIMIT ${options['limit']}";
    $db = PwnageCore_Db::getInstance();
    $query = $db->query($sql);
    $objects = array();
    while($object = $query->fetchObject($subclass)) {
      $objects[] = $object;
    }
    return $objects;
  }
  
  static function mergeConditions($where1, $where2) {
    return implode(' AND ', array_filter(array($where1, $where2)));
  }
  
  static function find($id, $options=array(), $table, $subclass) {
    $options['limit'] = 1;
    $options['where'] = 'id = '.intval($id);
    $results = self::all($options, $table, $subclass);
    return $results[0];
  }
  
  static function getColumnSet($columns) {
    return '('.implode(', ', $columns).')';
  }
  
  static function saveCollection($objects, $table, $columns) {
    $db = PwnageCore_Db::getInstance();
    if($objects) {
      $value_sets = array();
      foreach($objects as $object) {
        $value_sets[] = $object->getValueSet($db, $columns);
      }
      return $db->exec("REPLACE INTO $table ".self::getColumnSet($columns)
        .' VALUES '.implode(', ', $value_sets));
    } else {
      return false;
    }
  }
}
?>
