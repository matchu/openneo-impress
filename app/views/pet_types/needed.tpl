{if isset($species_name)}
  {title is="Pet Types Needed: $species_name"}
{else}
  {title is='Pet Types Needed'}
{/if}
{if isset($pet_name, $species_name, $color_name)}
<p class="notice">
  <img src="http://pets.neopets.com/cpn/{$pet_name|urlencode}/1/1.png" class="inline-image" />
  Thanks for adding <strong>{$pet_name|escape}</strong>
  the <strong>{$color_name} {$species_name}</strong>!
  Keep up the good work!
</p>
{/if}
<div class="mascot-dialogue">
  <p>
    Hey, you! Are you here to help us out? Well, aren't you precious!
  </p>
  <p>
    We're looking for
    <strong>new, fresh color-on-species combinations</strong>
    so that we can show them to the world! Think of it like a faerie quest,
    okay, sweetie?
  </p>
  <p>
    Good.
    <strong>Just pick a species below and we'll let you know what colors we
    need for it.</strong>
    Then you just go out and find us a pet like that - I mean,
    if one exists. We don't want you wasting your time looking for an
    Asparagus Koi.
  </p>
  <p>
    Click on one of the missing pet names to start a clever little Google
    search we came up with, okay?
  </p>
</div>
<ol class="columns">
  <li>
    <form action="" method="GET">
      <fieldset>
        <legend>Choose a species</legend>
        {include file='pet_attributes/_select.tpl'}
        <input type="submit" value="Go" />
      </fieldset>
    </form>
  </li>
  <li>
    <form action="/pets/load" method="POST">
      <input type="hidden" name="origin"
        value="{path to=needed_pet_types}" />
      <fieldset>
        <legend>Found a pet? Enter name</legend>
        <input type="text" name="name" />
        <input type="submit" value="Go" />
      </fieldset>
    </form>
  </li>
</ol>
{if isset($species_name)}
<ol class="columns">
  <li>
    <h2>For the {$species_name} we have...</h2>
    <ul>
      {section name=color loop=$colors_had}
        <li>{$colors_had[color]->getName()}</li>
      {/section}
    </ul>
  </li>
  <li>
    <h2>We still need...</h2>
    <ul>
      {section name=color loop=$colors_needed}
        <li><a href="http://www.google.com/search?q={species_color_query color=$colors_needed[color] species_name=$species_name}&quot;"
          target="_blank">
          {$colors_needed[color]->getName()}
        </a></li>
      {/section}
    </ul>
  </li>
</ol>
{/if}
