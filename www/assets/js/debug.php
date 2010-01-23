<?php
/*
  Security note: this script does not check for development mode.
  Since the main app is open-source, anyway, we don't bother with the overhead
  and let Apache do it, instead.
  
  However, if you have Javascript files that, for whatever reason, you *don't*
  want available to the world non-minified, disable this script! It is only
  for developers' convenience.
  
*/

function ensureThat($condition) {
  if(!$condition) {
    header('HTTP/1.0 404 Not Found');
    die();
  }
}

$file = $_GET['file'];
ensureThat(preg_match('/^[a-z]+$/', $file));
$path = "../../../app/js/$file.js";
ensureThat(file_exists($path));
header('Content-type: text/javascript');
include($path);
?>
alert('You are in debug mode!\n\n'
  + 'You are now using the uncompressed Javascript files. This should cause '
  + 'you no particular issues, but if you are actively changing the files, '
  + 'remember to run scripts/minify_js.php when done in order to ensure that '
  + 'those not in debug mode will get the latest script version.');
if(jQuery) {
  jQuery(window).unload(function () {
    alert('Remember to compress the scripts!');
  });
}
