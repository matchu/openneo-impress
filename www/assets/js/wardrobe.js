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
  
  function WardrobeObject() {
    this.addToCloset = function () {
      Closet.objects.push(this);
    }
  }
  
  var Closet = new function WardrobeCloset() {
    this.objects = [];
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
        var data_pair = this.split('='),
          key = decodeURIComponent(data_pair[0]),
          value = decodeURIComponent(data_pair[1]),
          matches = key.match(/(.+)\[([0-9]+)]/);
        if(matches) {
          if(!data[matches[1]]) data[matches[1]] = [];
          data[matches[1]][matches[2]] = value;
        } else {
          data[key] = value;
        }
      });
    }
  }
  
  var Outfit = new function WardrobeOutfit() {
    var Outfit = this, totalSWFsAppended = 0;
    
    this.pet_type = null;
    
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
    
    function updateObjects() {
      var object_ids = HashDaemon.get('objects');
      WardrobeRequest('object', 'find', {
        'ids': object_ids
      }, function (object_data) {
        var base_object = new WardrobeObject;
        $.each(object_data, function () {
          object = $.extend(base_object, this);
          object.addToCloset();
        });
      });
      WardrobeRequest('object_asset', 'findByParentIdsAndBodyId', {
        'parent_ids': object_ids,
        'body_id': Outfit.pet_type.body_id
      }, function (assets) {
        addAssets('object-pet-asset', assets);
      });
    }
    
    function updatePetType(callback) {
      WardrobeRequest('pet_type', 'findBySpeciesAndColor', {
        'species_id': HashDaemon.get('species'),
        'color_id': HashDaemon.get('color')
      }, function (pet_type) {
        Outfit.pet_type = pet_type;
        addAssets('biology-pet-asset', pet_type.assets);
        callback();
      });
    }
    
    this.initialize = function () {
      updatePetType(updateObjects);
    };
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
      ghost: true,
      stop: onResize
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
      onResize();
    });
  }
  
  Outfit.initialize();
}
