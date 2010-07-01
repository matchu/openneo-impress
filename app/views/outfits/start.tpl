<!DOCTYPE html>
<html>
  <head>
    <title>Dress to Impress</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/start/jquery_ui.css" />
    <link type="text/css" rel="stylesheet" href="/assets/css/clean.css" />
    <link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Droid+Serif">
  </head>
  <body class="index">
    <div id="container">
      {include file='shared/analytics.tpl'}
      {insert name=flashes}
      <div id="outfit-forms">
        <div id="pet-preview">
          <img src="/assets/images/default_preview.png" />
          <span></span>
        </div>
        <h1>Dress to Impress</h1>
        <h2>Neopets wearables made easy!</h2>
        <form id="form-1" action="{path to=load_pet}" method="POST">
          <input type="hidden" name="destination"
            value="{path to=edit_outfit}" />
          <input type="hidden" name="origin"
            value="{path to=root}" />
          <fieldset>
            <legend>Enter your pet's name</legend>
            <input id="name" type="text" name="name"
              value="{$name}"
              autocomplete="off" spellcheck="false" />
            <button type="submit">
              Plan my outfit!
            </button>
          </fieldset>
        </form>
        <form id="form-2" action="wardrobe.html" method="GET">
          <fieldset>
            <legend>Or start from scratch</legend>
    {include file='pet_attributes/_select.tpl'}
            <input type="submit" value="Go" />
          </fieldset>
        </form>
      </div>
      <ul id="sections">
        <li>
          <a href="http://forum.openneo.net">
            <img src="/assets/images/forum.png" />
          </a>
          <h3>
            <a href="http://forum.openneo.net/">Forum</a>
          </h3>
          <div>
            <h4>Join our community!</h4>
            <p>
              Show off your designs, ask for advice, or play silly forum games
              here.
            </p>
          </div>
        </li>
        <li>
          <a href="http://items.impress.openneo.net">
            <img src="/assets/images/items.png" />
          </a>
          <h3>
            <a href="http://items.impress.openneo.net">
              Infinite Closet
            </a>
          </h3>
          <div>
            <h4>Looking for something?</h4>
            <p>
              Take a look through our wearables database!
            </p>
            <form action="http://items.impress.openneo.net">
              <input type="search" name="q" placeholder="search items..." />
              <input type="submit" value="Search" />
            </form>
          </div>
        </li>
        <li id="blog-preview">
          <a href="http://blog.openneo.net">
            <img src="/assets/images/blog.png" />
          </a>
          <h3>
            <a href="http://blog.openneo.net/">OpenNeo Blog</a>
          </h3>
          <div>
            <h4>We'll keep you posted!</h4>
            <p>
              Dress to Impress is always improving, and you can always stay in
              the loop through our blog.
            </p>
          </div>
        </li>
      </ul>
      <div id="description">
        <h2>Built by you, just for you!</h2>
        <p>
          Dress to Impress lets you plan how you want to dress up your Neopets,
          before you even go shopping! Whenever you give us a Neopet's name, we
          automatically look up what it's wearing and organize the data into
          our own wearables database &mdash; a community closet, if you will.
          Then you can plan your outfit, mixing and matching various items, so
          you can have the best-dressed Neopet in all of Neopia!
        </p>
        <p>
          To make all this possible, though, we need your help &mdash; and if
          you log in at the top, we'll keep track of your
          <a href="{path to=contributions}">
            contributions</a
          > and award
          <a href="{path to=top_contributors}">
            points</a
          >
          so you can show off just how dedicated you really are!
        </p>
      </div>
      <div id="top-contributors">
        <h3>Top Contributors</h3>
        <ol>
{foreach from=$top_contributors item=user key=rank}
          <li>
            <a href="{path to=contributions for=$user}">
              {$user->getName()|escape}</a
            > &mdash; {$user->getPoints()}
          </li>
{/foreach}
        </ol>
        <a href="{path to=top_contributors}">see more</a>
      </div>
      <form id="how-can-i-help" action="{path to=load_pet}" method="POST">
        <input type="hidden" name="destination"
          value="{path to=needed_objects}" />
        <input type="hidden" name="origin"
          value="{path to=root}" />
        <h2>How can I help?</h2>
        <p>
          Enter your pet's name, and we'll tell you what items you can help us
          model. Thanks so much!
        </p>
        <input type="text" name="name"
          value="{$name}"
          autocomplete="off" spellcheck="false" />
        <button type="submit">
          Let's model!
        </button>
      </form>
      <form id="i-found-something" action="{path to=load_pet}" method="POST">
        <input type="hidden" name="origin"
          value="{path to=root}" />
        <h2>I found something!</h2>
        <p>
          Enter the name of the pet you found, and we'll keep a copy of what
          it's wearing. Thanks so much!
        </p>
        <input type="text" name="name"
          value="{$name}"
          autocomplete="off" spellcheck="false" />
        <button type="submit">
          I pwn!
        </button>
      </form>
      {insert name='userbar'}
      {include file='shared/footer.tpl'}
    </div>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/js/index.js?063020102323"></script>
    {include file='shared/feedback.tpl'}
  </body>
</html>
