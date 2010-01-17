<!DOCTYPE html>
<html>
  <head>
    <title>The Wardrobe</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/start/jquery_ui.css" />
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
  </head>
  <body class="index">
    <h1>The Wardrobe</h1>
    {insert name=flashes}
    <form id="form-1" action="{path to=load_pet}" method="POST">
      <fieldset>
        <legend>Enter your pet's name</legend>
        <input id="name" type="text" name="name"
          value="{$name}"
          autocomplete="off" />
        <input type="submit" value="Go" />
      </fieldset>
    </form>
    <form id="form-2" action="wardrobe.html" method="GET">
      <fieldset>
        <legend>Or choose a pet to start with</legend>
{foreach from=$fields key=field_name item=field}{strip}
{html_options name=$field_name options=$field id=$field_name}
{/strip}{/foreach}
        <input type="submit" value="Go" />
      </fieldset>
    </form>
    <img id="pet-preview" src="/assets/images/blank.gif"
      height="50" width="50" />
    <div id="preview-response"></div>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/js/index.js"></script>
  </body>
</html>
