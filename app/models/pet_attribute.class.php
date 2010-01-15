<?php
class Wearables_PetAttribute {
  public function __construct($id) {
    $this->id = $id;
  }
  
  public function getId() {
    if(!$this->id) {
      $this->id = array_search($this->name, $this->allNames());
    }
    return $this->id;
  }
  
  public function getName() {
    if(!$this->name) {
      $all_names = $this->allNames();
      $this->name = $all_names[$this->getId()-1];
      if(!$this->name) $this->name = "#$this->id";
    }
    return $this->name;
  }
  
  private function allNames() {
    return self::allNamesByType($this->type);
  }
  
  static function allNamesByType($type) {
    // FIXME: move attribute names elsewhere!
    return array_filter(
      explode("\n",
        file_get_contents(PWNAGE_ROOT.'/app/models/'.$type.'_names.txt')
      )
    );
  }
}
?>
