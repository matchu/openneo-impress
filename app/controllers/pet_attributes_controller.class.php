<?php
class Pwnage_PetAttributesController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $attributes_by_type = array(
      'color' => Pwnage_Color::all(), 
      'species' => Pwnage_Species::all()
    );
    foreach($attributes_by_type as $type => &$attributes) {
      $attributes = PwnageCore_ObjectHelper::sanitize($attributes,
        array('id', 'name'));
    }
    $this->respondWith($attributes_by_type);
  }
}
?>
