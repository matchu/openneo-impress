#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}
set_error_handler("exception_error_handler", error_reporting());

define('spiderMall', 1);
define('spiderCatFile', 2);

function setMode($new_mode) {
  global $mode;
  static $explicitly_set = false;
  if($explicitly_set) {
    throw new Exception(
      'Your arguments implied two different spidering modes. Pick one.'
    );
  } else {
    $explicitly_set = true;
    $mode = $new_mode;
  }
}

// Defaults:
$mode = spiderMall;
$class_name = 'Pwnage_ObjectAsset';
$trace = false;

try {
  foreach($argv as $arg) {
    if($arg == '--objects') {
      $class_name = 'Pwnage_Object';
      setMode(spiderMall);
    } elseif(preg_match('/^--cat-file=(.+)$/', $arg, $matches)) {
      setMode(spiderCatFile);
      $cat_file = $matches[1];
    } elseif($arg == '--trace') {
      $trace = true;
    }
  }

  if($mode == spiderMall) {
    $class_name = in_array('--objects', $argv) ?
      'Pwnage_Object' : 'Pwnage_ObjectAsset';
    call_user_func(array($class_name, 'spiderMall'));
  } elseif($mode == spiderCatFile) {
    if(file_exists($cat_file)) {
      if($data = file_get_contents($cat_file)) {
        Pwnage_Object::saveCollection(Pwnage_Object::spiderMallCat($data));
        echo "Objects saved\n";
      } else {
        throw new Exception("Could not open $cat_file");
      }
    } else {
      throw new Exception("$cat_file does not exist");
    }
  }
} catch(Exception $e) {
  echo 'Error: "'.$e->getMessage()."\"\n\n";
  if($trace) {
    echo $e->getTraceAsString();
  } else {
    echo 'Error occurred in '.$e->getFile().' on line '.$e->getLine().
      '. Run with --trace for more info.';
  }
  echo "\n";
}
?>
