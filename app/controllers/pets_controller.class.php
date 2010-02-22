<?php
class Pwnage_PetsController extends Pwnage_ApplicationController {
  public function load() {
    $pet = new Pwnage_Pet();

    $destination = $this->post['origin'];
    $query = array();
    $error = false;

    if($pet_name = $this->post['name']) {
      $pet->name = $pet_name;
      try {
        if($pet->exists()) {
          try {
            if($this->userIsLoggedIn()) {
              $this->getCurrentUser()->contributePet($pet);
            } else {
              $pet->save();
            }
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
        if(isset($this->post['destination'])) {
          $destination = $this->post['destination'];
        } else {
          $destination = $this->post['origin'];
        }
        if(substr($destination, 0, 1) != '/') {
          $destination = '/'.$destination;
        }
        $object_ids = array();
        foreach($pet->getObjects() as $object) {
          $object_ids[] = $object->getId();
        }
        $query['color'] = $pet->getColor()->getId();
        $query['species'] = $pet->getSpecies()->getId();
        $query['objects'] = $object_ids;
        $query['name'] = $pet_name;
        if($warning) {
          $would_be_destination = $this->buildPath($destination, $query);
          $query = array();
          $_SESSION['destination'] = $would_be_destination;
          $destination = $this->post['origin'];
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
