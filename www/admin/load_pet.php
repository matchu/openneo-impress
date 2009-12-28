<?php
require_once '../../lib/pet.class.php';

$pet = new Wearables_Pet();
if($_GET['name']) {
  $pet->name = $_GET['name'];
  try {
    $pet->getViewerData();
    $pet_loaded = true;
  } catch(Wearables_PetNotFoundException $e) {
    $error = 'Could not find any pet with that name.';
  }
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Wearables - Load Pet</title>
    <link type="text/css" rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Load Pet</h1>
<?php
if($error):
?>
    <p class="error"><?= $error ?></p>
<?php
endif;
?>
    <form action="" method="GET">
      <label for="name">Pet Name</label>
      <input type="text" name="name" value="<?= $pet->name ?>" />
      <input type="submit" value="Submit Query" />
    </form>
<?php
if($pet_loaded):
?>
    <dl>
      <dt>Species</dt>
      <dd><?= $pet->getSpecies()->getName() ?></dd>
      
      <dt>Color</dt>
      <dd><?= $pet->getColor()->getName() ?></dd>
      
      <dt>Image</dt>
      <dd>
        <?= $pet->getImageHTML() ?>
      </dd>
      <dt>Objects</dt>
      <dd>
        <ul id="pet-objects">
<?php
foreach($pet->getObjects() as $object):
?>
          <li>
            <a href="http://neoitems.net/search2.php?Name=<?= urlencode($object->name) ?>&AndOr=and&Category=All&Special=0&Status=Active&results=15&SearchType=8" target="_blank">
              <img src="<?= $object->thumbnail_url ?>" alt="(image)" />
              <?= $object->name ?>
            </a>
          </li>
<?php
endforeach;
?>
        </ul>
      </dd>
    </dl>
<?php
endif;
include('../../includes/pet_swf_image_js.html');
?>
  </body>
</html>
