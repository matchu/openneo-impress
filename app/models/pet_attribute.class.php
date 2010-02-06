<?php
class Pwnage_PetAttribute {
  private $exists;
  private $id;
  private $name;
  
  public function __construct($id) {
    $this->id = $id;
  }
  
  private function determineName() {
    $all_names = $this->allNames();
    $this->name = $all_names[$this->getId()-1];
    if($this->name) {
      $this->exists = true;
    } else {
      $this->exists = false;
      $this->name = "#$this->id";
    }
  }
  
  public function exists() {
    if(!isset($this->exists)) $this->determineName();
    return $this->exists;
  }
  
  public function getId() {
    if(!$this->id) {
      $this->id = array_search($this->name, $this->allNames());
    }
    return $this->id;
  }
  
  public function getName() {
    if(!$this->name) {
      $this->determineName();
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
