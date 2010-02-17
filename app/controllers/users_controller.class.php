<?php
class Pwnage_UsersController extends Pwnage_ApplicationController {
  public function authorize() {
    try {
      $auth_client = new OpenneoAuthClient($this->post);
      $auth_server = Pwnage_AuthServer::first(array(
        'select' => 'id, secret',
        'where' => array('short_name = ?', $auth_client->getSource())
      ));
      if(!$auth_server) {
        $this->handleException('Source not found');
      } else {
        $auth_client->validateData($auth_server->secret);
        session_id($auth_client->getSessionId());
        session_start();
        $user = Pwnage_User::findOrCreateFromAuthClientAndServer($auth_client, $auth_server);
        $this->remotelyAuthorizeUser($user);
      }
    } catch(OpenneoAuthClient_InvalidDataException $e) {
      $this->handleException($e->getMessage());
    }
    $this->renderText('Success');
  }
  
  public function current() { //FIXME: remove
    $this->renderText(session_id().'<xmp>'.print_r($this->getCurrentUser(),1).'</xmp>');
  }
  
  public function login() { //FIXME: remove
    if($this->get['server']) {
      $auth_server = Pwnage_AuthServer::find($this->get['server']);
    }
    if(!$auth_server) {
      $auth_server = Pwnage_AuthServer::first();
    }
    $url = $auth_server->getLoginUrl();
    $this->redirect($url);
  }
  
  public function logout() {
    $this->clearSession();
    $this->redirectToRoute('root');
  }
  
  private function handleException($message) {
    header('HTTP/1.0 400 Bad Request');
    die(htmlentities($message));
  }
}
?>
