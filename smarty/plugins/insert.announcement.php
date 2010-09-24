<?php
function smarty_insert_announcement($params, &$smarty) {
  $path = PWNAGE_ROOT . '/announcement.html';
  if(file_exists($path)) {
    return file_get_contents($path);
  }
}
?>
