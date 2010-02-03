#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}
set_error_handler("exception_error_handler", error_reporting());

define('spiderObjects', 1);
define('spiderAssets', 2);
define('spiderCatFile', 3);

function setMode($new_mode) {
  global $mode;
  static $explicitly_set_to;
  if(isset($explicitly_set_to) && $explicitly_set_to != $new_mode) {
    throw new Exception(
      'Your arguments implied two different spidering modes. Pick one.'
    );
  } else {
    $explicitly_set_to = $new_mode;
    $mode = $new_mode;
  }
}

// Defaults:
$mode = spiderObjects;
$trace = false;
$limit = 100;

try {
  $arguments = $argv;
  array_shift($arguments);
  foreach($arguments as $arg) {
    if($arg == '--objects-only') {
      setMode(spiderObjects);
    } elseif(preg_match('/^--cat-file=(.+)$/', $arg, $matches)) {
      setMode(spiderCatFile);
      $cat_file = $matches[1];
    } elseif(preg_match('/^--limit=([0-9]+)$/', $arg, $matches)) {
      setMode(spiderAssets);
      $limit = (int) $matches[1];
    } elseif($arg == '--trace') {
      $trace = true;
    } else {
      throw new Exception("Argument '$arg' unrecognized");
    }
  }

  if($mode == spiderObjects) {
    Pwnage_Object::spiderMall();
  } elseif($mode == spiderAssets) {
    Pwnage_ObjectAsset::spiderMall($limit);
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
  echo get_class($e).': "'.$e->getMessage()."\"\n\n";
  if($trace) {
    echo $e->getTraceAsString();
  } else {
    echo 'Error occurred in '.$e->getFile().' on line '.$e->getLine().
      '. Run with --trace for more info.';
  }
  echo "\n";
}
?>
