<?php
class Pwnage_ContributionsController extends Pwnage_ApplicationController {
  public function index() {
    if($user_id = $this->path['user_id']) {
      $user = Pwnage_User::find($user_id, array(
        'select' => 'name, points'
      ));
      if($user) {
        $this->set('user', $user);
        $this->preparePagination(array(
          'where' => array('user_id = ?', $user_id)
        ));
      } else {
        throw new PwnageCore_NotFoundException;
      }
    } else {
      $pagination = $this->preparePagination();
      Pwnage_Contribution::preloadUsers($pagination->results, array(
        'select' => 'name'
      ));
    }
  }
  
  private function preparePagination($options=array()) {
    $pagination = Pwnage_Contribution::paginate(array_merge(array(
      'select' => 'id, contributed_class, contributed_id, created_at, user_id',
      'order_by' => 'id DESC',
      'page' => $this->get['page'],
      'per_page' => 30
    ), $options));
    $contributions =& $pagination->results;
    Pwnage_Contribution::preloadContributedAndParents($contributions, array(
      'Item' => 'id, name, thumbnail_url',
      'SwfAsset' => 'id',
      'PetState' => 'id, pet_type_id',
      'PetType' => 'id, species_id, color_id, image_hash'
    ));
    $this->set('pagination', $pagination);
    return $pagination;
  }
}
?>
