<?php
function smarty_insert_flashes($params, &$smarty) {
  $vars = $smarty->get_template_vars();
  $output = '';
  if(isset($vars['flash'])) {
    $flash = $vars['flash'];
    if($flash) {
      $old_caching = $smarty->caching;
      $smarty->caching = 0;
      foreach($flash as $type => $templates) {
        foreach($templates as $template) {
          $output .= "<div class='$type'>";
          $output .= $smarty->fetch($template.'.tpl');
          $output .= '</div>';
        }
      }
      $smarty->caching = $old_caching;
    }
  }
  return $output;
}
?>
