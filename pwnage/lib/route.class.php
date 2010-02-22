<?php
class PwnageCore_Route {
  protected $action;
  protected $controller;
  protected $params = array();
  protected $path;
  const paramRegex = '/{([a-z_]+)}/i';
  
  public function __construct($path, $options) {
    $this->path = $path;
    foreach($options as $key => $value) {
      $this->$key = $value;
    }
  }
  
  public function getAction() {
    return $this->action;
  }
  
  public function getController() {
    return $this->controller;
  }
  
  public function getParams() {
    return $this->params;
  }
  
  public function getPath() {
    $path = $this->path;
    foreach($this->params as $key => $value) {
      $path = str_replace('{'.$key.'}', $value, $path);
    }
    return $path;
  }
  
  protected function pathFragmentMatches($path, $start, $length) {
    return substr($this->path, $start, $length) == substr($path, $start, $length);
  }
  
  public function pathMatches($path) {
    if(strstr($this->path, '{')) {
      preg_match_all(self::paramRegex, $this->path, $param_names);
      $param_names = $param_names[1];
      $path_as_regex = '%^'.str_replace('%', '\%', preg_replace(self::paramRegex, '(.+)', $this->path)).'$%';
      if($path_matches = preg_match($path_as_regex, $path, $param_values)) {
        array_shift($param_values);
        $this->setParams(array_combine($param_names, $param_values));
      }
      return $path_matches;
    } else {
      return $this->path == $path;
    }
  }
  
  public function setParams($params) {
    foreach($params as $key => $value) {
      $this->params[$key] = $value;
    }
  }
}
?>
