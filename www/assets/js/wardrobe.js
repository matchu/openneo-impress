/*
  Needs:
    - AJAX error handling
    - Data caching
    - Tooltips
*/

var MainWardrobe = new function Wardrobe() {
  function buildQuery(data) {
    var query = [];
    function addToQuery(key, value) {
      query.push(key + '=' + encodeURIComponent(value));
    }
    
    $.each(data, function (key, value) {
      if($.isArray(value)) {
        $.each(value, function (i) {
          addToQuery(key+'[' + i + ']', this);
        });
      } else {
        addToQuery(key, value);
      }
    });
    
    return query.join('&');
  }

  function WardrobeObject() {
    this.addToCloset = function () {
      Closet.objects[this.id] = this;
    }
  }

  function WardrobeRequest(type, method, data, callback) {
    var query = data ? buildQuery(data) : '';
    
    $.getJSON('/get/' + type + '/' + method + '.json', query, callback);
  }
  
  var Closet = new function WardrobeCloset() {    
    this.objects = {};
    this.unavailable_object_ids = [];
    
    this.setUnavailableObjectIds = function (ids) {
      this.unavailable_object_ids = ids;
      View.modules.closet.updateObjectStatuses();
    }
    
    this.clearObjectStatuses = function () {
      this.unavailable_object_ids = [];
    }
  }

  var HashDaemon = new function WardrobeHashDaemon() {
    var data = null;
    
    this.get = function (key) {
      if(!data) parse();
      return data[key];
    }
    
    function parse() {
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
    
    this.set = function (key, value) {
      data[key] = value;
      update();
    }
    
    function update() {
      document.location.hash = buildQuery(data);
    }
  }
  
  var Outfit = new function WardrobeOutfit() {
    var Outfit = this, totalSWFsAppended = 0;
    
    this.pet_type = null;
    
    function addAssets(klass, assets) {
      $.each(assets, function() {
        var id = 'outfit-asset-' + (totalSWFsAppended++);
        $('<div id="' + id + '"></div>').appendTo('#outfit-preview');
        attrs = {
          'class': klass,
          'style': 'z-index: ' + this.depth
        }
        attrs['class'] += ' outfit-asset';
        if(this.is_body_specific == 1) attrs['class'] += ' body-specific-asset';
        swfobject.embedSWF(this.url, id, '100%', '100%', '9',
          '/assets/js/swfobject/expressInstall.swf', null,
          {wmode: 'transparent'},
          attrs);
      });
    }
    
    this.setPetType = function (species, color) {
      HashDaemon.set('species', species);
      HashDaemon.set('color', color);
    }
    
    function updateObjects() {
      var object_ids = HashDaemon.get('objects');
      Closet.clearObjectStatuses();
      
      WardrobeRequest('object', 'find', {
        'ids': object_ids
      }, function (object_data) {
        $.each(object_data, function () {
          object = $.extend(new WardrobeObject, this);
          object.addToCloset();
        });
        View.modules.closet.update();
      });
      
      WardrobeRequest('object_asset', 'findByParentIdsAndBodyId', {
        'parent_ids': object_ids,
        'body_id': Outfit.pet_type.body_id
      }, function (assets) {
        var unavailable_object_ids = $.extend([], object_ids);
        addAssets('object-outfit-asset', assets);
        $.each(assets, function () {
          var asset = this, i = unavailable_object_ids.indexOf(asset.parent_id);
          if(i != -1) {
            unavailable_object_ids.splice(i, 1);
          }
        });
        Closet.setUnavailableObjectIds(unavailable_object_ids);
      });
    }
    
    function updatePetType() {
      WardrobeRequest('pet_type', 'findBySpeciesAndColor', {
        'species_id': HashDaemon.get('species'),
        'color_id': HashDaemon.get('color')
      }, function (pet_type) {
        if(pet_type) {
          if(Outfit.pet_type && pet_type.body_id != Outfit.pet_type.body_id) {
            $('.body-specific-asset').remove();
          }
          $('.biology-outfit-asset').remove();
          Outfit.pet_type = pet_type;
          addAssets('biology-outfit-asset', pet_type.assets);
          updateObjects();
        } else {
          View.error('Pet type not found!');
        }
      });
    }
    
    this.update = updatePetType;
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
      toolbars.right.css('height', null);
      toolbars.bottom.width(available.width);
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
    
    $.each(toolbar_options, function (name, options) {
      toolbars[name] = $('#toolbar-' + name).resizable(
        $.extend(generic_toolbar_options, options)
      );
    });
    $(window).resize(onResize);
    onResize();
    
    this.modules = [];
    
    this.modules.closet = new function WardrobeClosetModule() {
      this.update = function () {
        var objects_wrapper = $('#closet-module-objects').html('');
        $.each(Closet.objects, function () {
          var object = $('<div></div>').attr({
            'id': 'closet-module-object-' + this.id,
            'class': 'closet-module-object'
          }).data('object_id', this.id);
          $('<img />').attr({
            'src': this.thumbnail_url,
            'title': this.description,
            'alt': ''
          }).appendTo(object);
          object.append(this.name).appendTo(objects_wrapper);
        });
        this.updateObjectStatuses();
      }
      
      this.updateObjectStatuses = function () {
        $('.closet-module-object').each(function () {
          var el = $(this);
          if($.inArray(el.data('object_id'), Closet.unavailable_object_ids) != -1) {
            el.addClass('closet-module-unavailable-object');
          }
        });
      }
    }
    
    this.modules.pet_type = new function WardrobePetTypeModule() {
      WardrobeRequest('pet_type', 'allColorsAndSpecies', null, function (data) {
        $.each(data, function (type, values) {
          var select = $('#pet-type-form-' + type),
            selected_value = HashDaemon.get(type);
          $.each(values, function () {
            var option = $('<option value="' + this.id + '">'
              + this.name + '</option>');
            if(this.id == selected_value) {
              option.attr('selected', 'selected');
            }
            option.appendTo(select);
          });
        });
        $('#pet-type-form').css('visibility', 'visible');
      });
      
      $('#pet-type-form').submit(function (e) {
        e.preventDefault();
        $.each(['species', 'color'], function () {
          var option = $('#pet-type-form-' + this + ' option:selected');
          HashDaemon.set(this, option.val());
        });
        Outfit.update();
      });
    }
    
    this.error = function (message) {
      alert(message);
    }
  }
  
  Outfit.update();
}
