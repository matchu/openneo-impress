<?php
require_once 'smarty/Smarty.class.php';

class PwnageCore_Controller {
  private $cache_id;
  private $controller_name;
  protected $get = array();
  private $has_rendered_or_redirected = false;
  protected $post = array();
  private $smarty;
  private $view_data = array();
  
  protected function __construct($controller_name) {
    foreach(array('get' => $_GET, 'post' => $_POST) as $var_name => $data) {
      $this->$var_name = $data;
      if(get_magic_quotes_gpc()) {
        array_walk_recursive($this->$instance_var, 'stripslashes');
      }
    }
    $this->controller_name = $controller_name;
    $this->smarty = new Smarty;
    $this->smarty->caching = 1;
    $this->smarty->compile_check = (PWNAGE_ENVIRONMENT == 'development');
    $this->smarty->template_dir = PWNAGE_ROOT.'/app/views/';
    $this->smarty->compile_dir = PWNAGE_ROOT.'/smarty/compiled/';
    $this->smarty->cache_dir = PWNAGE_ROOT.'/smarty/cache/';
    $this->smarty->config_dir = PWNAGE_ROOT.'/smarty/configs/';
    $this->smarty->plugins_dir[] = PWNAGE_ROOT.'/smarty/plugins/';
  }
  
  private function clearFlash() {
    unset($_SESSION['flash']);
  }
  
  public function doAction($action_name) {
    $this->$action_name();
    if(!$this->has_rendered_or_redirected) {
      $this->render($this->getTemplate($action_name));
    }
  }
  
  protected function getCacheId() {
    return $this->cache_id;
  }
  
  private function getTemplate($action_name) {
    return "$this->controller_name/$action_name";
  }
  
  protected function isCached($action_name) {
    return $this->smarty->is_cached($this->getTemplate($action_name).'.tpl');
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
  
  protected function render($view) {
    $this->prepareToRenderOrRedirect();
    $this->smarty->assign('flash', $_SESSION['flash']);
    $this->smarty->display($view.'.tpl', $this->getCacheId());
    $this->clearFlash();
  }
  
  protected function set($key, $value) {
    $this->smarty->assign($key, $value);
  }
  
  protected function setCacheId($id) {
    $this->cache_id = $id;
  }
  
  protected function setFlash($template, $type='notice') {
    $split_path = explode('/', $template);
    $base = array_pop($split_path);
    $split_path[] = 'flashes';
    $split_path[] = $base;
    $template = implode('/', $split_path);
    $_SESSION['flash'][$type][] = $template;
  }
  
  static function getByName($controller_name) {
    $controller_class = "Pwnage_${controller_name}Controller";
    return new $controller_class($controller_name);
  }
}

class Pwnage_TooManyRendersException extends Exception {
  public function __construct() {
    parent::__construct('Too many renders or redirects in one action');
  }
}
?>
