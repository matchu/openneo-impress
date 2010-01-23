<?php
class Pwnage_BiologyAssetsController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $parent_id = $this->requireParam($this->get, 'parent_id');
    $this->setCacheLifetime(24*60);
    $this->setCacheId($parent_id);
    if(!$this->isCached()) {
      $assets_select = array('id', 'url', 'zone_id', 'depth', 'parent_id');
      $assets_select_str = 'swf_assets.id, swf_assets.url, swf_assets.zone_id, zones.depth, parents_swf_assets.parent_id';
      $pet_type->assets = Pwnage_BiologyAsset::getAssetsByParents(
        array($parent_id), array(
          'select' => $assets_select_str,
          'joins' => 'INNER JOIN zones ON zones.id = swf_assets.zone_id'
        )
      );
      $this->respondWithAndCache($pet_type->assets, $assets_select);
    }
  }
}
?>