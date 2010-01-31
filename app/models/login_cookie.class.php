<?php
class Pwnage_LoginCookie extends PwnageCore_DbObject {
  static $table = 'login_cookies';
  static $columns = array('user_id', 'series', 'token');
  
  public function delete() {
    self::deleteCollection(array(
      'where' => array('id = ?', $this->id)
    ));
  }
  
  public function getCookieString() {
    return $this->user_id.','.$this->series.','.$this->token;
  }
  
  public function getUserId() {
    return $this->user_id;
  }
  
  public function randomizeSeries() {
    $this->series = mt_rand();
  }
  
  public function randomizeToken() {
    $this->token = mt_rand();
  }
  
  public function save() {
    return parent::save(self::$table, self::$columns);
  }  
  
  public function setSeries($series) {
    $this->series = $series;
  }
  
  public function setUser($user) {
    $this->user_id = $user->id;
  }
  
  public function update() {
    return parent::update(self::$table, self::$columns);
  }
  
  static function deleteCollection($options) {
    $db = PwnageCore_Db::getInstance();
    $sql = 'DELETE FROM '.self::$table;
    if(isset($options['where'])) {
      $where = $options['where'];
      $sql .= ' WHERE '.array_shift($where);
    }
    $stmt = $db->prepare($sql);
    return isset($where) ? $stmt->execute($where) : $stmt->execute();
  }
  
  static function findByString($string) {
    if($string) {
      list($user_id, $series, $token) = explode(',', $string);
      $login_cookie = self::first(array(
        'where' => array('user_id = ? AND series = ?', $user_id, $series)
      ));
      if($login_cookie && $login_cookie->token != $token) {
        Pwnage_LoginCookie::deleteCollection(array(
          'where' => array('user_id = ?', $user_id)
        ));
        throw new Pwnage_LoginCookieTokenChanged;
      }
      return $login_cookie;
    } else {
      return false;
    }
  }
  
  static function first($options) {
    return parent::first($options, self::$table, __CLASS__);
  }
}

class Pwnage_LoginCookieTokenChanged extends Exception {}
?>
