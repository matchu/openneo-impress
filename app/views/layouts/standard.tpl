<!DOCTYPE html>
<html>
  <head>
    <title>Dress to Impress - {$_title|default:'Welcome!'}</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
  </head>
  <body class="standard">
    {include file='shared/analytics.tpl'}
    <h1>{$_title}</h1>
    {insert name=flashes}
    <a id="home-link" href="/"><span>Dress to Impress</span></a>
{$_content_for_layout|indent:4}
    {include file='shared/footer.tpl'}
  </body>
</html>
