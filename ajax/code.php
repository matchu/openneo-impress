<?php
$colors = array(
  'plushie' => 'zm853g4b',
  'blue' => 'dj7n2zk8',
  'green' => '3qwwn4n2'
);
$color = $colors[strtolower($_GET['color'])];
if($color) {
  echo $color;
} else {
  header("HTTP/1.0 404 Not Found");
}
?>
