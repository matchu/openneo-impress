#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';

define('SCRIPT_ROOT', PWNAGE_ROOT.'/app/js');
define('PUBLIC_SCRIPT_ROOT', PWNAGE_ROOT.'/www/assets/js');

class Pwnage_ClosureRequest {
  private $input;
  
  public function __construct($file) {
    $this->input = file_get_contents($file);
  }
  
  public function exec($type='compiled_code') {
    $query = array(
      'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
      'output_format' => 'json',
      'output_info' => $type,
      'js_code' => $this->input
    );
    $curl = curl_init('http://closure-compiler.appspot.com/compile');
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($query));
    $output = json_decode(curl_exec($curl));
    if($type == 'compiled_code') {
      if($output->compiledCode) {
        return $output->compiledCode;
      } else {
        echo "There were errors - fetching now...\n";
        $this->exec('errors');
      }
    } elseif($type == 'errors') {
      echo count($output->errors)." errors compiling $basename\n";
      foreach($output->errors as $error) {
        echo "$error->error at line $error->lineno, char $error->charno\n",
          $error->line, "\n";
      }
      die();
    }
  }
}

class Pwnage_JSFile {
  protected $file;
  protected $public_path;
  
  
  public function __construct($file) {
    $this->file = $file;
    $this->public_path = PUBLIC_SCRIPT_ROOT.'/'.str_replace(array(SCRIPT_ROOT.'/', SCRIPT_ROOT),
      '', $file);
  }
  
  public function minify() {
    $basename = basename($this->file);
    $this->prepPublicDir();
    echo "Processing $basename...\n";
    $request = new Pwnage_ClosureRequest($this->file);
    $output = $request->exec();
    file_put_contents($this->public_path, $output);
    echo "$basename saved.\n";
  }
  
  protected function prepPublicDir() {
    $public_dir = dirname($this->public_path);
    if(!file_exists($public_dir) && !is_dir($public_dir)) {
      echo "Making dir $public_dir...\n";
      mkdir($public_dir, 0777, true);
    }
  }
  
  static function scanDir($dir) {
    echo "Scanning $dir...\n";
    $files = glob("$dir/*.js");
    foreach($files as $file) {
      $js_file = new Pwnage_JSFile($file);
      $js_file->minify();
    }
    $dirs = glob("$dir/*", GLOB_ONLYDIR);
    if($dirs) {
      foreach($dirs as $dir) {
        self::scanDir($dir);
      }
    }
  }
}

if(isset($argv[1])) {
  $js_file = new Pwnage_JSFile(SCRIPT_ROOT.'/'.$argv[1]);
  $js_file->minify();
} else {
  Pwnage_JSFile::scanDir(SCRIPT_ROOT);
}
?>
