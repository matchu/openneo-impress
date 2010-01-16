<?php
class PwnageCore_Route {
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
  
  public function getPath() {
    return $this->path;
  }
  
  public function path_matches($path) {
    // TODO: support vars
    return $this->path == $path;
  }
}
?>
