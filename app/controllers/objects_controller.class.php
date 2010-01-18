<?php
class Pwnage_ObjectsController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $attributes = array(
      'id', 'name', 'thumbnail_url', 'description', 'type', 'rarity',
        'rarity_index', 'price', 'weight_lbs'
    );
    if(isset($this->get['ids'])) {
      $this->requireParamArray($this->get, 'ids');
      $ids = implode(', ', array_map('intval', $this->get['ids']));
      $where = 'id IN ('.$ids.')';
    } elseif(isset($this->get['search'])) {
      $search = $this->get['search'];
      if(strlen($search) < 3) {
        throw new Pwnage_BadRequestException(
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
      throw new Pwnage_BadRequestException('$id or $search required');
    }
    if($where) {
      $objects = Pwnage_Object::all(array(
        'select' => implode(', ', $attributes),
        'where' => $where
      ));
      $this->respondWith($objects, $attributes);
    }
  }
}
?>
