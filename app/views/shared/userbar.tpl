<div id="userbar">
{assign var='user' value=$controller->getCurrentUser()}
{if $user}
  <div>
    Hey, {$user->getName()}!
    You have
    <a href="{path for=$user to=contributions}">
      {$user->getPoints()} points</a
    >.
  </div>
  <div><a href="{path to=logout}">Log out</a></div>
{else}
  <div id="userbar-login-with">Login with:</div>
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
