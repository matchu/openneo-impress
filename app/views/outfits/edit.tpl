<!DOCTYPE html>
<html>
  <head>
    <title>Dress to Impress: Wardrobe</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/start/jquery_ui.css" />
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
    <!--[if IE]>
    <link type="text/css" rel="stylesheet" href="/assets/css/ie.css" />
    <![endif]-->
  </head>
  <body class="wardrobe">
    {include file='shared/analytics.tpl'}
    <div id="toolbar-right" class="toolbar">
      <div class="toolbar-modules">
        <div id="header-module" class="module">
          <a href="/">Dress to Impress</a>
          - an <a href="http://openneo.net">OpenNeo</a> project
        </div>
        <div id="closet-module" class="module">
          <h1>Closet</h1>
          <ul id="closet-module-objects"></ul>
        </div>
        <div id="footer-module" class="module">
          Images &copy; 2000-2010 Neopets, Inc. All Rights Reserved.
          Used With Permission
        </div>
      </div>
    </div>
    <div id="toolbar-bottom" class="toolbar">
      <div class="toolbar-modules">
        <div id="search-module" class="module">
          <h1>Search</h1>
          <form id="search-form">
            <input id="search-form-query" type="text" />
            <input type="submit" value="Go" />
          </form>
          <div id="search-module-error" class="error"></div>
          <ul id="search-module-objects"></ul>
        </div>
      </div>
    </div>
    <div id="toolbar-float">
      <div id="pet-type-module" class="module">
        <h1>Pet Type</h1>
        <form id="pet-type-form">
          <select id="pet-type-form-color"></select>
          <select id="pet-type-form-species"></select>
          <input type="submit" value="Go" />
        </form>
      </div>
      <div id="pet-state-module" class="module">
        <h1>State</h1>
        <ul id="pet-state-list"></ul>
      </div>
    </div>
    <div id="outfit-preview"><div id="outfit-preview-swf"></div></div>
    <div id="object-description"></div>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/assets/js/swfobject/swfobject.js"></script>
    <script type="text/javascript" src="/assets/js/wardrobe.js"></script>
    {include file='shared/feedback.tpl'}
  </body>
</html>
