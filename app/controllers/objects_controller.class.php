<?php
class Pwnage_ObjectsController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $this->requireParamArray($this->get, 'ids');
    $ids = implode(', ', array_map('intval', $this->get['ids']));
    $attributes = array(
      'id', 'name', 'thumbnail_url', 'description', 'type', 'rarity',
        'rarity_index', 'price', 'weight_lbs'
    );
    $objects = Pwnage_Object::all(array(
      'select' => implode(', ', $attributes),
      'where' => 'id IN ('.$ids.')'
    ));
    $this->respondWith($objects, $attributes);
  }
}
?>
