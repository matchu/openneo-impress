<?php
function smarty_function_species_color_query($params, &$smarty) {
  $color = $params['color'];
  $species_name = $params['species_name'];
  return urlencode(Pwnage_PetAttribute::searchQueryFor($color, $species_name));
}
?>
