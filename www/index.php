<?php
$errors = array(
  'connection_error' => 'Could not get data on your pet. '
    .'Please try again later!',
  'no_name' => 'Make sure you entered a name in the box. ',
  'not_found' => 'Could not find any pet by that name. '
    .'Did you spell it correctly?'
);
$error = $errors[$_GET['error']];
?>
<!DOCTYPE html>
<html>
  <head>
    <title>The Wardrobe</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
  </head>
  <body class="index">
    <h1>The Wardrobe</h1>
<?php
if($error):
?>
    <div class="error"><?= $error ?></div>
<?php
endif;
if($_GET['warning'] == 'save_error'):
?>
    <div class="warning">
      <p>
        Oops! We found your pet's data, but had trouble saving a copy for
        future users. But maybe some generous user of the past has already
        uploaded all the data you need - would you like to check?
      </p>
      <p>
        <a href="<?= htmlentities($_GET['destination']) ?>">Yes, please!</a>
      </p>
    </p>
<?php
endif;
?>
    <form id="form-1" action="load_pet.php" method="POST">
      <fieldset>
        <legend>Enter your pet's name</legend>
        <input type="text" name="name"
          value="<?= htmlentities($_GET['name']) ?>" />
        <input type="submit" value="Go" />
      </fieldset>
    </form>
    <form id="form-2" action="wardrobe.html" method="GET">
      <fieldset>
        <legend>Or choose a pet to start with</legend>
        <select name="color"><option>Alien</option></select>
        <select name="species"><option>Aisha</option></select>
        <input type="submit" value="Go" />
      </fieldset>
    </form>
    <img id="pet-preview" src="/assets/images/blank.gif"
      height="50" width="50" />
  </body>
</html>
