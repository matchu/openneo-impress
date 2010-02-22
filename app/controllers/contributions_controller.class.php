<?php
class Pwnage_ContributionsController extends Pwnage_ApplicationController {
  public function index() {
    if($user_id = $this->path['user_id']) {
      $user = Pwnage_User::find($user_id, array(
        'select' => 'name'
      ));
      $contributions = Pwnage_Contribution::all(array(
        'select' => 'id',
        'where' => array('user_id = ?', $user_id)
      ));
      $this->renderText('User '.$user->getName().' has made '.count($contributions).' contributions');
    }
  }
}
?>
