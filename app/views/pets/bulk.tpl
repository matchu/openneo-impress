{title is="Add many pets"}
<p class="noscript">
  Note that submitting pets in bulk requires Javascript.
</p>
<p class="script-only">
  We like to make it as easy as possible for you to contribute, so we thought
  this might help! <strong>Type a pet's name in the box below, and we'll
  start loading it the moment you press enter!</strong> If you're a power-user,
  you can even submit a whole list at once - just put one pet per line, and
  copy-paste it into the box. We do the rest!
</p>
<p>
  Before you put too much effort into gathering pet names, <strong>be sure to
  log in!</strong> - we award points for every new contribution to our
  database, and we don't want you to miss out! <strong>Thanks for all your hard
  work!</strong>
</p>
<form id="bulk-pets-form" action="{path to=load_pet}" method="POST">
  <input type="hidden" name="origin" value="{path to=bulk_pets}" />
  <span class="noscript">
    <input name="name" type="text" />
    <input type="submit" value="Load pet" />
  </span>
  <span class="script-only">
    <ul></ul>
    <textarea></textarea>
    <button id="bulk-pets-form-add" type="button">Add</button>
    <button id="bulk-pets-form-clear" type="button">Clear</button>
  </span>
</form>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
{insert name=js src=pet_query}
{insert name=js src=pets/bulk}
