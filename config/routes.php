<?php
$map = PwnageCore_RouteManager::getInstance();

$map->connect('/', array(
  'controller' => 'outfits',
  'action' => 'start',
  'name' => 'root'
));

$map->connect('/pets/load', array(
  'controller' => 'pets',
  'action' => 'load',
  'name' => 'load_pet'
));

$map->resources('pet_attributes', 'index');
$map->resources('pet_types', 'index');
?>
