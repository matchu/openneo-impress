{title is="Planning an outfit"}
<div id="pet-type-not-found" class="possible-error">
  We haven't seen <!-- TODO: specify --> that combination before. Have you?
  Submit the pet's name if you have!
</div>
<div id="preview-toolbar">
  <form id="pet-type-form">
    <select name="color"></select>
    <select name="species"></select>
    <input type="submit" value="Go" />
  </form>
  <form id="pet-state-form">
    Gender/Emotions:
    <ul></ul>
  </form>
  <div id="sharing">
    <input id="short-url-response" type="text" value="http://www.example.com/" />
    <button id="short-url-button">
      Short URL
    </button>
    <div id="share-button-wrapper">
      <button id="share-button" class="addthis_button">
        <img src="http://s7.addthis.com/static/t00/logo1414.gif" />
        Share
      </button>
    </div>
  </div>
</div>
<div id="preview">
  <div id="preview-swf">
    <p>Flash and Javascript (but not Java!) are required to preview outfits.</p>
    <p>If this message stays after the page is done loading, check those first.</p>
  </div>
  <div id="preview-closet">
    <h2>Closet</h2>
    <ul></ul>
    <p id="fullscreen-copyright">
      Images &copy; 2000-2010 Neopets, Inc. All Rights Reserved.
      Used With Permission
    </p>
  </div>
</div>
<form id="preview-search-form">
  <header>
    <h2>Add an item</h2>
    <input type="search" name="query" placeholder="Search items..." />
    <input type="submit" value="Go" />
    <div id="preview-search-form-pagination"></div>
    <a id="preview-search-form-clear" href="#">clear</a>
  </header>
  <dl id="preview-search-form-help"> 
    <div>
      <dt>floating doll</dt>
      <dd>returns any item with the words "floating" and "doll" in it</dd>
    </div>
    <div>
      <dt>"altador cup" -background</dt>
      <dd>
        returns any item with the phrase "altador cup" in it, but not the word
        "background"
      </dd>
    </div>
    <div>
      <dt><span>species:</span><span class="search-helper" data-search-filter="species">Acara</span></dt>
      <dd>returns any item a <span class="search-helper" data-search-filter="species">Acara</span> can wear</dd>
    </div>
    <div>
      <dt><span>type:</span><span class="search-helper" data-search-filter="type">background</span></dt>
      <dd>returns any item that fills a <span class="search-helper" data-search-filter="type">background</span> zone</dd>
    </div>
  </dl>
  <div id="preview-search-form-loading">Loading...</div>
  <div id="preview-search-form-error" class="possible-error"></div>
  <div id="preview-search-form-no-results">
    No results for "<span></span>"
  </div>
  <ul></ul>
</form>
<!--[if IE]>
<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
<script type="text/javascript" src="http://bit.ly/javascript-api.js?version=latest&amp;login=openneo&amp;apiKey=R_4d0438829b7a99860de1d3edf55d8dc8"></script>
<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#username=openneo"></script>
<script type="text/javascript" src="/assets/js/jquery.jgrowl.js"></script>
<script type="text/javascript" src="/assets/js/wardrobe.js?v=070320101904"></script>
