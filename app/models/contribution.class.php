<?php
class Pwnage_Contribution extends PwnageCore_DbObject {
  protected $contributed_class;
  protected $contributed_id;
  protected $contributed_obj;
  protected $user;
  protected $user_id;
  
  static $table = 'contributions';
  static $columns = array('contributed_class', 'contributed_id', 'user_id');
  static $point_values_by_contributed_class = array(
    'Pwnage_Object' => 5,
    'Pwnage_PetType' => 15,
    'Pwnage_PetState' => 5
  );
  
  protected function beforeSave() {
    $this->contributed_id = $this->getContributedId();
  }
  
  public function __construct(&$contributed_obj) {
    $this->contributed_obj = $contributed_obj;
  }
  
  public function awardPointsToUser() {
    $this->user->awardPoints($this->getPointValue());
  }
  
  public function getContributedClass() {
    if(!isset($this->contributed_class)) {
      $this->contributed_class = get_class($this->contributed_obj);
    }
    return $this->contributed_class;
  }
  
  public function getContributedId() {
    return $this->contributed_obj->getId();
  }
  
  protected function getPointValue() {
    return self::$point_values_by_contributed_class[$this->getContributedClass()];
  }
  
  public function save() {
    return parent::save(self::$table, self::$columns);
  }
  
  public function setUser($user) {
    $this->user =& $user;
    $this->user_id = $user->getId();
  }
  
  static function getContributionsFromCollection($objects, $class) {
    $objects = call_user_func_array(array($class, 'rejectExistingInCollection'), array($objects));
    $contributions = array();
    foreach($objects as $object) {
      $contributions[] = new Pwnage_Contribution($object);
    }
    return $contributions;
  }
  
  static function getPointsFromContributionSet($contribution_set) {
    $points = 0;
    foreach($contribution_set as $contributed_class => $count) {
      $value = self::$point_values_by_contributed_class[$contributed_class] * $count;
      echo "+ $value points for $contributed_class\n";
      $points += $value;
    }
    return $points;
  }
}
?>
