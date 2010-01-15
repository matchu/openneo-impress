<?php
require_once '../pwnage/bootstrap.php';

$errors = array(
  'connection_error' => 'Could not get data on your pet. '
    .'Please try again later!',
  'not_found' => 'Could not find any pet by that name. '
    .'Did you spell it correctly?'
);
$error = $errors[$_GET['error']];

$fields = array(
  'color' => Wearables_Color::all(),
  'species' => Wearables_Species::all()
);
?>
<!DOCTYPE html>
<html>
  <head>
    <title>The Wardrobe</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/start/jquery_ui.css" />
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
  </head>
  <body class="index">
    <h1>The Wardrobe</h1>
<?php
if($error):
?>
    <div class="ui-state-error">
      <span class="ui-icon ui-icon-alert floated-icon"></span>
      <?= $error ?>
    </div>
<?php
endif;
if($_GET['warning'] == 'save_error'):
?>
    <div class="ui-state-highlight">
      <span class="ui-icon ui-icon-alert floated-icon"></span>
      <p>
        Oops! We found your pet's data, but had trouble saving a copy for
        future users. But maybe some generous user of the past has already
        uploaded all the data you need - would you like to check?
      </p>
      <p>
        <a href="<?= htmlentities($_GET['destination']) ?>">Yes, please!</a>
      </p>
    </div>
<?php
endif;
?>
    <form id="form-1" action="load_pet.php" method="POST">
      <fieldset>
        <legend>Enter your pet's name</legend>
        <input id="name" type="text" name="name"
          value="<?= htmlentities($_GET['name']) ?>"
          autocomplete="off" />
        <input type="submit" value="Go" />
      </fieldset>
    </form>
    <form id="form-2" action="wardrobe.html" method="GET">
      <fieldset>
        <legend>Or choose a pet to start with</legend>
<?php
foreach($fields as $field_name => $options):
?>
        <select id="<?= $field_name ?>" name="<?= $field_name ?>"><?php
  foreach($options as $option):
?><option value="<?= $option->getId() ?>"><?= $option->getName() ?>
<?php
  endforeach;
?></select>
<?php
endforeach;
?>
        <input type="submit" value="Go" />
      </fieldset>
    </form>
    <img id="pet-preview" src="/assets/images/blank.gif"
      height="50" width="50" />
    <div id="preview-response"></div>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/js/index.js"></script>
  </body>
</html>
