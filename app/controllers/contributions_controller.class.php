<?php
class Pwnage_ContributionsController extends Pwnage_ApplicationController {
  public function index() {
    if($user_id = $this->path['user_id']) {
      $user = Pwnage_User::find($user_id, array(
        'select' => 'name'
      ));
      $contributions = Pwnage_Contribution::allWithContributed(array(
        'select' => 'id, contributed_class, contributed_id',
        'where' => array('user_id = ?', $user_id)
      ), array(
        'Pwnage_Object' => 'id',
        'Pwnage_ObjectAsset' => 'id',
        'Pwnage_PetState' => 'id',
        'Pwnage_PetType' => 'id'
      ));
      Pwnage_Contribution::preloadParentsOfContributedObjsForCollection($contributions);
      $this->renderText(
        'User '.$user->getName().' has made '.count($contributions).' contributions:'.
        print_r($contributions, 1)
      );
    }
  }
}
?>
