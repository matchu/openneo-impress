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
    'Pwnage_Object' => 3,
    'Pwnage_ObjectAsset' => 2,
    'Pwnage_PetType' => 15,
    'Pwnage_PetState' => 10
  );
  static $contributed_class_relationships = array(
    'Pwnage_Object' => 'Pwnage_ObjectAsset',
    'Pwnage_PetType' => 'Pwnage_PetState'
  );
  
  protected function beforeSave() {
    $this->contributed_id = $this->getContributedId();
  }
  
  public function __construct($contributed_obj=null) {
    if($contributed_obj) $this->contributed_obj = $contributed_obj;
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
    if(!isset($this->contributed_id)) {
      $this->contributed_id = $this->contributed_obj->getId();
    }
    return $this->contributed_id;
  }
  
  public function getContributedObj() {
    return $this->contributed_obj;
  }
  
  public function getPointValue() {
    return self::$point_values_by_contributed_class[$this->getContributedClass()];
  }
  
  public function getUser() {
    return $this->user;
  }
  
  public function save() {
    return parent::save(self::$table, self::$columns);
  }
  
  public function setUser($user) {
    $this->user =& $user;
    $this->user_id = $user->getId();
  }
  
  static function all($options=array()) {
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function preloadContributedAndParents(&$contributions, $select_by_class) {
    if(empty($contributions)) return false;
    $needed_ids_by_class = array();
    $contributions_by_contributed_class_and_id = array();
    foreach($contributions as &$contribution) {
      $needed_ids_by_class[$contribution->getContributedClass()][] =
        intval($contribution->getContributedId());
      $contributions_by_contributed_class_and_id
        [$contribution->getContributedClass()]
        [$contribution->getContributedId()] =& $contribution;
    }
    foreach(self::$contributed_class_relationships as $parent_class => $child_class) {
      if(!empty($needed_ids_by_class[$child_class])) {
        // load children first, so we can know parent IDs needed
        $children = call_user_func(array($child_class, 'find'), $needed_ids_by_class[$child_class], array(
          'select' => $select_by_class[$child_class]
        ));
        // assign children to contributions
        foreach($children as &$child) {
          $contributions_by_contributed_class_and_id[$child_class]
            [$child->getId()]->contributed_obj =& $child;
        }
      }
      if(!empty($needed_ids_by_class[$parent_class]) || !empty($children)) {
        // load parents (pass child array to polymorphic method)
        $ids = isset($needed_ids_by_class[$parent_class]) ?
          $needed_ids_by_class[$parent_class] : array();
        $parents = call_user_func(array($parent_class, 'allByIdsOrChildren'),
          $ids, $children, array(
            'select' => $select_by_class[$parent_class]
          ));
        unset($children);
        // assign parents to contributions
        foreach($parents as &$parent) {
          $contributions_by_contributed_class_and_id[$parent_class]
            [$parent->getId()]->contributed_obj =& $parent;
        }
      }
    }
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
  
  static function paginate($options) {
    return parent::paginate($options, self::$table, __CLASS__);
  }
  
  static function preloadUsers(&$contributions) {
    $contributions_by_user_id = array();
    foreach($contributions as &$contribution) {
      $contributions_by_user_id[$contribution->user_id][] =& $contribution;
    }
    $users = Pwnage_User::find(array_keys($contributions_by_user_id));
    foreach($users as $user) {
      foreach($contributions_by_user_id[$user->getId()] as &$contribution) {
        $contribution->setUser($user);
      }
    }
  }
  
  static function saveCollection($contributions) {
    return parent::saveCollection($contributions, self::$table, self::$columns);
  }
}
?>
