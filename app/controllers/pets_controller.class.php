<?php
class Pwnage_PetsController extends Pwnage_ApplicationController {
  public function bulk() {}
  
  public function load() {
    $this->requireParam($this->post, 'name');
    if($this->format != 'json') $this->requireParam($this->post, 'origin');
    $pet = new Pwnage_Pet();

    $destination = $this->post['origin'];
    $query = array();
    $error = false;

    $pet->name = $this->post['name'];
    try {
      if($pet->exists()) {
        try {
          if($this->userIsLoggedIn()) {
            $contributions = $this->getCurrentUser()->contributePet($pet);
          } else {
            $pet->save();
          }
        } catch(Exception $e) {
          if(PWNAGE_ENVIRONMENT == 'development') {
            throw $e;
          } else {
            if($this->format == 'json') {
              throw new PwnageCore_InternalServerError('Error saving pet. Try again later.');
            } else {
              $this->setFlash('pets/save_error', 'warning');
              $warning = true;
            }
          }
        }
      } else {
        if($this->format == 'json') {
          throw new PwnageCore_NotFoundException('Pet not found.');
        } else {
          $this->setFlash('pets/not_found', 'error');
          $error = true;
        }
      }
    } catch(Pwnage_AMFConnectionError $e) {
      if($this->format == 'json') {
        throw new PwnageCore_InternalServerError('Could not connect to Neopets. Try again later.');
      } else {
        $this->setFlash('connection_error', 'error');
        $error = true;
      }
    }
    
    if($this->format == 'json') {
      if(isset($contributions)) {
        $response = 0;
        foreach($contributions as $contribution) {
          $response += $contribution->getPointValue();
        }
      } else {
        $response = true;
      }
      $this->respondWith($response);
    } else {
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
        $query['state'] = $pet->getPetState()->getId();
        $query['objects'] = $object_ids;
        $query['name'] = $pet_name;
        if($warning) {
          $would_be_destination = $this->buildPath($destination, $query);
          $query = array();
          $_SESSION['destination'] = $would_be_destination;
          $destination = $this->post['origin'];
        }
      }
      $this->redirect($this->buildPath($destination, $query));
    }
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
