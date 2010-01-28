#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';
$assets = Pwnage_SwfAsset::all();
foreach($assets as $asset) {
  echo "Loading $asset->url\n";
  $asset->saveFile();
}
?>
