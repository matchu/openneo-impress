<?php
class Pwnage_ObjectsController extends Pwnage_ApplicationController {
  public function index() {
    $this->respondTo('json');
    $attributes = array(
      'id', 'name', 'thumbnail_url', 'description', 'type', 'rarity',
        'rarity_index', 'price', 'weight_lbs', 'zones_restrict'
    );
    if(isset($this->get['ids'])) {
      $this->requireParamArray($this->get, 'ids');
      $ids = implode(', ', array_map('intval', $this->get['ids']));
      $where = 'id IN ('.$ids.')';
    } elseif(isset($this->get['search'])) {
      $search = $this->get['search'];
      if(strlen($search) < 3) {
        throw new PwnageCore_BadRequestException(
          'Search queries must be longer than 3 characters, silly!'
        );
      }
      $db = PwnageCore_Db::getInstance();
      if(preg_match('/^"(.+)"$/', $search, $matches)) {
        $search = $matches[1];
        $where = 'name = '.$db->quote($search);
      } else {
        $like = '%'.str_replace('%', '\%', $search).'%';
        $where = 'name LIKE '.$db->quote($like);
      }
    } else {
      throw new PwnageCore_BadRequestException('$id or $search required');
    }
    if($where) {
      $objects = Pwnage_Object::all(array(
        'select' => implode(', ', $attributes),
        'where' => $where,
        'order_by' => 'name ASC'
      ));
      $this->respondWith($objects, $attributes);
    }
  }
  
  public function needed() {
    if(isset($this->get['species']) && isset($this->get['color'])) {
      $pet_type = Pwnage_PetType::findBySpeciesIdAndColorId(
        $this->get['species'],
        $this->get['color'],
        array(
          'select' => 'species_id, color_id, body_id'
        )
      );
      if($pet_type) {
        $objects = $pet_type->getNeededObjects(array(
          'select' => 'id, name, thumbnail_url',
          'order_by' => 'name ASC'
        ));
        $this->set(array(
          'color_name' => $pet_type->getColor()->getName(),
          'objects' => $objects,
          'species_name' => $pet_type->getSpecies()->getName()
        ));
      }
    }
    $this->set('pet_name', $this->get['name']);
  }
}
?>
