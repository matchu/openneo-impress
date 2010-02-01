#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';
$assets = Pwnage_SwfAsset::all(array(
  'select' => 'url'
));
foreach($assets as $asset) {
  echo "Saving $asset->url\n";
  $asset->saveFile();
}
?>
