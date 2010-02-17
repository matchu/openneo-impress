<?php
class Pwnage_PetAttributesController extends Pwnage_ApplicationController {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $this->setCacheLifetime(48*60);
    if(!$this->isCached()) {
      $attributes_by_type = array(
        'color' => Pwnage_Color::all(), 
        'species' => Pwnage_Species::all()
      );
      foreach($attributes_by_type as &$set) {
        foreach($set as &$object) {
          $object = array(
            'id' => $object->getId(),
            'name' => $object->getName()
          );
        }
      }
      $this->respondWithAndCache($attributes_by_type);
    }
  }
}
?>
