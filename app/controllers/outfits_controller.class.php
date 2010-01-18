<?php
class Pwnage_OutfitsController extends PwnageCore_Controller {
  public function start() {
    if(isset($_SESSION['destination'])) {
      $this->set('destination', $_SESSION['destination']);
    }
    
    if(!$this->isCached()) {
      $fields = array(
        'color' => Pwnage_Color::all(),
        'species' => Pwnage_Species::all()
      );
      foreach($fields as $key => $objects) {
        $fields[$key] = array();
        foreach($objects as $object) {
          $fields[$key][$object->getId()] = $object->getName();
        }
      }
      $this->set('fields', $fields);
    }
  }
}
?>
