<?php
class PwnageCore_DbObject {
  protected function beforeSave() {}
  
  protected function isSaved() { return false; }
  
  private $errors;
  private $is_valid;
  
  private function addError($attribute, $message) {
    $this->errors[] = new PwnageCore_ValidationError($attribute, $message);
  }
  
  public function getErrors() {
    return $this->errors;
  }
  
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
    if(!$this->isSaved()) {
      self::saveCollection(array($this), $table, $columns);
      return $db->lastInsertId();
    }
  }
  
  public function isValid($validations, $table) {
    if(!isset($this->is_valid)) {
      if($validations['present']) {
        foreach($validations['present'] as $attribute) {
          if(empty($this->$attribute)) {
            $this->addError($attribute, 'is required');
          }
        }
      }
      if($validations['confirmed']) {
        foreach($validations['confirmed'] as $attribute) {
          $confirmed_attribute = $attribute.'_confirmation';
          if($this->$attribute != $this->$confirmed_attribute) {
            $this->addError($attribute, 'doesn\'t match its confirmation');
          }
        }
      }
      if($validations['length_under']) {
        foreach($validations['length_under'] as $attribute => $length) {
          if(strlen($this->$attribute) > $length) {
            $this->addError($attribute, "needs to be $length characters at most");
          }
        }
      }
      if($validations['matches']) {
        foreach($validations['matches'] as $attribute => $regex) {
          if(!preg_match("/$regex/i", $this->$attribute)) {
            $this->addError($attribute, 'is not valid format');
          }
        }
      }
      if($validations['unique']) {
        $db = PwnageCore_Db::getInstance();
        foreach($validations['unique'] as $attribute) {
          $statement = $db->query(
            "SELECT count(*) FROM $table WHERE $attribute = ?",
            array($this->$attribute)
          );
          $result = $statement->fetch(PDO::FETCH_NUM);
          if($result[0] > 0) {
            $this->addError($attribute, 'is already taken');
          }
        }
      }
      $this->is_valid = empty($this->errors);
    }
    return $this->is_valid;
  }
  
  public function update($table, $columns) {
    $update_clause_fragments = array();
    $bindings = array();
    foreach($columns as $column) {
      $update_clause_fragments[] = "$column = ?";
      $bindings[] = $this->$column;
    }
    $update_clause = implode(', ', $update_clause_fragments);
    $bindings[] = $this->id;
    $db = PwnageCore_Db::getInstance();
    $stmt = $db->prepare("UPDATE $table SET $update_clause WHERE id = ?");
    return $stmt->execute($bindings);
  }
  
  static function all($options=array(), $table, $subclass) {
    $options = array_merge(array(
      'select' => '*'
    ), $options);
    $sql = "SELECT ${options['select']} FROM $table";
    if($options['joins']) $sql .= " ${options['joins']}";
    if($options['where']) {
      if(is_array($options['where'])) {
        $where = array_shift($options['where']);
        $where_params = $options['where'];
      } else {
        $where = $options['where'];
      }
      $sql .= " WHERE $where";
    }
    if($options['limit']) $sql .= " LIMIT ${options['limit']}";
    $db = PwnageCore_Db::getInstance();
    if($where_params) {
      $query = $db->query($sql, $where_params);
    } else {
      $query = $db->query($sql);
    }
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
    $options['where'] = 'id = '.intval($id);
    return self::first($options, $table, $subclass);
  }
  
  static function first($options=array(), $table, $subclass) {
    $options['limit'] = 1;
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
