<?php
class PwnageCore_ResourceCache {
  const PWNAGE_RELATIVE_CACHE_ROOT = '/tmp/resource_cache';
  private $path;
  private $id;
  
  public function __construct($path) {
    $this->path = $path;
  }
  
  private function fullCachePath() {
    $cache_root = PWNAGE_ROOT.self::PWNAGE_RELATIVE_CACHE_ROOT;
    if($this->id) {
      $split_path = explode('.', $this->path);
      $extension = array_pop($split_path);
      $path_with_id = implode('.', $split_path).'-'.$this->id.'.'.$extension;
    } else {
      $path_with_id = $this->path;
    }
    return $cache_root.'/'.$path_with_id;
  }
  
  public function isSaved() {
    return file_exists($this->fullCachePath());
  }
  
  public function output() {
    echo file_get_contents($this->fullCachePath());
  }
  
  public function save($content) {
    $dir = dirname($this->fullCachePath());
    if(!file_exists($dir) || !is_dir($dir)) {
      mkdir($dir, 0777, true);
    }
    file_put_contents($this->fullCachePath(), $content);
  }
  
  public function setId($id) {
    $this->id = $id;
  }
}
?>
