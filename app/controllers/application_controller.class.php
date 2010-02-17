<?php
class Pwnage_ApplicationController extends PwnageCore_Controller {
  const loginCookieName = 'remember_me';
  const remoteAuthorizationSessionKey = 'remote_authorization';
  const currentUserSessionKey = 'current_user';
  
  protected function __construct() {
    $this->setDefaultLayout('standard');
    parent::__construct();
  }
  
  protected function clearSession() {
    $login_cookie = $this->getCurrentLoginCookie();
    if($login_cookie) $login_cookie->delete();
    session_destroy();
    setcookie(
      self::loginCookieName, // name
      '', // value
      time() - 60*60*24*30, // expire (-30 days)
      '/', // path
      $_SERVER['SERVER_NAME'], // host
      false, // secure
      true // httponly
    );
  }
  
  public function getAuthServers() {
    return Pwnage_AuthServer::all();
  }
  
  protected function getCurrentLoginCookie() {
    return Pwnage_LoginCookie::findByString($_COOKIE[self::loginCookieName]);
  }
  
  public function getCurrentPath() {
    return $_SERVER['REQUEST_URI'];
  }
  
  public function getCurrentUser() {
    if(!$this->current_user) {
      if($remote_auth = $_SESSION[self::remoteAuthorizationSessionKey]) {
        if($remote_auth['time'] + 180 > time()) {
          $user = Pwnage_User::find($remote_auth['user_id']);
          if($user) {
            $cookie = $user->getFreshLoginCookie($_COOKIE[self::loginCookieName]);
            $this->setLoginCookie($cookie);
            unset($_SESSION[self::remoteAuthorizationSessionKey]);
          }
        } else {
          $this->setFlash('users/remote_authorization_expired', 'error');
        }
      } elseif(isset($_SESSION[self::currentUserSessionKey])) {
        $current_user_session = $_SESSION[self::currentUserSessionKey];
        if($current_user_session['time'] + 900 > time()) { // 15 minute expiry
          $user = Pwnage_User::find($current_user_session['user_id']);
        }
      }
      
      if(!isset($user) && isset($_COOKIE[self::loginCookieName])) {
        try {
          $login_cookie = $this->getCurrentLoginCookie();
          if($login_cookie) {
            $user = Pwnage_User::find($login_cookie->getUserId());
            $login_cookie->randomizeToken();
            $login_cookie->update();
            $this->setLoginCookie($login_cookie);
          }
        } catch(Pwnage_LoginCookieTokenChanged $e) {
          $this->setFlash('users/login_cookie_token_changed', 'error');
        }
      }
      $this->current_user = $user ? $user : false;
    }
    return $this->current_user;
  }
  
  protected function preparePetTypeFields($types, $selected_id=array()) {
    $fields = array();
    foreach($types as $type) {
      $class_name = 'Pwnage_'.ucfirst($type);
      $objects = call_user_func(array($class_name, 'all'));
      $fields[$type] = array();
      foreach($objects as $object) {
        $fields[$type][$object->getId()] = $object->getName();
      }
    }
    $this->set('pet_type_fields', $fields);
    $this->set('pet_type_fields_selected', $selected_id);
  }
  
  protected function remotelyAuthorizeUser($user) {
    $_SESSION[self::remoteAuthorizationSessionKey] = array(
      'user_id' => $user->id,
      'time' => time()
    );
  }
  
  private function setLoginCookie($cookie) {
    $_SESSION[self::currentUserSessionKey] = array(
      'user_id' => $cookie->getUserId(),
      'time' => time()
    );
    setcookie(
      self::loginCookieName, // name
      $cookie->getCookieString(), // value
      time() + 60*60*24*30, // expire (30 days)
      '/', // path
      $_SERVER['SERVER_NAME'], // host
      false, // secure
      true // httponly
    );
  }
}
?>
