<?php
class Pwnage_OutfitsController extends Pwnage_ApplicationController {
  public function __construct() {
    $this->setLayout(false);
    parent::__construct();
  }
  
  public function edit() {}
  
  public function start() {
    $this->setCacheLifetime(60);

    if(isset($_SESSION['destination'])) {
      $this->set('destination', $_SESSION['destination']);
    }
    
    if(!$this->isCached()) {
      $this->preparePetTypeFields(array('color', 'species'));
    }
  }
}
?>
