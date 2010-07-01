{title is="Planning an outfit"}
<div id="preview">
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
    <div>
      <button id="share-button" class="addthis_button">
        <img src="http://s7.addthis.com/static/t00/logo1414.gif" />
        Share
      </button>
    </div>
  </div>
  <div id="preview-swf">
    Javascript and Flash are required to preview outfits. Sorry!
  </div>
  <div id="preview-closet">
    <h2>Closet</h2>
    <ul></ul>
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
      <dt>floating doll</dt>
      <dd>returns any item with the words "floating" and "doll" in it</dd>
      <dt>"easter negg"</dt>
      <dd>returns any item with the phrase "easter negg" in it</dd>
      <dt>"altador cup" -background</dt>
      <dd>
        returns any item with the phrase "altador cup" in it, but not the word
        "background"
      </dd>
      <dt><span>species:</span><span class="search-helper" data-search-filter="species">Acara</span></dt>
      <dd>returns any item a <span class="search-helper" data-search-filter="species">Acara</span> can wear</dd>
      <dt><span>only:</span><span class="search-helper" data-search-filter="only">Acara</span></dt>
      <dd>returns any item only a <span class="search-helper" data-search-filter="only">Acara</span> can wear</dd>
      <dt><span>type:</span><span class="search-helper" data-search-filter="type">background</span></dt>
      <dd>returns any item that fills a <span class="search-helper" data-search-filter="type">background</span> zone</dd>
    </dl>
    <div id="preview-search-form-loading">Loading...</div>
    <div id="preview-search-form-error" class="possible-error"></div>
    <div id="preview-search-form-no-results">
      No results for "<span></span>"
    </div>
    <ul></ul>
  </form>
</div>
<!--[if IE]>
<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
<script type="text/javascript" src="http://bit.ly/javascript-api.js?version=latest&amp;login=openneo&amp;apiKey=R_4d0438829b7a99860de1d3edf55d8dc8"></script>
<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#username=openneo"></script>
<script type="text/javascript" src="/assets/js/jquery.jgrowl.js"></script>
<script type="text/javascript" src="/assets/js/wardrobe.js?v=070120100215"></script>
