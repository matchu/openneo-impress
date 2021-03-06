<!DOCTYPE html>
<html>
  <head>
    <title>Dress to Impress - {$_title|default:'Welcome!'}</title>
    {insert name=css src=clean}
  </head>
  <body class="standard {$controller->name}-{$controller->current_action} fullscreen">
    {include file='shared/analytics.tpl'}
    <div id="container">
      <a id="home-link" href="/"><span>Dress to Impress</span></a>
      <h1 id="title">{$_title}</h1>
      {insert name=announcement}
      {insert name='flashes'}
{$_content_for_layout|indent:4}
      {insert name='userbar'}
      {include file='shared/footer.tpl'}
    </div>
    {include file='shared/feedback.tpl'}
  </body>
</html>
