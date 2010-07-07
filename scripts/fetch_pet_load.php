#!/usr/bin/php
<?php
require_once 'SabreAMF/Client.php';
require_once dirname(__FILE__).'/../pwnage/environment.php';

if(isset($argv[1])) {
  $pet_load = Pwnage_PetLoad::find($argv[1], array('select' => 'amf, pet_name'));
  if($pet_load) {
    $amf_lines = explode("\n", print_r($pet_load->getAMFData(), 1));
    foreach($amf_lines as $amf_line) {
      $only_line = ltrim($amf_line);
      $depth = (strlen($amf_line) - strlen($only_line)) / 4;
      echo str_repeat(' ', $depth), $only_line, "\n";
    }
    echo 'Name: ', $pet_load->getName();
  } else {
    echo 'Pet load not found';
  }
  echo "\n";
} else {
  echo "Usage: ${_SERVER['PHP_SELF']} ID\n";
}
