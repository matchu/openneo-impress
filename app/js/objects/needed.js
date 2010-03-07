function closetItemsCallback(object_ids) {
  var in_closet = $('#needed-objects li').filter(function () {
    return $.inArray(parseInt($(this).attr('data-object-id')), object_ids) != -1;
  }).addClass('in-closet');
  if(in_closet.length) {
    closetFeedback(
      'You already have <strong>' + in_closet.length + '</strong> ' +
      'of these items in your closet! How lucky is that?',
      {
        'class': 'in-closet'
      }
    );
    $('.object:not(.in-closet)').fadeTo(1000, .5);
  } else {
    closetFeedback(
      "You don't have any of these items in your closet. Make sure they're " +
      "there and not in your " +
      "<a href='http://www.neopets.com/objects.phtml?type=inventory' target='_blank'>inventory</a>!",
      {
        'class': 'content-box'
      }
    );
  }
}

function closetFeedback(html, options) {
  if(!options) options = {};
  options.html = html;
  $('#loading-closet').remove();
  $('<p/>', options).insertBefore('#needed-objects');
}

var amf_errors = {
  'PHP: You must be the owner to do that operation.':
    'If you owned this pet, we would be able to show you which of these ' +
    'objects you could model. If you <em>are</em> the owner, be sure to ' +
    '<a href="http://www.neopets.com/loginpage.phtml" target="_blank">' +
    'log in to Neopets</a>!',
  'PHP: Unable to retrieve records from the database.':
    'Neopets returned an error looking up your closet data from this pet. ' +
    'How odd.'
}

function amfError(object) {
  var error = amf_errors[object.description];
  if(!error) {
    error = 'Unexpected error: ' + object.description;
  }
  closetFeedback(error, {'class': 'content-box'});
}

$(function () {
  var pet_name_el = $('#pet-name'), pet_name;
  
  function onSWFEmbed() {
    var amf_proxy = $('#amf-proxy:not(div)'),
      el = amf_proxy.length ? amf_proxy.get(0) : false;
    if(el && typeof el.requestKeys != 'undefined') {
      el.requestKeys(
        [
          'CustomPetService.getEditorData',
          'closetItemsCallback',
          pet_name,
          null
        ],
        ['object_info_registry']
      );
    } else {
      setTimeout(onSWFEmbed, 100);
    }
  }

  if(pet_name_el.length) {
    pet_name = pet_name_el.text();
    $('<div/>', {id: 'amf-proxy'}).appendTo('body');
    swfobject.embedSWF('/assets/swf/amf_proxy.swf', 'amf-proxy', 1, 1, '9',
      '/assets/js/swfobject/expressInstall.swf', {}, {allowscriptaccess: 'always'});
    $('<img/>', {
      id: 'loading-closet',
      src: '/assets/images/loading.gif'
    }).insertBefore('#needed-objects');
    onSWFEmbed();
  }
});
