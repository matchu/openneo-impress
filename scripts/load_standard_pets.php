#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';

function saveIfExists($pet_name) {
  global $pets;
  $pet = new Pwnage_Pet();
  $pet->name = $pet_name;
  if($pet->exists()) {
    echo "Found $pet_name, saving data\n";
    $pet->saveData();
    $pets[] = $pet;
  }
}

$all_species = Pwnage_Species::all();
$standard_colors = array('blue', 'green', 'red', 'yellow');
$pets = array();
foreach($all_species as $species) {
  $species_name = $species->getName();
  saveIfExists($species_name);
  foreach($standard_colors as $color_name) {
    saveIfExists($color_name.$species_name);
    saveIfExists($species_name.$color_name);
  }
}
echo "Saving ".count($pets)." pets...\n";
Pwnage_Pet::saveCollection($pets);
echo "Saved.\n";
?>
