<?php
class Pwnage_User extends PwnageCore_DbObject {
  static $table = 'users';
  static $columns = array('id', 'name', 'auth_server_id', 'remote_id');
  
  public function getFreshLoginCookie($existing_string) {
    $existing_login_cookie = Pwnage_LoginCookie::findByString($existing_string);
    $login_cookie = new Pwnage_LoginCookie();
    $login_cookie->setUser($this);
    if($existing_login_cookie && $existing_login_cookie->getUserId() == $login_cookie->getUserId()) {
      $login_cookie = &$existing_login_cookie;
    } else {
      $login_cookie->randomizeSeries();
    }
    $login_cookie->randomizeToken();
    $login_cookie->save();
    return $login_cookie;
  }
  
  public function getName() {
    return $this->name;
  }
  
  public function save() {
    $id = parent::save(self::$table, self::$columns);
    if($id) $this->id = $id;
  }
  
  protected function setRemoteData($data) {
    $this->name = $data['name'];
    $this->remote_id = $data['id'];
  }
  
  static function findOrCreateFromAuthClientAndServer($auth_client, $auth_server) {
    $user_data = $auth_client->getUserData();
    $user = self::first(array(
      'where' => array('auth_server_id = ? AND remote_id = ?',
        $auth_server->id, $user_data['id'])
    ));
    if(!$user) {
      $user = new self;
      $user->setRemoteData($user_data);
      $user->auth_server_id = $auth_server->id;
      $user->save();
    }
    return $user;
  }
  
  static function find($id, $options=array()) {
    return parent::find($id, $options, self::$table, __CLASS__);
  }
  
  static function first($options) {
    return parent::first($options, self::$table, __CLASS__);
  }
}
?>
