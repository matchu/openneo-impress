<?php
class Pwnage_PetState extends Pwnage_SwfAssetParent {
  static $table = 'pet_states';
  static $columns = array('pet_type_id', 'swf_asset_ids');
  private $origin_pet;
  private $pet_type;
  
  protected function beforeSave() {
    $this->pet_type_id = $this->getPetType()->getId();
    $ids = array();
    $this->getSwfAssetIds();
  }
  
  public function getAssets() {
    if(!$this->preloaded_assets && !$this->assets) {
      $this->assets = Pwnage_BiologyAsset::all(
        array(
          'where' => 'parent_id = '.intval($this->getId())
        )
      );
    }
    return $this->assets;
  }
  
  public function getContributions() {
    $contributions = array();
    $pet_type =& $this->getPetType();
    if(!$pet_type->isSaved()) {
      $contributions[] = new Pwnage_Contribution($pet_type);
    }
    if(!$this->isSaved()) {
      $contributions[] = new Pwnage_Contribution($this);
    }
    return $contributions;
  }
  
  public function getExistingRow($select) {
    return self::first(array(
      'select' => $select,
      'where' => 'swf_asset_ids = "'.$this->getSwfAssetIds().'"'
    ));
  }
  
  public function getId() {
    if(!$this->id) {
      $row = $this->getExistingRow('id');
      $this->id = $row->id;
    }
    return $this->id;
  }
  
  protected function getOriginPet() {
    return $this->origin_pet;
  }
  
  public function getPetType() {
    if(!isset($this->pet_type)) {
      $this->pet_type = new Pwnage_PetType();
      $this->pet_type->setOriginPet($this->getOriginPet());
    }
    return $this->pet_type;
  }
  
  protected function getSwfAssetIds() {
    if(!$this->swf_asset_ids) {
      $assets = $this->getAssets();
      foreach($assets as $asset) {
        $ids[] = $asset->getId();
      }
      $this->swf_asset_ids = implode(',', $ids);
    }
    return $this->swf_asset_ids;
  }
  
  protected function isSaved() {
    return $this->getExistingRow('1') ? true : false;
  }
  
  public function needsToLoadAssets() {
    return !$this->preloaded_assets && empty($this->assets);
  }
  
  public function save() {
    $db = PwnageCore_Db::getInstance();
    $db->beginTransaction();
    try {
      $this->getPetType()->save();
      parent::save(self::$table, self::$columns);
    } catch(PDOException $e) {
      $db->rollBack();
      throw $e;
    }
    $db->commit();
  }
  
  public function setOriginPet($pet) {
    $this->origin_pet = $pet;
    $this->assets = array();
    foreach($pet->getBiology() as $asset_typed_obj) {
      $asset = new Pwnage_BiologyAsset($asset_typed_obj->getAMFData());
      $asset->setOriginPetState($this);
      $this->assets[] = $asset;
    }
  }
  
  static function all($options) {
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function first($options) {
    return parent::first($options, self::$table, __CLASS__);
  }
}
?>
