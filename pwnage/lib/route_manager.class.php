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
  
  public function resources($controller, $actions) {
    $actions = self::toArray($actions);
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
  
  private function toArray($str_or_array) {
    return is_string($str_or_array) ? array($str_or_array) : $str_or_array;
  }
}
?>
