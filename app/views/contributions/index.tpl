{*
  Note that there are tons of {assign}s here. Not good. It has to do with a bug
  in Smarty 2, that is fixed in Smarty 3 (which is in beta). Trying to do
  {$obj->foo()->bar()} turns up a Smarty syntax error in version 2.
  Once version 3 is stable, upgrade and make this template bearable again.
*}
{assign var=user_name value=$user->getName()|escape}
{title is="$user_name's contributions"}
{if empty($pagination->results)}
  <p>Nothing here!</p>
{else}
<p>
  {$user_name} has earned a total of
  <strong>
    {$user->getPoints()} points
  </strong>
  so far.
</p>
{paginate name=contributions with=$pagination}
<ul class="contributions">
{  foreach from=$pagination->results item=contribution}
  <li>
    <span class="point-value">{$contribution->getPointValue()}</span>
{    assign var=contributed_class value=$contribution->getContributedClass()}
{    assign var=contributed_obj value=$contribution->getContributedObj()}
{    if $contributed_class == 'Pwnage_Object'}
    <img class="inline-image" src="{$contributed_obj->getThumbnailUrl()}" />
    <span class="username">
      {$user_name}
    </span>
    showed us the 
    <span class="contributed-name">
      {$contributed_obj->getName()|escape}
    </span>
    for the first time
{    elseif $contributed_class == 'Pwnage_ObjectAsset'}
{    assign var=object value=$contributed_obj->getParent()}
    <img class="inline-image" src="{$object->getThumbnailUrl()}" />
    <span class="username">
      {$user_name}
    </span>
    showed us the {$object->getName()|escape} on a new body type
{    elseif $contributed_class == 'Pwnage_PetState'}
{    assign var=pet_type value=$contributed_obj->getPetType()}
{    assign var=species value=$pet_type->getSpecies()}
{    assign var=color value=$pet_type->getColor()}
    <img class="inline-image" src="http://pets.neopets.com/cp/{$pet_type->getImageHash()}/1/3.png" />
    <span class="username">
      {$user_name}
    </span>
    showed us a new pose for the
    <span class="contributed-name">
      {$color->getName()} {$species->getName()}
    </span>
{    elseif $contributed_class == 'Pwnage_PetType'}
{    assign var=species value=$contributed_obj->getSpecies()}
{    assign var=color value=$contributed_obj->getColor()}
    <img class="inline-image" src="http://pets.neopets.com/cp/{$contributed_obj->getImageHash()}/1/3.png" />
    <span class="username">
      {$user_name}
    </span>
    showed us the
    <span class="contributed-name">
      {$color->getName()} {$species->getName()}
    </span>
    for the first time
{    /if}
  <span class="time-ago">{time_ago_in_words time=$contribution->created_at}</span>
  </li>
{  /foreach}
{paginate name=contributions with=$pagination}
</ul>
{/if}
