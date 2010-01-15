<?php
class Wearables_SwfAssetParent extends Pwnage_DbObject {
  public $assets = array();
  
  static function preloadAssetsForCollection($pet_type, $objects) {
    $parents = $objects;
    $parents[] = $pet_type;
    $parents_by_type_and_id = array();
    $parents_needing_assets = 0;
    foreach($parents as &$parent) {
      if($parent->needsToLoadAssets()) {
        $parents_by_type_and_id[$parent->asset_type][$parent->id] = &$parent;
        $parents_needing_assets++;
      }
    }
    if($parents_needing_assets > 0) {
      $where = array();
      foreach($parents_by_type_and_id as $type => $parents_by_id) {
        $where[] = '(type = "'.$type.'" AND parent_id IN ('.implode(', ', array_keys($parents_by_id)).'))';
      }
      $where = '('.implode(' OR ', $where).') AND (body_id = '.intval($pet_type->getBodyId()).' OR body_id = 0)';
      $assets = Wearables_SwfAsset::all(
        array(
          'select' => 'zone_id, url, type, parent_id',
          'where' => $where
        )
      );
      foreach($assets as &$asset) {
        $parents_by_type_and_id[$asset->type][$asset->parent_id]->assets[] = &$asset;
      }
      foreach($parents as $parent) {
        $parent->preloaded_assets = true;
      }
    }
  }
}
?>
