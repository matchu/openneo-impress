<?php
class Pwnage_PetTypesController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }

  public function index() {
    $params = array('for', 'color_id', 'species_id');
    $this->requireParam($this->get, $params);
    $this->setCacheLifetime(24*60);
    $this->setCacheIdWithParams($this->get, $params);
    if(!$this->isCached()) {
      $for = $this->get['for'];
      if($for == 'image') {
        $select = 'image_hash';
        $attributes = array('image_hash');
      } elseif($for == 'wardrobe') {
        $select = 'id, body_id';
        $attributes = array('id', 'body_id', 'assets');
      } else {
        throw new Pwnage_BadRequestException("Value '$for' not expected for \$for");
      }
      $pet_types = Pwnage_PetType::all(array(
        'select' => $select,
        'where' => 'species_id = '.intval($this->get['species_id']).' AND '
          .'color_id = '.intval($this->get['color_id']),
        'limit' => 1
      ));
      if(count($pet_types)) {
        $pet_type = $pet_types[0];
        if($for == 'wardrobe') {
          $assets_select = array('id', 'url', 'zone_id', 'depth', 'parent_id');
          $assets_select_str = 'swf_assets.id, swf_assets.url, swf_assets.zone_id, z.depth, parents_swf_assets.parent_id';
          $pet_type->assets = Pwnage_BiologyAsset::getAssetsByParents(
            array($pet_type->id), array(
              'select' => $assets_select_str,
              'joins' => 'INNER JOIN zones z ON z.id = swf_assets.zone_id'
            )
          );
          $pet_type->assets = PwnageCore_ObjectHelper::sanitize(
            $pet_type->assets, $assets_select);
        }
        $this->respondWithAndCache($pet_type, $attributes);
      } else {
        $this->respondWith(null);
      }
    }
  }
}
?>
