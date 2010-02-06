{foreach from=$pet_type_fields key=field_name item=field}{strip}
{if array_key_exists($field_name, $pet_type_fields_selected)}
  {html_options name=$field_name options=$field id=$field_name
    selected=$pet_type_fields_selected[$field_name]}
{else}
  {html_options name=$field_name options=$field id=$field_name}
{/if}
{/strip}{/foreach}
