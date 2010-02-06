{foreach from=$fields key=field_name item=field}{strip}
{if array_key_exists('selected', $field)}
  {php}$this->_tpl_vars['selected'] = $this->_tpl_vars['field']['selected']{/php}
  {html_options name=$field_name options=$field id=$field_name
    selected=$selected}
{else}
  {html_options name=$field_name options=$field id=$field_name}
{/if}
{/strip}{/foreach}
