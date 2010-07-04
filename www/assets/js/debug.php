<?php
/*
  Security note: this script does not check for development mode.
  Since the main app is open-source, anyway, we don't bother with the overhead.
  
  However, if you have Javascript files that, for whatever reason, you *don't*
  want available to the world non-minified, disable this script! It is only
  for developers' convenience.
  
*/

function ensureThat($condition, $otherwise) {
  if(!$condition) {
    header('HTTP/1.0 404 Not Found');
    die($otherwise);
  }
}

$file = $_GET['file'];
$file = preg_replace('/\.js\Z/', '', $file);
ensureThat(preg_match(':\A[a-z/_]+\Z:', $file), '$file must be [a-z/_] only');
$path = "../../../app/js/$file.js";
ensureThat(file_exists($path), '$file not found');
header('Content-type: text/javascript');
include($path);
