<?php
class Pwnage_BiologyAsset extends Pwnage_SwfAsset {
  public $type = 'biology';
  
  public function __construct($data=null) {
    if($data) {
      $this->id = $data->part_id;
      $this->zones_restrict = $data->zones_restrict;
    }
    parent::__construct($data);
  }
  
  public function beforeSave() {
    $this->parent_id = $this->parent->getId();
  }
  
  public function setOriginPetState($pet_state) {
    $this->parent = &$pet_state;
    $this->setOriginPetType($pet_state->getPetType());
  }
  
  static function all($options) {
    $options['where'] = self::mergeConditions($options['where'],
      self::$table.'.type = "biology"'
    );
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function getAssetsByParents($parent_ids, $options) {
    return parent::getAssetsByParents('biology', $parent_ids, $options);
  }
}
?>
