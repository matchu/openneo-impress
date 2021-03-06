<?php
class Pwnage_BiologyAssetsController extends Pwnage_ApplicationController {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $parent_id = $this->requireParam($this->get, 'parent_id');
    $this->setCacheLifetime(24*60);
    $this->setCacheId($parent_id);
    if(!$this->isCached()) {
      $assets_select = array('id', 'zone_id', 'zones_restrict', 'depth',
        'parent_id', 'local_path');
      $assets_select_str = 'swf_assets.id, swf_assets.zone_id, '.
        'swf_assets.zones_restrict, zones.depth, parents_swf_assets.parent_id, '.
        'swf_assets.url';
      $assets = Pwnage_BiologyAsset::getAssetsByParents(
        array($parent_id), array(
          'select' => $assets_select_str,
          'joins' => 'INNER JOIN zones ON zones.id = swf_assets.zone_id'
        )
      );
      Pwnage_BiologyAsset::setLocalPathForCollection($assets);
      $integer_keys = array('id', 'zone_id', 'depth', 'parent_id');
      foreach($assets as &$asset) {
        foreach($integer_keys as $integer_key) {
          $asset->$integer_key = (int) $asset->$integer_key;
        }
      }
      $this->respondWithAndCache($assets, $assets_select);
    }
  }
}
?>
