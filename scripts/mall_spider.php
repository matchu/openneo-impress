#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';

$class_name = in_array('--objects', $argv) ?
  'Pwnage_Object' : 'Pwnage_ObjectAsset';
call_user_func(array($class_name, 'spiderMall'));
?>
