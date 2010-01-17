<?php
class Pwnage_ObjectsController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    if(!isset($this->get['ids'])) {
      throw new Pwnage_BadRequestException('$ids required');
    }
    $ids = implode(', ', array_map('intval', $this->get['ids']));
    $attributes = array(
      'id', 'name', 'thumbnail_url', 'description', 'type', 'rarity',
        'rarity_index', 'price', 'weight_lbs'
    );
    $objects = Pwnage_Object::all(array(
      'select' => implode(', ', $attributes),
      'where' => 'id IN ('.$ids.')'
    ));
    $this->respondWith(PwnageCore_ObjectHelper::sanitizeCollection($objects, $attributes));
  }
}
?>
