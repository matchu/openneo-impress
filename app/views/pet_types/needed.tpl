<!DOCTYPE html>
<html>
  <head>
    <title>Dress to Impress - Pet Types Needed</title>
    <link type="text/css" rel="stylesheet" href="/assets/css/blue.css" />
  </head>
  <body class="standard">
    <h1>Pet Types Needed</h1>
    <div class="mascot-dialogue">
      <p>
        Hey, you! Are you here to help us out? Well, aren't you precious!
      </p>
      <p>
        We're looking for
        <strong>new, fresh color-on-species combinations</strong>
        so that we can show them to the world! Think of it like a faerie quest,
        okay, sweetie?
      </p>
      <p>
        Good.
        <strong>Just pick a species below and we'll let you know what colors we
        need for it.</strong>
        Then you just go out and find us a pet like that - I mean,
        if one exists. We obviously don't want you wasting your time looking
        for an Asparagus Koi.
      </p>
    </div>
    <form action="" method="GET">
      <fieldset>
        <legend>Choose a species</legend>
          {include file='pet_attributes/_select.tpl' fields=$fields}
        <input type="submit" value="Go" />
      </fieldset>
    </form>
{if isset($species)}
    <ol class="columns">
      <li>
        <h2>For the {$species->getName()} we have...</h2>
        <ul>
          {section name=color loop=$colors_had}
            <li>{$colors_had[color]->getName()}</li>
          {/section}
        </ul>
      </li>
      <li>
        <h2>We still need...</h2>
        <ul>
          {section name=color loop=$colors_needed}
            <li>{$colors_needed[color]->getName()}</li>
          {/section}
        </ul>
      </li>
    </ol>
{/if}
  </body>
</html>
