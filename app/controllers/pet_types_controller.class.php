<?php
class Pwnage_PetTypesController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }

  public function index() {
    $params = array('for', 'color_id', 'species_id');
    $this->requireParam($this->get, $params);
    $for = $this->get['for'];
    if($for == 'image') {
      $select = 'image_hash';
      $attributes = array('image_hash');
    } elseif($for == 'wardrobe') {
      $select = 'id, body_id';
      $attributes = array('id', 'body_id', 'pet_state_ids');
    } else {
      throw new Pwnage_BadRequestException("Value '$for' not expected for \$for");
    }
    $pet_types = Pwnage_PetType::all(array(
      'select' => $select,
      'where' => 'species_id = '.intval($this->get['species_id']).' AND '
        .'color_id = '.intval($this->get['color_id']),
      'limit' => 1
    ));
    if(count($pet_types)) {
      $pet_type = $pet_types[0];
      if($for == 'wardrobe') {
        $pet_states = Pwnage_PetState::all(array(
          'select' => 'id',
          'where' => "pet_type_id = $pet_type->id"
        ));
        foreach($pet_states as $pet_state) {
          $pet_type->pet_state_ids[] = intval($pet_state->id);
        }
      }
      $this->respondWith($pet_type, $attributes);
    } else {
      $this->respondWith(null);
    }
  }
}
?>
