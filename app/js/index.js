var Preview = {
  clear: function () {
    $('#preview-response').text(Preview.Job.current.name);
  },
  displayLoading: function () {
    $('#pet-preview').addClass('loading');
    $('#preview-response').text('Loading...');
  },
  notFound: function (str) {
    $('#pet-preview').addClass('hidden');
    $('#preview-response').text(str);
  },
  updateWithName: function () {
    var name = $('#name').val(), job;
    if(name) {
      currentName = name;
      if(name != Preview.Job.current.name) {
        job = new Preview.Job.Name(name);
        job.setAsCurrent();
        Preview.displayLoading();
      }
    } else {
      Preview.clear();
    }
  }
}

Preview.Job = function (key, base) {
  var job = this,
    quality = 2;
  job.loading = false;
  
  function getImageSrc() {
    return 'http://pets.neopets.com/' + base + '/' + key + '/1/' +
      quality + '.png'
  }
  
  function load() {
    job.loading = true;
    $('#pet-preview').attr('src', getImageSrc());
  }
  
  this.increaseQualityIfPossible = function () {
    if(quality == 2) {
      quality = 4;
      load();
    }
  }
  
  this.setAsCurrent = function () {
    Preview.Job.current = job;
    load();
  }
}

Preview.Job.Name = function (name) {
  this.name = name;
  Preview.Job.apply(this, [name, 'cpn']);
}

Preview.Job.Hash = function (hash) {-
  Preview.Job.apply(this, [hash, 'cp']);
}


$(function () {
  var previewWithNameTimeout;
  
  Preview.Job.current = { // placeholder
    name: $('#preview-response').text()
  }
  
  var name = document.location.search.match(/[\?&]name=([^&]+)/);
  if(name) {
    name = name[1];
    $('#name').val(name);
  }
  Preview.updateWithName();
  
  $('#name').keyup(function () {
    if(previewWithNameTimeout) {
      clearTimeout(previewWithNameTimeout);
      Preview.Job.current.loading = false;
    }
    previewWithNameTimeout = setTimeout(Preview.updateWithName, 250);
  });
  
  $('#pet-preview').load(function () {
    if(Preview.Job.current.loading) {
      Preview.Job.loading = false;
      Preview.Job.current.increaseQualityIfPossible();
      $(this).removeClass('loading').removeClass('hidden');
      $('#preview-response').text(Preview.Job.current.name);
    }
  }).error(function () {
    if(Preview.Job.current.loading) {
      Preview.Job.loading = false;
      Preview.notFound('Pet not found.');
    }
  });
  
  var selectFields = $('#species, #color');
  selectFields.change(function () {
    var type = {}, name = [];
    selectFields.each(function () {
      var el = $(this), selectedEl = el.children(':selected');
      type[el.attr('id')] = selectedEl.val();
      name.push(selectedEl.text());
    });
    name = name.join(' ');
    Preview.displayLoading();
    $.ajax({
      url: '/pet_types.json',
      data: {
        'for': 'image',
        'species_id': type.species,
        'color_id': type.color
      },
      dataType: 'json',
      success: function (data) {
        var job;
        if(data) {
          job = new Preview.Job.Hash(data.image_hash);
          job.name = name;
          job.setAsCurrent();
        } else {
          Preview.notFound("We haven't seen a " + name + ". Have you?");
        }
      },
      error: function () {
        Preview.notFound("Error fetching preview. Try again?");
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
