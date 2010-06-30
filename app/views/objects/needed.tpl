{title is="Needed Objects For $color_name $species_name"}
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
<h2>
{if $pet_name}
  <img src="http://pets.neopets.com/cpn/{$pet_name|urlencode}/1/1.png" class="inline-image" />
  <span id="pet-name">{$pet_name|escape}</span>
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
      What do I own?
    </a>
  </li>
</ul>
<ul id="needed-objects">
{  foreach from=$objects item=object}
  <li class="object" data-object-id="{$object->getId()}">
    <a href="http://neoitems.net/search2.php?Name={$object->getName()|urlencode}&AndOr=exact&Category=All&Special=0&Status=Active&Sort=ItemID&results=15&SearchType=8&randtest="
      target="_blank">
      <img src="{$object->getThumbnailUrl()}" />
      {$object->getName()}
    </a>
  </li>
{  /foreach}
</ul>
