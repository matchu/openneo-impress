$(function () {
  var previewWithNameTimeout = null, previousName, previewLoadCount = 0,
    awaitingLoad = false;
  
  function updatePreview(src) {;
    $('#pet-preview').attr('src', src);
    awaitingLoad = true;
  }
  
  function clearPreview() {
    $('#pet-preview').addClass('loading');
    $('#preview-response').text('');
  }
  
  function previewLoading() {
    $('#preview-response').text('Loading...');
    $('#pet-preview').addClass('loading').data('loadId', ++previewLoadCount);
  }
  
  function previewNotFound(str) {
    $('#preview-response').text(str);
  }
  
  function updatePreviewWithName() {
    var name = $('#name').val();
    if(name) {
      if(name != previousName) {
        previewLoading();
        updatePreview('http://pets.neopets.com/cpn/' + name + '/1/1.png');
      }
    } else {
      clearPreview();
    }
    previousName = name;
  }
  
  var name = document.location.search.match(/\?name=(.+)/);
  if(name) {
    name = name[1];
    $('#name').val(name);
  }
  updatePreviewWithName();
  
  $('#name').keyup(function () {
    if(previewWithNameTimeout) {
      clearTimeout(previewWithNameTimeout);
      awaitingLoad = false;
    }
    previewWithNameTimeout = setTimeout(updatePreviewWithName, 250);
  });
  
  $('#pet-preview').load(function () {
    if(awaitingLoad && $(this).data('loadId') == previewLoadCount) {
      $(this).removeClass('loading');
      $('#preview-response').text('Is this what you wanted?');
    }
  }).error(function () {
    if(awaitingLoad && $(this).data('loadId') == previewLoadCount) {
      previewNotFound('Pet not found.');
    }
  });
  
  var selectFields = $('#species, #color');
  selectFields.change(function () {
    var type = {};
    selectFields.each(function () {
      var el = $(this);
      type[el.attr('id')] = el.children(':selected').val();
    });
    previewLoading();
    $.ajax({
      url: '/pet_types.json',
      data: {
        'for': 'image',
        'species_id': type.species,
        'color_id': type.color
      },
      dataType: 'json',
      success: function (data) {
        if(data) {
          updatePreview('http://pets.neopets.com/cp/' + data.image_hash + '/1/1.png');
        } else {
          previewNotFound("We don't have data on that yet. If you own or know"
            + " of a pet of that type, please type its name in above!");
        }
      },
      error: function () {
        previewNotFound("Error fetching preview. Try again?");
      }
    });
  });
  
  $.getJSON('http://blog.openneo.net/api/read/json?callback=?', function (data) {
    var post = data.posts[0], el = $('#latest-blog-post'),
      url = post['url-with-slug'], header = 'The OpenNeo Blog', body = '',
      truncate_body_at = 100, image;
    if(post.type == 'regular') {
      header = post['regular-title'];
      body = post['regular-body'];
    } else if(post.type == 'link') {
      header = post['link-text'];
      body = post['link-description'];
    } else if(post.type == 'photo') {
      body = post['photo-caption'];
      image = post['photo-url-75'];
    }
    body = body.replace(/(<\/?[\S][^>]*>)/gi, '');
    if(body.length > truncate_body_at) {
      body = body.substring(0, truncate_body_at);
      body = body.replace(/\s+\w+$/, '');
      body += '&hellip; <span>read more</span>';
    }
    el.html(body).attr('href', url);
    $('<h2/>', {text: header}).prependTo(el);
    if(image) {
      $('<img/>', {src: image}).prependTo(el);
    }
    el.show();
  });
});
