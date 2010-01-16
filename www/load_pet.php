<?php
require_once '../pwnage/bootstrap.php';

function handleException($e) {
  if(PWNAGE_ENVIRONMENT == 'development') {
    echo 'Error! Debug output (only for development mode): <xmp>';
    var_dump($e);
    die('</xmp>');
  }
}

function buildQuery($data, $leading='') {
  $strings = array();
  foreach($data as $key => $value) {
    if($leading) $key = $leading.'[]';
    $strings[] = is_array($value) ?
      buildQuery($value, $key) : $key.'='.urlencode($value);
  }
  return implode('&', $strings);
}

function buildPath($path, $query) {
  if($query) {
    $path .= '?'.buildQuery($query);
  }
  return $path;
}

$pet = new Pwnage_Pet();

$destination = '/';
$query = array();

if($pet_name = $_POST['name']) {
  $pet->name = $pet_name;
  try {
    if($pet->exists()) {
      try {
        $pet->saveData();
      } catch(Exception $e) {
        handleException($e);
        $warning = 'save_error';
      }
    } else {
      $error = 'not_found';
    }
  } catch(Pwnage_AMFConnectionError $e) {
    handleException($e);
    $error = 'connection_error';
  }
  
  if($error) {
    $query['error'] = $error;
    $query['name'] = $pet_name;
  } else {
    $destination = 'wardrobe.html';
    $object_ids = array();
    foreach($pet->getObjects() as $object) {
      $object_ids[] = $object->getId();
    }
    $query['color'] = $pet->getColor()->getId();
    $query['species'] = $pet->getSpecies()->getId();
    $query['objects'] = $object_ids;
    if($warning) {
      $would_be_destination = buildPath($destination, $query);
      $query = array();
      $query['warning'] = $warning;
      $query['name'] = $pet_name;
      $query['destination'] = $would_be_destination;
      $destination = '/';
    }
  }
}

header('Location: '.buildPath($destination, $query));
?>
