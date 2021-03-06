{title is="Top contributors"}
<ul class="buttons">
  Go to:
  <li>
    <a class="button" href="{path to=contributions}">Recent contributions</a>
  </li>
</ul>
<table id="top-contributors">
  <tr>
    <th scope="column">Rank</th>
    <th scope="column">User</th>
    <th scope="column">Points</th>
  </tr>
{foreach from=$users item=user key=rank}
  <tr>
    <th scope="row">{$rank+1}</th>
    <td>
      <a href="{path to=contributions for=$user}">
        {$user->getName()|escape}</a
      >
    </td>
    <td>{$user->getPoints()}</td>
  </tr>
{/foreach}
</table>
