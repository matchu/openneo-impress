<?php
class PwnageCore_RouteManager {
  protected $routes = array();
  static $instance;
  
  public function connect($path, $options) {
    $this->routes[] = new PwnageCore_Route($path, $options);
  }
  
  public function resources($controller, $actions=array('index', 'show', 'new')) {
    foreach($actions as $action) {
      self::connect("$controller/$action", array(
        'controller' => $controller,
        'action' => $action
      ));
    }
  }
  
  public function find_by_name($name) {
    foreach($this->routes as $route) {
      if($route->name == $name) {
        return $route;
      }
    }
  }
  
  public function find_by_path($path) {
    foreach($this->routes as $route) {
      if($route->path_matches($path)) {
        return $route;
      }
    }
  }
  
  static function getInstance() {
    if(!self::$instance) {
      self::$instance = new self;
    }
    return self::$instance;
  }
}
?>
