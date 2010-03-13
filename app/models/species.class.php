<?php
require_once PWNAGE_ROOT.'/pwnage/lib/spyc.php';

class Pwnage_Species extends Pwnage_PetAttribute {
  const POSSIBLE_COLOR_CACHE_ROOT = 'tmp/possible_colors';
  protected $type = 'species';
  static $all;
  
  public function getPossibleColors() {
    $cache_root = PWNAGE_ROOT.'/'.self::POSSIBLE_COLOR_CACHE_ROOT;
    $species_file = $cache_root.'/'.$this->getId().'.txt';
    if(!file_exists($species_file)) {
      $colors = Pwnage_Color::all();
      $color_ids_by_name = array();
      foreach($colors as $color) {
        $color_ids_by_name[$color->getName()] = (int) $color->getId();
      }
      $all_color_ids = array_values($color_ids_by_name);
      $exclusive_color_names_by_species =
        Spyc::YAMLLoad(PWNAGE_ROOT.'/config/exclusive_colors.yml');
      $exclusive_color_ids_by_species = array();
      $exclusive_color_ids = array();
      foreach($exclusive_color_names_by_species as $species_name => $color_names) {
        $color_ids = array();
        foreach($color_names as $color_name) {
          $color_ids[] = $exclusive_color_ids[] =
            $color_ids_by_name[$color_name];
        }
        $exclusive_color_ids_by_species[$species_name] = $color_ids;
      }
      foreach(self::all() as $species) {
        $species_id = $species->getId();
        $species_name = $species->getName();
        $color_ids = $all_color_ids;
        foreach($exclusive_color_ids as $color_id) {
          $i = array_search($color_id, $color_ids);
          if($i !== false) {
            if(!isset($exclusive_color_ids_by_species[$species_name]) || !in_array($color_id, $exclusive_color_ids_by_species[$species_name])) {
              unset($color_ids[$i]);
            }
          }
        }
        /*
          Though JSON produces a few more bytes, quick benchmarking shows that,
          for integer-only arrays like this one, json_encode to be twice as fast
          as making comma strings with implode(), and json_decode seems to be - 
          no joke - 200 times faster than explode(). The choice is clear.
        */
        file_put_contents($cache_root.'/'.$species_id.'.txt', json_encode(array_values($color_ids)));
      }
    }
    $ids = (array) json_decode(file_get_contents($cache_root.'/'.$this->getId().'.txt'));
    return Pwnage_Color::all(array('ids' => $ids));
  }
  
  static function all() {
    if(!isset(self::$all)) {
      self::$all = array();
      $all_names = self::allNamesByType('species');
      foreach($all_names as $i => $name) {
        $color = new Pwnage_Species($i + 1);
        $color->name = $name;
        self::$all[] = $color;
      }
    }
    return self::$all;
  }
}
?>
