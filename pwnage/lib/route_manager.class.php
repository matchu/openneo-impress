<?php
class PwnageCore_RouteManager {
  protected $routes = array();
  static $instance;
  static $resource_route_names = array(
    'index' => '%s'
  );
  
  public function connect($path, $options) {
    $this->routes[] = new PwnageCore_Route($path, $options);
  }
  
  public function resources($controller, $actions=array()) {
    $actions = self::toArray($actions);
    if(empty($actions)) $actions = array_keys($resource_route_names);
    foreach($actions as $action) {
      $path = "/$controller";
      if($action != 'index') $path .= "/$action";
      self::connect($path, array(
        'controller' => $controller,
        'action' => $action,
        'name' => sprintf(self::$resource_route_names[$action], $controller)
      ));
    }
  }
  
  public function findByName($name) {
    foreach($this->routes as $route) {
      if($route->name == $name) {
        return $route;
      }
    }
    throw new PwnageCore_RouteNotFoundError($name);
  }
  
  public function findByPath($path) {
    foreach($this->routes as $route) {
      if($route->pathMatches($path)) {
        return $route;
      }
    }
  }
  
  public function findByResource($object, $to=null) {
    $class_fragments = explode('_', get_class($object));
    array_shift($class_fragments);
    $object_type = PwnageCore_StringHelper::fromCamelCase(
      implode('_', $class_fragments)
    );
    $route_name = $object_type;
    if($to) $route_name .= "_$to";
    $route = $this->findByName($route_name);
    $route->setParams(array(
      $object_type.'_id' => $object->toParam()
    ));
    return $route;
  }
  
  static function getInstance() {
    if(!self::$instance) {
      self::$instance = new self;
    }
    return self::$instance;
  }
  
  private function toArray($str_or_array) {
    return is_string($str_or_array) ? array($str_or_array) : $str_or_array;
  }
}

class PwnageCore_RouteNotFoundError extends Exception {
  private $route_name;
  
  public function __construct($route_name) {
    $this->route_name = $route_name;
    parent::__construct("Could not find route with name $route_name");
  }
  
  public function getRouteName() {
    return $this->route_name;
  }
}
?>
