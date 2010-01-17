<?php
class Pwnage_PetTypesController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }

  public function index() {
    $attributes = $this->get['attributes'];
  }
}
?>
