<?php
class Pwnage_PetsController extends PwnageCore_Controller {
  public function load() {
    $pet = new Pwnage_Pet();

    $destination = '/';
    $query = array();
    $error = false;

    if($pet_name = $this->post['name']) {
      $pet->name = $pet_name;
      try {
        if($pet->exists()) {
          try {
            $pet->save();
          } catch(Exception $e) {
            if(PWNAGE_ENVIRONMENT == 'development') {
              throw $e;
            } else {
              $this->setFlash('pets/save_error', 'warning');
              $warning = true;
            }
          }
        } else {
          $this->setFlash('pets/not_found', 'error');
          $error = true;
        }
      } catch(Pwnage_AMFConnectionError $e) {
        $this->setFlash('connection_error', 'error');
        $error = true;
      }
      
      if($error) {
        $query['name'] = $pet_name;
      } else {
        $destination = '/wardrobe.html';
        $object_ids = array();
        foreach($pet->getObjects() as $object) {
          $object_ids[] = $object->getId();
        }
        $query['color'] = $pet->getColor()->getId();
        $query['species'] = $pet->getSpecies()->getId();
        $query['objects'] = $object_ids;
        if($warning) {
          $would_be_destination = $this->buildPath($destination, $query);
          $query = array();
          $query['name'] = $pet_name;
          $_SESSION['destination'] = $would_be_destination;
          $destination = '/';
        }
      }
    }
    
    $this->redirect($this->buildPath($destination, $query));
  }
  
  private function buildQuery($data, $leading='') {
    $strings = array();
    foreach($data as $key => $value) {
      if($leading) $key = $leading.'[]';
      $strings[] = is_array($value) ?
        $this->buildQuery($value, $key) : $key.'='.urlencode($value);
    }
    return implode('&', $strings);
  }

  private function buildPath($path, $query) {
    if($query) {
      $path .= '?'.$this->buildQuery($query);
    }
    return $path;
  }
}
?>
