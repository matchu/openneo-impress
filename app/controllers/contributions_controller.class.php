<?php
class Pwnage_ContributionsController extends Pwnage_ApplicationController {
  public function index() {
    if($user_id = $this->path['user_id']) {
      $user = Pwnage_User::find($user_id, array(
        'select' => 'name, points'
      ));
      if($user) {
        $this->set('user', $user);
        $pagination = Pwnage_Contribution::paginate(array(
          'select' => 'id, contributed_class, contributed_id, created_at',
          'where' => array('user_id = ?', $user_id),
          'order_by' => 'id DESC',
          'page' => $this->get['page'],
          'per_page' => 30
        ));
        $contributions =& $pagination->results;
        Pwnage_Contribution::preloadContributedAndParents($contributions, array(
          'Pwnage_Object' => 'id, name, thumbnail_url',
          'Pwnage_ObjectAsset' => 'id',
          'Pwnage_PetState' => 'id, pet_type_id',
          'Pwnage_PetType' => 'id, species_id, color_id, image_hash'
        ));
      } else {
        throw new PwnageCore_NotFoundException;
      }
    } // TODO: else?
    $this->set('pagination', $pagination);
  }
}
?>
