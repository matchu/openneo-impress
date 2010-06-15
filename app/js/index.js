$(function () {
  var previewWithNameTimeout = null, previousName, previewLoadCount = 0,
    awaitingLoad = false, currentName, progress = 0;
  
  function updatePreview(base) {
    var n = progress + 2;
    $('#pet-preview').attr('src', 'http://pets.neopets.com/' + base + '/1/' + n + '.png');
    awaitingLoad = true;
  }
  
  function clearPreview() {
    $('#preview-response').text(currentName);
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
      currentName = name;
      if(name != previousName) {
        previewLoading();
        progress = 0;
        updatePreview('cpn/' + name);
      }
    } else {
      clearPreview();
    }
    previousName = name;
  }
  
  var name = document.location.search.match(/[\?&]name=([^&]+)/);
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
      progress += 2;
      if(progress == 2) {
        updatePreview('cpn/' + currentName);
      }
      $('#preview-response').text(currentName);
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
          updatePreview('cp/' + data.image_hash);
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
  
  /*$.getJSON('http://blog.openneo.net/api/read/json?callback=?', function (data) {
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
      el.addClass('has-image');
    }
    el.show();
  });*/
});
