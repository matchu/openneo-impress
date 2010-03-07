<?php
function smarty_function_species_color_query($params, &$smarty) {
  $color = $params['color'];
  $species_name = $params['species_name'];
  $query = 'site:neopets.com+inurl:petlookup.phtml+&quot;the+'.$color->getDisplayName().'+'.$species_name.'&quot;';
  if($gender = $color->getGender()) {
    $query .= '+&quot;Gender:+'.$gender.'&quot;';
  }
  return $query;
}
?>
