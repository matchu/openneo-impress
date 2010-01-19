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
  if(name) name = name[1];
  $('#name').val(name);
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
});
