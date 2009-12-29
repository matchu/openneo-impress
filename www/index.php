<?php
require_once '../lib/color.class.php';
require_once '../lib/object.class.php';
require_once '../lib/pet_type.class.php';
require_once '../lib/species.class.php';

$objects = Wearables_Object::all(array('select' => 'id, name'));
$objects[] = new Wearables_Object();

$fields = array(
  'color' => Wearables_Color::all(),
  'species' => Wearables_Species::all(),
  'object' => $objects
);

if($pet_data = $_GET['pet']) {
  try {
    $pet_type = new Wearables_PetType($pet_data['species'], $pet_data['color']);
    $outfit = $pet_type->createOutfit();
    if($object_id = $pet_data['object']) {
      $outfit->addObjectById($object_id);
    }
  } catch(Wearables_BiologyAssetsNotFoundException $e) {
    $error = "We don't have data on this type of pet yet. Sorry!";
  }
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Preview</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/style.css" />
  </head>
  <body>
    <h1>Wearables</h1>
    <h2>Preview Pet Color</h2>
<?php
if($error):
?>
    <p class="error"><?= $error ?></p>
<?php
endif;
?>
    <form action="" method="GET">
<?php
foreach($fields as $field_name => $field_objects):
  $id_field_name = $field_name.'_id';
?>
      <select name="pet[<?= $field_name ?>]">
<?php
  foreach($field_objects as $field_object):
    $selected = $field_object->id == $pet_type->$id_field_name? ' selected' : '';
?>
        <option value="<?= $field_object->id ?>" <?= $selected ?>>
          <?= $field_object->name."\n" ?>
        </option>
<?php
  endforeach;
?>
      </select>
<?php
endforeach;
?>
      <input type="submit" />
    </form>
<?php
if($outfit):
?>
    <h3>Resulting Outfit</h3>
    <?= $outfit->getPreviewHTML() ?>
<?php
endif;
?>
    <h2>Add Pet Data</h2>
    <form action="load_pet.php" method="POST">
      <label for="pet_name">Pet Name</label>
      <input id="pet_name" type="text" name="name" />
      <input type="submit" />
    </form>
<?php
include('../includes/pet_swf_image_js.html');
?>
  </body>
</html>
