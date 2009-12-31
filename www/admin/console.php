<?php
require '../../lib/amf.class.php';
require '../../lib/spyc.php';

$config = Spyc::YAMLLoad('console.yaml');
$methods = $config['methods'];

if($_GET['method']) {
  $amf = new Wearables_AMF();
  $response = $amf->sendRequest($_GET['method'], $_GET['arguments']);
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>AMFPHP Console</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/plain.css" />
    <style type="text/css">
      pre.method-name {
        display: inline;
      }
    </style>
  </head>
  <body>
    <h1><a href="console.php">AMFPHP Console</a></h1>
    <h2>Methods</h2>
<?php
foreach($methods as $method):
?>
    <h3><pre class="method-name"><?= $method['name'] ?></pre></h3>
    <form action="" method="GET">
      <input type="hidden" name="method" value="<?= $method['name']?>" />
      <ol class="form-fields">
<?php
  $arguments = $method['arguments'];
  if(!$arguments) $arguments = array();
  foreach($arguments as $i => $argument):
    $field_name = "arguments[$i]";
?>
        <li>
          <label for="<?= $field_name ?>"><?= $argument['name'] ?></label>
          <input type="text" id="<?= $field_name ?>" name="<?= $field_name ?>"
            value="<?= $argument['default'] ?>" />
        </li>
<?php
  endforeach;
?>
      </ol>
      <input type="submit" />
    </form>
<?php
endforeach;
if($response):
?>
  <h2>Response for <pre class="method-name"><?= htmlentities($_GET['method']) ?></pre></h2>
  <pre><?= htmlentities(print_r($response, 1)) ?></pre>
<?php
endif;
?>
  </body>
</html>
