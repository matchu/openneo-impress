<!DOCTYPE html>
<html>
  <head>
    <title>Dress to Impress - {$_title|default:'Welcome!'}</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
  </head>
  <body class="standard">
    {include file='shared/analytics.tpl'}
    <a id="home-link" href="/"><span>Dress to Impress</span></a>
    <h1>{$_title}</h1>
    {insert name='flashes'}
{$_content_for_layout|indent:4}
    {insert name='userbar'}
    {include file='shared/footer.tpl'}
    {include file='shared/feedback.tpl'}
  </body>
</html>
