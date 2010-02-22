<?php
$map = PwnageCore_RouteManager::getInstance();

$map->connect('/', array(
  'controller' => 'outfits',
  'action' => 'start',
  'name' => 'root'
));

$map->connect('/wardrobe', array(
  'controller' => 'outfits',
  'action' => 'edit',
  'name' => 'edit_outfit'
));

$map->connect('/pets/load', array(
  'controller' => 'pets',
  'action' => 'load',
  'name' => 'load_pet'
));

$map->connect('/pet_types/needed', array(
  'controller' => 'pet_types',
  'action' => 'needed',
  'name' => 'needed_pet_types'
));

$map->connect('/objects/needed', array(
  'controller' => 'objects',
  'action' => 'needed',
  'name' => 'needed_objects'
));

$map->connect('/users/authorize', array(
  'controller' => 'users',
  'action' => 'authorize',
  'name' => 'authorize_user'
));

//FIXME: remove once integrated
$map->connect('/users/login', array(
  'controller' => 'users',
  'action' => 'login',
  'name' => 'login'
));
$map->connect('/users/current', array(
  'controller' => 'users',
  'action' => 'current',
  'name' => 'current_user'
));

$map->connect('/users/logout', array(
  'controller' => 'users',
  'action' => 'logout',
  'name' => 'logout'
));

$map->connect('/users/{user_id}/contributions', array(
  'controller' => 'contributions',
  'action' => 'index',
  'name' => 'user_contributions'
));

$map->resources('biology_assets', 'index');
$map->resources('object_assets', 'index');
$map->resources('objects', 'index');
$map->resources('pet_attributes', 'index');
$map->resources('pet_types', 'index');
?>
