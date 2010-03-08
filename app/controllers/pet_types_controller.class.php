<?php
class Pwnage_PetTypesController extends Pwnage_ApplicationController {
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
      throw new PwnageCore_BadRequestException("Value '$for' not expected for \$for");
    }
    $pet_type = Pwnage_PetType::findBySpeciesIdAndColorId(
      $this->get['species_id'],
      $this->get['color_id'],
      array(
        'select' => $select
      )
    );
    if($pet_type) {
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
  
  public function needed() {
    $this->respondTo('json');
    if(isset($this->get['species'])) {
      $species = new Pwnage_Species($this->get['species']);
      if($species->exists()) {
        $pet_types = Pwnage_PetType::all(array(
          'select' => 'color_id',
          'where' => array('species_id = ?', $this->get['species'])
        ));
        $color_ids = array();
        foreach($pet_types as $pet_type) {
          $color_ids[] = (int) $pet_type->color_id;
        }
        $colors = array(
          'had' => array(),
          'needed' => array()
        );
        foreach($species->getPossibleColors() as $color) {
          $collection = in_array($color->getId(), $color_ids) ?
            'had' : 'needed';
          $colors[$collection][] = $color;
        }
        $this->set('species_name', $species->getName());
        $this->set('colors_had', $colors['had']);
        $this->set('colors_needed', $colors['needed']);
      }
    }
    if(isset($species) && $species->exists()) {
      $this->preparePetTypeFields(array('species'),
        array('species' => intval($species->getId())));
    } else {
      $this->preparePetTypeFields(array('species'));
    }
    if(isset($this->get['name'], $this->get['color'])) {
      $color = new Pwnage_Color($this->get['color']);
      if($color->exists()) {
        $this->set(array(
          'color_name' => $color->getName(),
          'pet_name' => $this->get['name']
        ));
      }
    }
  }
}
?>
