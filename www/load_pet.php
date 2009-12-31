<?php
require_once '../lib/pet.class.php';

$pet = new Wearables_Pet();
if($pet_name = $_POST['name']) {
  $pet->name = $pet_name;
  try {
    if($pet->exists()) {
      try {
        $pet->saveData();
      } catch(Exception $e) {
        $warning = 'save_error';
      }
    } else {
      $error = 'not_found';
    }
  } catch(Wearables_AMFConnectionError $e) {
    $error = 'connection_error';
  }
  
  if($error) {
    $destination = "/index.php?error=$error&name=".urlencode($pet_name);
  } else {
    $object_ids = array();
    foreach($pet->getObjects() as $object) {
      $object_ids[] = $object->getId();
    }
    $destination = '/wardrobe.html?color='.$pet->getColor()->getId()
      .'&species='.$pet->getSpecies()->getId()
      .'&objects='.implode(',', $object_ids);
    if($warning) {
      $destination = "/index.php?warning=$warning&name=$pet_name"
        .'&destination='.urlencode($destination);
    }
  }
} else {
  $destination = '/';
}

header("Location: $destination");
?>
