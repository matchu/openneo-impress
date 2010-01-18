<?php
class PwnageCore_ResourceCache {
  const PWNAGE_RELATIVE_CACHE_ROOT = '/tmp/resource_cache';
  private $cache_path;
  
  public function __construct($cache_path) {
    $this->cache_path = $cache_path;
  }
  
  private function fullCachePath() {
    return PWNAGE_ROOT.self::PWNAGE_RELATIVE_CACHE_ROOT.'/'.$this->cache_path;
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
}
?>
