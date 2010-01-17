<?php
class Pwnage_PetAttributesController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $options = array(
      'select' => 'id, name'
    );
    $attributes_by_type = array(
      'color' => Pwnage_Color::all(), 
      'species' => Pwnage_Species::all()
    );
    $this->respondWith($attributes_by_type);
  }
}
?>