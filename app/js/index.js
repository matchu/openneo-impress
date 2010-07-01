function petImage(id, size) {
  return 'http://pets.neopets.com/' + id + '/1/' + size + '.png';
}

var preview_el = $('#pet-preview'),
  img_el = preview_el.find('img'),
  response_el = preview_el.find('span'),
  name_el = $('#name');

preview_el.click(function () {
  name_el.val(Preview.Job.current.name).closest('form').submit();
});

var Preview = {
  clear: function () {
    if(typeof Preview.Job.fallback != 'undefined') Preview.Job.fallback.setAsCurrent();
  },
  displayLoading: function () {
    preview_el.addClass('loading');
    response_el.text('Loading...');
  },
  notFound: function (str) {
    preview_el.addClass('hidden');
    response_el.text(str);
  },
  updateWithName: function () {
    var name = name_el.val(), job;
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

$.get('/spotlight_pets.txt', function (data) {
  var names = data.split('\n'), i = Math.floor(Math.random()*(names.length-1));
  Preview.Job.fallback = new Preview.Job.Name(names[i]);
  if(!Preview.Job.current) {
    Preview.Job.fallback.setAsCurrent();
  }
});

Preview.Job = function (key, base) {
  var job = this,
    quality = 2;
  job.loading = false;
  
  function getImageSrc() {
    return petImage(base + '/' + key, quality);
  }
  
  function load() {
    job.loading = true;
    img_el.attr('src', getImageSrc());
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
  
  var query = {};
  $.each(document.location.search.substr(1).split('&'), function () {
    var split_piece = this.split('=');
    if(split_piece.length == 2) {
      query[split_piece[0]] = split_piece[1];
    }
  });
  
  if(query.name) {
    name_el.val(query.name);
    if(query.species && query.color) {
      var notice = $('<div></div>', {
          'class': 'notice',
          'html': "Thanks for showing us <strong>" + query.name + "</strong>! " +
            "Keep up the good work!"
        }),
        image = $('<img/>', {
          'class': 'inline-image',
          'src': petImage('cpn/' + query.name, 1)
        });
      image.prependTo(notice);
      notice.prependTo('#container');
    }
  }
  Preview.updateWithName();
  
  name_el.keyup(function () {
    if(previewWithNameTimeout) {
      clearTimeout(previewWithNameTimeout);
      Preview.Job.current.loading = false;
    }
    previewWithNameTimeout = setTimeout(Preview.updateWithName, 250);
  });
  
  img_el.load(function () {
    if(Preview.Job.current.loading) {
      Preview.Job.loading = false;
      Preview.Job.current.increaseQualityIfPossible();
      preview_el.removeClass('loading').removeClass('hidden').addClass('loaded');
      response_el.text(Preview.Job.current.name);
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
  
  $.getJSON('http://blog.openneo.net/api/read/json?callback=?', function (data) {
    var post = data.posts[0], el = $('#blog-preview'),
      url = post['url-with-slug'], header = "Here's the latest!", body = '',
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
      body += '&hellip;';
    }
    el.find('h4').text(header).wrapInner($('<a/>', {href: url}));
    el.find('p').html(body);
    $('<a/>', {'id': 'read-more', href: url, text: 'read more'}).appendTo(el.find('div'));
    if(image) {
      el.find('img').attr('src', image).parent().attr('href', url);
    }
  });
});
