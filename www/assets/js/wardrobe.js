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
    this.update = function () {
      new WardrobeRequest('pet_type', 'getAssetsBySpeciesAndColor', {
        'species_id': HashDaemon.get('species'),
        'color_id': HashDaemon.get('color')
      });
    }
  }
  
  var View = new function WardrobeView() {
    var View = this;
    
    var toolbars = {};
    
    function onResize() {
      var null_position = {top: null, left: null};
      $.each(toolbars, function () {
        this.css(null_position);
      });
      toolbars.bottom.width($(window).width()-toolbars.right.width());
      toolbars.right.css('height', null);
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
  
  Outfit.update();
}
