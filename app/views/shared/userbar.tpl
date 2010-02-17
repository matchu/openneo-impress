<div id="userbar">
{assign var='user' value=$controller->getCurrentUser()}
{if $user}
  Hi! {$user->getName()}
{else}
  <div>Login with:</div>
  <ul id="userbar-auth-servers">
{  foreach from=$controller->getAuthServers() item=auth_server}
    <li>
      <a href="{$auth_server->getLoginUrl()|escape}">
        <img src="{$auth_server->getIcon()}" />
        <span>{$auth_server->getName()|escape}</span>
      </a>
    </li>  
{  /foreach}
{/if}
  </ul>
</div>
