<?php
function smarty_insert_flashes($params, &$smarty) {
  $vars = $smarty->get_template_vars();
  $flash = $vars['flash'];
  $output = '';
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
  return $output;
}
?>
