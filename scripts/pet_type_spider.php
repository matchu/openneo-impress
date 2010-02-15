#!/usr/bin/php
<?php
define('BOSS_KEY', 'R3Aw2ebV34FB9JcxeExd9PoEeLhrre42guz8mEnQo9tTmVQgqrqBP1T36E6iuCzRQQ--');

require_once dirname(__FILE__).'/../pwnage/environment.php';
echo "Loading existing pet types...\n";
$pet_types = Pwnage_PetType::all(array(
  'select' => 'species_id, color_id'
));
$existing_pet_types = array();
foreach($pet_types as $pet_type) {
  $existing_pet_types[$pet_type->getSpeciesId()][$pet_type->getColorId()] = 1;
}
foreach(Pwnage_Species::all() as $species) {
  foreach(Pwnage_Color::all() as $color) {
    $species_id = $species->getId();
    $color_id = $color->getId();
    if(!isset($existing_pet_types[$species_id][$color_id])) {
      // TODO: handle royalboy, royalgirl, etc
      $pet_type_string = $color->getName().' '.$species->getName();
      echo "Searching for a $pet_type_string\n";
      $response = HttpRequest::getJson(
        'http://boss.yahooapis.com/ysearch/web/v1/'.
        urlencode("site:neopets.com inurl:petlookup.phtml \"$pet_type_string\"").
        '?appid='.BOSS_KEY
      );
      if($results = $response->ysearchresponse->resultset_web) {
        foreach($results as $result) {
          $parsed_url = parse_url($result->url);
          parse_str($parsed_url['query'], $query);
          $name = $query['pet'];
          unset($parsed_url, $query);
          $pet = new Pwnage_Pet();
          $pet->setName($name);
          echo "  $name was once a $pet_type_string, checking...\n";
          if($pet->exists()) {
            $pet->save();
            $pet_type = $pet->getPetType();
            if($pet_type->getSpeciesId() == $species_id && $pet_type->getColorId() == $color_id) {
              echo "    $name saved\n";
              break;
            } else {
              echo "    $name no longer a $pet_type_string\n"; 
            }
          } else {
            echo "    $name no longer exists\n";
          }
        }
      }
    }
  }
}
?>
