var MainWardrobe = new function Wardrobe() {
  function WardrobeRequest(type, method, data, callback) {
    var query = [];
    
    function addToQuery(key, value) {
      query.push(key + '=' + encodeURIComponent(value));
    }
    
    $.each(data, function (key, value) {
      if($.isArray(value)) {
        $.each(value, function () {
          addToQuery(key+'[]', this);
        });
      } else {
        addToQuery(key, value);
      }
    });
    
    query = query.join('&');
    $.getJSON('/get/' + type + '/' + method + '.json', query, callback);
  }

  var HashDaemon = new function WardrobeHashDaemon() {
    var data = null;
    
    this.get = function (key) {
      if(!data) update();
      return data[key];
    }
    
    function update() {
      data = {};
      var new_hash = document.location.hash, new_hash_data;
      if(!new_hash) new_hash = document.location.search;
      new_hash = new_hash.substr(1);
      new_hash_data = new_hash.split('&');
      $.each(new_hash_data, function() {
        var data_pair = this.split('=');
        data[data_pair[0]] = data_pair[1];
      });
    }
  }
  
  var Outfit = new function WardrobeOutfit() {
    var totalSWFsAppended = 0;
    
    function addAssets(klass, assets) {
      $.each(assets, function() {
        var id = 'outfit-asset-' + (totalSWFsAppended++);
        $('<div id="' + id + '"></div>').appendTo('#outfit-preview');
        swfobject.embedSWF(this.url, id, '100%', '100%', '9',
          '/assets/js/swfobject/expressInstall.swf', null,
          {wmode: 'transparent'},
          {
            'class': klass,
            'style': 'z-index: ' + this.depth
          });
      });
    }
    
    function updateBiology() {
      new WardrobeRequest('pet_type', 'getAssetsBySpeciesAndColor', {
        'species_id': HashDaemon.get('species'),
        'color_id': HashDaemon.get('color')
      }, function (assets) {
        addAssets('biology-pet-asset', assets);
      });
    }
    
    this.initialize = updateBiology;
  }
  
  var View = new function WardrobeView() {
    var View = this;
    
    var toolbars = {};
    
    function onResize() {
      var null_position = {top: null, left: null},
        available = {
          height: $(window).height()-toolbars.bottom.height(),
          width: $(window).width()-toolbars.right.width()
        }
      $.each(toolbars, function () {
        this.css(null_position);
      });
      toolbars.bottom.width(available.width);
      toolbars.right.css('height', null);
      if(available.height > available.width) {
        $('#outfit-preview').css({
          height: available.width,
          left: null,
          width: available.width,
          top: (available.height - available.width) / 2
        });
      } else {
        $('#outfit-preview').css({
          height: available.height,
          left: (available.width - available.height) / 2,
          width: available.height,
          top: null
        });
      }
    }
    
    var generic_toolbar_options = {
      resize: onResize
    };
    
    var toolbar_options = {
      bottom: {
        handles: 'n'
      },
      right: {
        handles: 'w'
      }
    };
    
    $(document).ready(function () {
      $.each(toolbar_options, function (name, options) {
        toolbars[name] = $('#toolbar-' + name).resizable(
          $.extend(generic_toolbar_options, options)
        );
      });
      $(window).resize(onResize);
    });
  }
  
  Outfit.initialize();
}
