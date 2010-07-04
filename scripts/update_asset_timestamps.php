#!/usr/bin/php
<?php
define('BASE', dirname(__FILE__).'/../');
define('ASSETS_PATH', BASE.'www/assets/');
define('ASSETS_PATH_LENGTH', strlen(ASSETS_PATH));
define('CACHE_PATH', ASSETS_PATH.'timestamped/');
define('INDEX_LOCATION', BASE.'tmp/asset_timestamps.php');
$static_dirs = array('css', 'images', 'js');

$timestamps = array();

class RecursiveDirectoryIteratorIterator extends RecursiveIteratorIterator {
  public function __construct($path) {
    parent::__construct(new RecursiveDirectoryIterator($path));
  }
}

class EmptiableDirectoryIterator extends DirectoryIterator {
  protected $path;
  
  public function __construct($path) {
    if(substr($path, -1) != '/') $path .= '/';
    $this->path = $path;
    parent::__construct($path);
  }
  
  public function removeContents() {
    foreach($this as $file) {
      if(substr($file->getBasename(), 0, 1) != '.') {
        if($file->isDir()) {
          $dir = new EmptiableDirectoryIterator($this->path.$file);
          $dir->remove();
        } else {
          unlink($this->path.$file);
        }
      }
    }
  }
  
  protected function remove() {
    $this->removeContents();
    rmdir($this->path);
  }
}

// Delete old files
$dir = new EmptiableDirectoryIterator(CACHE_PATH);
$dir->removeContents();

// Add new files
foreach($static_dirs as $static_dir) {
  $static_iterator = new RecursiveDirectoryIteratorIterator(ASSETS_PATH.$static_dir);

  foreach($static_iterator as $file) {
    if($file->isFile()) {
      $path_from_assets = substr($file, ASSETS_PATH_LENGTH);
      $steps_from_assets = explode('/', $path_from_assets);
      foreach($steps_from_assets as $step) {
        if(substr($step, 0, 1) == '.') {
          continue 2;
        }
      }
      $timestamp = '-v'.$file->getMTime();
      $cache_path_pieces = $steps_from_assets;
      $cache_basename = &$cache_path_pieces[count($cache_path_pieces)-1];
      $p = strrpos($cache_basename, '.');
      // 'index' . '-v123456789' . '.js'
      $cache_basename = substr($cache_basename, 0, $p).$timestamp.substr($cache_basename, $p);
      $path_from_cache = implode('/', $cache_path_pieces);
      $cache_path = CACHE_PATH.$path_from_cache;
      $cache_dir = dirname($cache_path);
      if(!file_exists($cache_dir)) {
        mkdir($cache_dir, 0777, true);
      }
      copy($file, $cache_path);
      $timestamps[$path_from_assets] = $path_from_cache;
    }
  }
}

file_put_contents(INDEX_LOCATION, '<?php return '.var_export($timestamps, true).';');
echo "Copied timestamped files, wrote asset timestamps\n";
