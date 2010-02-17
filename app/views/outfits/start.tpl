<!DOCTYPE html>
<html>
  <head>
    <title>Dress to Impress</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/start/jquery_ui.css" />
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
  </head>
  <body class="index">
    {include file='shared/analytics.tpl'}
    <h1>Dress to <span>Impress</span></h1>
    {insert name=flashes}
    <form id="form-1" action="{path to=load_pet}" method="POST">
      <input type="hidden" name="destination" value="{path to=edit_outfit}" />
      <input type="hidden" name="origin" value="{path to=root}" />
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
{include file='pet_attributes/_select.tpl'}
        <input type="submit" value="Go" />
      </fieldset>
    </form>
    <img id="pet-preview" src="/assets/images/blank.gif"
      height="50" width="50" />
    <div id="preview-response"></div>
    <a id="we-need-you" href="{path to=needed_objects}">
      <h2>We need you to be a star!</h2>
      Dress to Impress is community-driven. We've got a lot of data here
      already, but could you help us fill in the blanks?
      <span>Model your pet!</span>
    </a>
    {include file='shared/footer.tpl'}
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/js/index.js"></script>
    {include file='shared/feedback.tpl'}
  </body>
</html>
