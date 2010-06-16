<?php
class Pwnage_OutfitsController extends Pwnage_ApplicationController {
  public function edit() {}
  
  public function start() {
    $this->setLayout(false);
    $this->setCacheLifetime(60);

    if(isset($_SESSION['destination'])) {
      $this->set('destination', $_SESSION['destination']);
    }
    
    if(!$this->isCached()) {
      $this->preparePetTypeFields(array('color', 'species'));
      $this->set('top_contributors', Pwnage_User::all(array(
        'order_by' => 'points DESC',
        'limit' => 3
      )));
    }
  }
}
?>
