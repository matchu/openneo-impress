<?php
require_once '../../lib/pet.class.php';

$pet = new Pwnage_Pet();
if($_POST['name']) {
  $pet->name = $_POST['name'];
  $pet_exists = $pet->exists();
  if($pet_exists) {
    try {
      $pet->saveData();
      $notice = 'Pet data successfully saved.';
    } catch(Exception $e) {
      $error = "There was a problem saving your pet's data. Please try again. "
        .'<span class="full-error-message">'.$e->getMessage().'</span>';
    }
  } else {
    $error = 'Pet not found.';
  }
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>
      Wearables - <?= $pet_exists ? htmlentities($pet->name) : 'Load pet' ?>
    </title>
    <link type="text/css" rel="stylesheet" href="/assets/css/plain.css" />
  </head>
  <body>
    <h1>Load Pet</h1>
<?php
if($notice):
?>
    <p class="notice"><?= $notice ?></p>
<?php
endif;
if($error):
?>
    <p class="error"><?= $error ?></p>
<?php
endif;
?>
    <form action="" method="POST">
      <label for="name">Pet Name</label>
      <input type="text" name="name" value="<?= htmlentities($pet->name) ?>" />
      <input type="submit" value="Submit Query" />
    </form>
<?php
if($pet_exists):
?>
    <dl>
      <dt>Species</dt>
      <dd><?= $pet->getSpecies()->getName() ?></dd>
      
      <dt>Color</dt>
      <dd><?= $pet->getColor()->getName() ?></dd>
      
      <dt>Image</dt>
      <dd>
        <?= $pet->getPreviewHTML() ?>
      </dd>
      <dt>Objects</dt>
      <dd>
        <ul id="pet-objects">
<?php
  foreach($pet->getObjects() as $object):
?>
          <li>
            <a href="http://neoitems.net/search2.php?Name=<?= urlencode($object->name) ?>&AndOr=and&Category=All&Special=0&Status=Active&results=15&SearchType=8" target="_blank">
              <img src="<?= htmlentities($object->thumbnail_url) ?>" alt="(image)" />
              <?= htmlentities($object->name) ?>
            </a>
<?php
    if($object->isBodySpecific()):
?>
              (body-specific)
<?php
    endif;
?>
          </li>
<?php
  endforeach;
?>
        </ul>
      </dd>
    </dl>
<?php
endif;
include('../../includes/pet_swf_image_js.php');
?>
  </body>
</html>
