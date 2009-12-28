<?php
class Wearables_PetType {
  private function getAssetIds() {
    $asset_ids = array();
    foreach($this->assets as $asset) {
      $asset_ids[] = $asset->id;
    }
    return $asset_ids;
  }
  
  public function save($db) {
    $db->query('REPLACE INTO pet_types (color_id, species_id, asset_ids) '
    .'VALUES ('
    .intval($this->color_id).', '
    .intval($this->species_id).', '
    .$db->quote(implode(',', $this->getAssetIds()))
    .')');
  }
}
?>
