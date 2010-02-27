{*
  Note that there are tons of {assign}s here. Not good. It has to do with a bug
  in Smarty 2, that is fixed in Smarty 3 (which is in beta). Trying to do
  {$obj->foo()->bar()} turns up a Smarty syntax error in version 2.
  Once version 3 is stable, upgrade and make this template bearable again.
*}
{if isset($user)}
  {assign var=user_name value=$user->getName()|escape}
  {title is="$user_name's contributions"}
{else}
  {title is="Recent Contributions"}
{/if}
{if empty($pagination->results)}
  <p>Nothing here!</p>
{else}
{if isset($user)}
  <p>
    {$user_name} has earned a total of
    <strong>
      {$user->getPoints()} points
    </strong>
    so far.
  </p>
{/if}
{paginate name=contributions with=$pagination}
<ul class="contributions">
{  foreach from=$pagination->results item=contribution}
  <li>
    <span class="point-value">{$contribution->getPointValue()}</span>
    <span class="username">
{    if isset($user_name)}
      {$user_name}
{    else}
{      assign var=user value=$contribution->getUser()}
      <a href="{path to=contributions for=$user}">
        {$user->getName()|escape}</a
      >
{    /if}
    </span>
{    assign var=contributed_class value=$contribution->getContributedClass()}
{    assign var=contributed_obj value=$contribution->getContributedObj()}
{    if $contributed_class == 'Pwnage_Object'}
    showed us the 
    <span class="contributed-name">
      {$contributed_obj->getName()|escape}
    </span>
    for the first time
    <img src="{$contributed_obj->getThumbnailUrl()}" />
{    elseif $contributed_class == 'Pwnage_ObjectAsset'}
{    assign var=object value=$contributed_obj->getParent()}
    showed us the
    <span class="contributed-name">
      {$object->getName()|escape}
    </span>
    on a new body type
    <img src="{$object->getThumbnailUrl()}" />
{    elseif $contributed_class == 'Pwnage_PetState'}
{    assign var=pet_type value=$contributed_obj->getPetType()}
{    assign var=species value=$pet_type->getSpecies()}
{    assign var=color value=$pet_type->getColor()}
    showed us a new pose for the
    <span class="contributed-name">
      {$color->getName()} {$species->getName()}
    </span>
    <img src="http://pets.neopets.com/cp/{$pet_type->getImageHash()}/1/3.png" />
{    elseif $contributed_class == 'Pwnage_PetType'}
{    assign var=species value=$contributed_obj->getSpecies()}
{    assign var=color value=$contributed_obj->getColor()}
    showed us the
    <span class="contributed-name">
      {$color->getName()} {$species->getName()}
    </span>
    for the first time
    <img src="http://pets.neopets.com/cp/{$contributed_obj->getImageHash()}/1/3.png" />
{    /if}
  <span class="time-ago">{time_ago_in_words time=$contribution->created_at}</span>
  </li>
{  /foreach}
{paginate name=contributions with=$pagination}
</ul>
{/if}
