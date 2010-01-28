<?php
class Pwnage_ObjectAssetsController extends PwnageCore_Controller {
  protected function __construct() {
    $this->respondTo('json');
    parent::__construct();
  }
  
  public function index() {
    $this->requireParam($this->get, 'body_id');
    $this->requireParamArray($this->get, 'parent_ids');
    $attributes = array('id', 'zone_id', 'depth', 'parent_id', 'is_body_specific', 'local_path');
    $assets = Pwnage_ObjectAsset::getAssetsByParents(
      $this->get['parent_ids'], array(
        'select' => 'swf_assets.id, url, zone_id, depth, parents_swf_assets.parent_id, z.type_id < 3 as is_body_specific',
        'joins' => 'INNER JOIN zones z ON z.id = swf_assets.zone_id',
        'where' => '(body_id = '.intval($this->get['body_id']).' OR body_id = 0)'
      )
    );
    Pwnage_ObjectAsset::setLocalPathForCollection(&$assets);
    $this->respondWith($assets, $attributes);
  }
}
?>
