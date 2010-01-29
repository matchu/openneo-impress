<?php
require_once 'smarty/Smarty.class.php';

class PwnageCore_Controller {
  private $before_filters;
  private $cache_id;
  private $cache_lifetime = 0;
  private $current_action;
  private $name;
  protected $format;
  private $formats = array('html');
  protected $get = array();
  private $has_rendered_or_redirected = false;
  protected $post = array();
  private $resource_cache;
  private $smarty;
  private $view_data = array();
  
  protected function __construct() {
    foreach(array('get' => $_GET, 'post' => $_POST) as $var_name => $data) {
      $this->$var_name = $data;
      if(get_magic_quotes_gpc()) {
        array_walk_recursive($this->$instance_var, 'stripslashes');
      }
    }
  }
  
  protected function addBeforeFilter($actions, $callback) {
    foreach($actions as $action) {
      $this->before_filters[$action][] = $callback;
    }
  }
  
  private function clearFlash() {
    unset($_SESSION['flash']);
  }
  
  public function doAction($action_name) {
    try {
      if(isset($this->before_filters[$action_name])) {
        foreach($this->before_filters[$action_name] as $before_filter) {
          $this->$before_filter();
          if($this->has_rendered_or_redirected) break;
        }
      }
      if(!$this->has_rendered_or_redirected) {
        $this->current_action = $action_name;
        $this->$action_name();
        unset($this->current_action);
      }
    } catch(Pwnage_BadRequestException $e) {
      header('HTTP/1.0 400 Bad Request');
      die(htmlentities($e->getMessage()));
    } catch(Exception $e) {
      header('HTTP/1.0 500 Internal Server Error');
      if(PWNAGE_ENVIRONMENT == 'development') {
        die('<h1>'.htmlentities($e->getMessage()).'</h1>'.nl2br($e->getTraceAsString()));
      } else {
        die('500 Internal Server Error');
      }
    }
    if(!$this->has_rendered_or_redirected) {
      $this->render($this->getTemplate($action_name));
    }
  }
  
  protected function getCacheId() {
    return $this->cache_id;
  }
  
  private function getResourceCache() {
    if(!isset($this->resource_cache)) {
      $path = $this->name.'/'.$this->current_action.'.'.$this->format;
      $this->resource_cache = new PwnageCore_ResourceCache($path);
    }
    return $this->resource_cache;
  }
  
  private function getSmarty() {
    if(!isset($this->smarty)) {
      $this->smarty = new Smarty;
      $this->smarty->compile_check = (PWNAGE_ENVIRONMENT == 'development');
      $this->smarty->template_dir = PWNAGE_ROOT.'/app/views/';
      $this->smarty->compile_dir = PWNAGE_ROOT.'/smarty/compiled/';
      $this->smarty->cache_dir = PWNAGE_ROOT.'/smarty/cache/';
      $this->smarty->config_dir = PWNAGE_ROOT.'/smarty/configs/';
      $this->smarty->plugins_dir[] = PWNAGE_ROOT.'/smarty/plugins/';
    }
    return $this->smarty;
  }
  
  private function getTemplate($action_name) {
    return "$this->name/$action_name";
  }
  
  protected function isCached() {
    if($this->isResource()) {
      return $this->getResourceCache()->isSaved();
    } else {
      return $this->getSmarty()->is_cached($this->getTemplate($this->current_action).'.tpl');
    }
  }
  
  private function isResource() {
    return $this->format == 'json';
  }
  
  protected function routeTo($route_name) {
    return PwnageCore_RouteManager::getInstance()->
      find_by_name($route_name)->getPath();
  }
  
  private function prepareToRenderOrRedirect() {
    if($this->has_rendered_or_redirected) {
      throw new Pwnage_TooManyRendersException();
    } else {
      $this->has_rendered_or_redirected = true;
    }
  }
  
  protected function redirect($destination) {
    $this->prepareToRenderOrRedirect();
    header("Location: $destination");
  }
  
  protected function redirectToRoute($route_name) {
    $this->redirect($this->routeTo($route_name));
  }
  
