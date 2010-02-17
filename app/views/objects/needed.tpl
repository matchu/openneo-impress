{if isset($objects)}
{  title is="Needed Objects For $color_name $species_name"}
<h2>
{if $pet_name}
    <img src="http://pets.neopets.com/cpn/{$pet_name|urlencode}/1/1.png" class="inline-image" />
    {$pet_name|escape}
{else}
    Your {$color_name} {$species_name}
{/if}
  can model...
</h2>
<ul class="buttons">
  <li>
    <form action="{path to=load_pet}" method="POST">
      <input type="hidden" name="origin"
        value="{path to=needed_objects}" />
      <input type="hidden" name="name" value="{$pet_name|escape}" />
      <input type="submit" value="I'm wearing one now!" class="loud" />
    </form>
  </li>
  <li>
    <a class="button" href="http://www.neopets.com/closet.phtml" target="_blank">
      What do I own? &raquo;
    </a>
  </li>
  <li>
    <a class="button" href="{path to=needed_objects}">
      Try another pet &raquo;
    </a>
  </li>
</ul>
<ul>
{  foreach from=$objects item=object}
  <li class="object">
    <a href="http://neoitems.net/search2.php?Name={$object->getName()|urlencode}&AndOr=exact&Category=All&Special=0&Status=Active&Sort=ItemID&results=15&SearchType=8&randtest="
      target="_blank">
      <img src="{$object->getThumbnailUrl()}" />
      {$object->getName()}
    </a>
  </li>
{  /foreach}
</ul>
{else}
{  title is='Needed Objects'}
<div class="mascot-dialogue">
  <p>
    Hey, you! Are you here to help us out? Well, aren't you precious!
  </p>
  <p>
    We're looking for
    <strong>new, fresh clothing combinations</strong>
    so we can see what different wearables look like on different kinds of pets.
  </p>
  <p>
    <strong>
      Just tell us your pet's name, and we'll tell you what clothes
      we're looking for.
    </strong>
    Then if you have any of these items, have your pet wear it, and head down
    the runway!
  </p>
</div>
<form action="/pets/load" method="POST">
  <input type="hidden" name="origin"
    value="{path to=needed_objects}" />
  <fieldset>
    <legend>Enter pet's name</legend>
    <input type="text" name="name" value="{$pet_name|escape}" />
    <input type="submit" value="Go" />
  </fieldset>
</form>
{/if}