  protected function render($view) {
    $this->prepareToRenderOrRedirect();
    if($this->isResource() && $this->isCached()) {
      header('Content-type: application/json');
      $cache = $this->getResourceCache();
      $cache->output();
    } else {
      if(isset($_SESSION['flash'])) {
        $this->getSmarty()->assign('flash', $_SESSION['flash']);
      }
      if($this->getCacheId()) {
        $this->getSmarty()->display($view.'.tpl', $this->getCacheId());
      } else {
        $this->getSmarty()->display($view.'.tpl');
      }
      $this->clearFlash();
    }
  }
  
  protected function respondTo() {
    $formats = func_get_args();
    $this->formats = $formats;
  }
  
  protected function respondWith($objects, $attributes=null) {
    if($this->format != 'json') throw new Pwnage_InvalidFormatException($this->format);
    if($attributes) {
      $objects = PwnageCore_ObjectHelper::sanitize($objects, &$attributes);
    }
    $this->prepareToRenderOrRedirect();
    header('Content-type: application/json');
    echo json_encode($objects);
  }
  
  protected function respondWithAndCache($objects, $attributes=null) {
    ob_start();
    $this->respondWith($objects, $attributes);
    $output = ob_get_flush();
    $cache = $this->getResourceCache();
    $cache->save($output);
  }
  
  protected function requireParam($collection, $name_or_names) {
    if(is_array($name_or_names)) {
      foreach($name_or_names as $name) {
        $this->requireParam(&$collection, $name);
      }
    } else {
      if(!isset($collection[$name_or_names])) {
        throw new Pwnage_BadRequestException("\$$name_or_names required");
      }
      return $collection[$name_or_names];
    }
  }
  
  protected function requireParamArray($collection, $name) {
    $this->requireParam($collection, $name);
    if(!is_array($collection[$name])) {
      throw new Pwnage_BadRequestException("\$$name must be array");
    }
    return $collection[$name];
  }
  
  protected function set($key, $value) {
    $this->getSmarty()->assign($key, $value);
  }
  
  protected function setCacheId($id) {
    $this->cache_id = $id;
    $this->getSmarty()->caching = 1;
    if($this->isResource()) {
      $this->getResourceCache()->setId($this->getCacheId());
    }
  }
  
  protected function setCacheIdWithParams($params, $desired_keys) {
    $this->setCacheId(
      http_build_query(
        PwnageCore_ObjectHelper::sanitize($params, $desired_keys,
          PwnageCore_ObjectHelper::SanitizeAssoc)
      )
    );
  }
  
  protected function setCacheLifetime($minutes) {
    $seconds = $minutes*60;
    $this->cache_lifetime = $seconds;
    if($this->isResource()) {
      $this->getResourceCache()->setLifetime($seconds);
    } else {
      $this->getSmarty()->lifetime = $seconds;
    }
  }
  
  protected function setName($name) {
    $this->name = $name;
  }
  
  protected function setFlash($template, $type='notice') {
    $split_path = explode('/', $template);
    $base = array_pop($split_path);
    $split_path[] = 'flashes';
    $split_path[] = $base;
    $template = implode('/', $split_path);
    $_SESSION['flash'][$type][] = $template;
  }
  
  public function setFormat($format) {
    $this->format = $format;
  }
  
  static function getByName($name) {
    $camel_name = PwnageCore_StringHelper::toCamelCase($name, PwnageCore_StringHelper::CapitalizeFirst);
    $controller_class = "Pwnage_${camel_name}Controller";
    $controller = new $controller_class;
    $controller->setName($name);
    return $controller;
  }
}

class Pwnage_InvalidFormatException extends Exception {
  public function __construct($format) {
    // WARNING: format unescaped! Escape the error yourself before printing!
    parent::__construct("The $format format is not available for this action");
  }
}

class Pwnage_TooManyRendersException extends Exception {
  public function __construct() {
    parent::__construct('Too many renders or redirects in one action');
  }
}

class Pwnage_BadRequestException extends Exception {}
?>
