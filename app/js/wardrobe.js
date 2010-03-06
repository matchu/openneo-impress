/*
  Needs:
    - AJAX error handling
    - Loading messages
*/

Array.prototype.removeValue = function (value) {
  var i = $.inArray(value, this);
  if(i != -1) this.splice(i, 1);
}

Array.prototype.clone = function () {
  return this.splice(0);
}

Array.prototype.toInt = function () {
  return $.map(this, function (x) { return parseInt(x) });
}

var MainWardrobe = new function Wardrobe() {
  /* Helper Functions */
  
  function buildQuery(data) {
    var query = [];
    function addToQuery(key, value) {
      query.push(key + '=' + encodeURIComponent(value));
    }
    
    $.each(data, function (key, value) {
      if($.isArray(value)) {
        $.each(value, function (i) {
          addToQuery(key+'[]', this);
        });
      } else {
        addToQuery(key, value);
      }
    });
    
    return query.join('&');
  }
  
  function WardrobeRequest(path, data, callback, options) {
    var query = data ? buildQuery(data) : '',
      key = path + '?' + query;
    if($.inArray(key, WardrobeRequest.requestsLoading) == -1) {
      WardrobeRequest.requestsLoading.push(key);
      $.ajax($.extend(options, {
        url: path,
        data: query,
        dataType: 'json',
        success: callback,
        complete: function () {
          WardrobeRequest.requestsLoading.removeValue(key);
        }
      }));
    }
  }
  WardrobeRequest.requestsLoading = [];
  
  /* Object declarations */
  
  function WardrobeAsset(data) {
    var body_cache, parent_cache, body_id = Outfit.pet_type.body_id;

    data.id = parseInt(data.id);
    data.parent_id = parseInt(data.parent_id);
    
    for(var key in data) {
      this[key] = data[key];
    }
    
    this.constructor.cache[this.id] = this;
    
    body_cache = this.constructor.cache_by_body_and_parent_id[body_id];
    if(!body_cache) {
      // double-assign
      body_cache = this.constructor.cache_by_body_and_parent_id[body_id] = {};
    }
    parent_cache = body_cache[this.parent_id];
    if(!parent_cache) {
      // double-assign
      parent_cache = body_cache[this.parent_id] = [];
    }
    parent_cache.push(this);
  }
  
  function WardrobeObjectAsset(data) {
    this.inheritsFrom = WardrobeAsset;
    this.inheritsFrom(data);
    
    this.is_body_specific = this.is_body_specific == '1';
    
    this.getObject = function () {
      return WardrobeObject.find(this.parent_id);
    }
  }
  
  function WardrobeBiologyAsset(data) {
    this.inheritsFrom = WardrobeAsset;
    this.inheritsFrom(data);
  }
  
  $.each([WardrobeObjectAsset, WardrobeBiologyAsset], function () {
    this.cache = {};
    this.find = function (id) {
      id = parseInt(id);
      return this.cache[id];
    }
    
    this.cache_by_body_and_parent_id = {};
  });

  function WardrobeObject(data, is_placeholder) {
    this.is_placeholder = is_placeholder ? true : false;
    
    this.addToCloset = function () {
      var object_ids = Closet.getObjectIds();
      object_ids.push(this.id);
      HashDaemon.set('closet', object_ids);
    }
    
    this.addToOutfit = function () {
      if(!this.isCloseted()) this.addToCloset();
      var object_ids = Outfit.getObjectIds();
      object_ids.push(this.id);
      HashDaemon.set('objects', object_ids);
      Outfit.removeObjectsConflictingWith(this);
    }
    
    this.getAssetsByBodyId = function (body_id) {
      var body_cache = WardrobeObjectAsset.cache_by_body_and_parent_id[body_id],
        parent_cache;
      if(body_cache) {
        parent_cache = body_cache[this.id];
      }
      return parent_cache ? $.extend(true, [], parent_cache) : [];
    }

    this.hasAssetsWithBodyId = function (body_id) {
      return this.getAssetsByBodyId(body_id).length > 0;
    }
    
    this.isAvailable = function () {
      return !this.isUnavailable();
    }
    
    this.isCloseted = function () {
      return $.inArray(this.id, Closet.getObjectIds()) != -1;
    }
    
    this.isUnavailable = function () {
      return $.inArray(this.id, Closet.unavailable_object_ids) != -1;
    }
    
    this.isWorn = function () {
      return this.isAvailable() &&
        $.inArray(this.id, Outfit.getObjectIds()) != -1;
    }
    
    this.removeFromCloset = function () {
      this.removeFromOutfit();
      var object_ids = Closet.getObjectIds();
      object_ids.removeValue(this.id);
      HashDaemon.set('closet', object_ids);
    }
    
    this.removeFromOutfit = function () {
      var object_ids = Outfit.getObjectIds();
      object_ids.removeValue(this.id);
      HashDaemon.set('objects', object_ids);
    }
    
    data.id = parseInt(data.id);
    
    for(var key in data) {
      this[key] = data[key];
    }
    
    WardrobeObject.cache[this.id] = this;
  }
  
  WardrobeObject.cache = {};
  
  WardrobeObject.find = function (id) {
    id = parseInt(id);
    var object = WardrobeObject.cache[id];
    if(!object) {
      object = new WardrobeObject({id: id}, true);
    }
    return object;
  }
  
  /* Modules */
  
  var Closet = new function WardrobeCloset() {    
    this.unavailable_object_ids = [];
    
    this.setUnavailableObjectIds = function (ids) {
      this.unavailable_object_ids = ids.toInt();
      View.updateObjectStatuses();
    }
    
    this.clearObjectStatuses = function () {
      this.unavailable_object_ids = [];
    }
    
    this.getObjectIds = function () {
      return HashDaemon.get('closet') ? HashDaemon.get('closet').toInt() : [];
    }
    
    this.getObjects = function () {
      return $.map(HashDaemon.get('closet'), function (id) {
        return WardrobeObject.find(id);
      });
    }
    
    this.initialize = function () {
      if(HashDaemon.get('objects') && !HashDaemon.get('closet')) {
        HashDaemon.set('closet', HashDaemon.get('objects'));
      }
      this.update();
    }
    
    this.update = function () {
      var object_ids = HashDaemon.get('closet');
      if(object_ids) {
        object_ids = $.grep(HashDaemon.get('closet'), function (object_id) {
          return WardrobeObject.find(object_id).is_placeholder;
        });
        if(object_ids.length) {
          Closet.clearObjectStatuses();
          
          WardrobeRequest('/objects.json', {
            'ids': object_ids
          }, function (object_data) {
            $.each(object_data, function () {
              object = new WardrobeObject(this);
            });
            View.modules.closet.update();
          });
        }
      }
    }
  }

  var HashDaemon = new function WardrobeHashDaemon() {
    var data = null, current_hash;
    
    this.get = function (key) {
      if(!data) parse();
      return data[key];
    }
    
    function getHash() {
      return (document.location.hash || document.location.search).substr(1);
    }
    
    function parse() {
      data = {};
      var new_hash = getHash(), new_hash_data = new_hash.split('&');
      $.each(new_hash_data, function() {
        var data_pair = this.split('='),
          key = decodeURIComponent(data_pair[0]),
          value = decodeURIComponent(data_pair[1]),
          matches = key.match(/(.+)\[\]/);
        if(matches) {
          if(!data[matches[1]]) data[matches[1]] = [];
          data[matches[1]].push(value);
        } else {
          data[key] = value;
        }
      });
      current_hash = new_hash;
    }
    
    function setOne(key, value) {
      data[key] = value;
    }
    
    this.set = function (key_or_object, value) {
      if(typeof key_or_object == 'object') {
        $.each(key_or_object, setOne);
      } else {
        setOne(key_or_object, value);
      }
      update();
    }
    
    function update() {
      document.location.hash = buildQuery(data);
    }
    
    setInterval(function () {
      if(getHash() != current_hash) {
        parse();
        Outfit.update();
        Closet.update();
      }
    }, 100);
  }
  
  var Outfit = new function WardrobeOutfit() {
    var Outfit = this, conflict_check_queue = [];
    
    this.biology_assets = [];
    this.pet_type = null;
    this.restricted_zones = [];
    
    function addAssets(asset_data, asset_type) {
      $.each(asset_data, function () {
        new asset_type(this);
      });
    }
    
    this.getAssets = function () {
      var assets = Outfit.biology_assets;
      $.each(this.getObjectIds(), function () { 
        var object = WardrobeObject.find(this);
        assets = assets.concat(object.getAssetsByBodyId(Outfit.pet_type.body_id));
      });
      return assets;
    }
    
    this.getObjectIds = function () {
      var object_ids = HashDaemon.get('objects');
      return object_ids ? object_ids.toInt() : [];
    }
    
    this.getObjects = function () {
      return $.map(this.getObjectIds(), function (id) {
        return WardrobeObject.find(id);
      });
    }
    
    this.removeObjectsConflictingWith = function (object) {
      conflict_check_queue.push(object);
    }
    
    this.removeObjectsConflictingWithQueue = function () {
      $.each(conflict_check_queue, function () {
        var object1 = this,
          assets1 = this.getAssetsByBodyId(Outfit.pet_type.body_id);
        $.each(assets1, function () {
          var asset1 = this;
          $.each(Outfit.getObjects(), function () {
            var assets2;
            if(object1.id != this.id) {
              assets2 = this.getAssetsByBodyId(Outfit.pet_type.body_id);
              for(var i in assets2) {
                if(assets2[i].zone_id == asset1.zone_id) {
                  this.removeFromOutfit();
                }
              }
            }
          });
        });
      });
      conflict_check_queue = [];
    }
    
    this.setRestrictedZones = function () {
      var restrictors = this.getObjects().concat(Outfit.biology_assets);
      this.restricted_zones = [];
      $.each(restrictors, function () {
        var i, offset = 0;
        if(this.zones_restrict) {
          while((i = this.zones_restrict.indexOf('1', offset)) != -1) {
            var zone = i + 1;
            Outfit.restricted_zones.push(zone);
            offset = zone;
          }
        }
      });
    }
    
    this.updateObjects = function () {
      var object_ids = $.grep(this.getObjectIds(), function (id) {
        return !WardrobeObject.find(id).hasAssetsWithBodyId(Outfit.pet_type.body_id);
      });
      
      function updateAssets() {
        var unavailable_object_ids = $.grep(object_ids.clone(),
          function (object_id) {
            return !WardrobeObject.find(object_id)
              .hasAssetsWithBodyId(Outfit.pet_type.body_id);
          });
        Outfit.setRestrictedZones();
        Outfit.removeObjectsConflictingWithQueue();
        Closet.setUnavailableObjectIds(unavailable_object_ids);
        View.Outfit.update();
      }
      
      if(object_ids.length) {
        WardrobeRequest('/object_assets.json', {
          'parent_ids': object_ids,
          'body_id': Outfit.pet_type.body_id
        }, function (assets) {
          addAssets(assets, WardrobeObjectAsset);
          updateAssets();
        });
      } else {
        updateAssets();
      }
    }
    
    function updateBiologyAssets() {
      if(!Outfit.pet_type) return false;
      var body_assets = WardrobeBiologyAsset.cache_by_body_and_parent_id[Outfit.pet_type.body_id],
        parent_assets, pet_state_id = HashDaemon.get('state');
      if(body_assets) parent_assets = body_assets[pet_state_id];
      if(parent_assets) {
        Outfit.biology_assets = parent_assets;
        Outfit.setRestrictedZones();
        View.Outfit.update();
      } else {
        WardrobeRequest('/biology_assets.json', {
          'parent_id': pet_state_id
        }, function (assets) {
          Outfit.biology_assets = assets;
          addAssets(assets, WardrobeBiologyAsset);
          Outfit.setRestrictedZones();
          View.Outfit.update();
        });
      }
    }
    
    this.updatePetState = function (id) {
      HashDaemon.set('state', id);
      updateBiologyAssets();
    }
    
    function updatePetType() {
      var species = HashDaemon.get('species'), color = HashDaemon.get('color'),
        error_options;
      if(
        !Outfit.pet_type || species != Outfit.pet_type.species_id ||
        color != Outfit.pet_type.color_id
      ) {
        View.Outfit.hideBiologyAssets();
        WardrobeRequest('/pet_types.json', {
          'for': 'wardrobe',
          'species_id': species,
          'color_id': color
        }, function (pet_type) {
          var hash_state = HashDaemon.get('state'), should_set_hash_state;
          if(pet_type) {
            if(Outfit.pet_type && pet_type.body_id != Outfit.pet_type.body_id) {
              View.Outfit.removeBodySpecificAssets();
            }
            pet_type.species_id = species;
            pet_type.color_id = color;
            Outfit.pet_type = pet_type;
            should_set_hash_state = !hash_state ||
              $.inArray(parseInt(hash_state), pet_type.pet_state_ids) == -1;
            if(should_set_hash_state) {
              HashDaemon.set('state', pet_type.pet_state_ids[0]);
            }
            updateBiologyAssets();
            View.modules.pet_state.update();
            Outfit.updateObjects();
          } else {
            error_options = {
              title: 'Pet not found!'
            };
            if(!Outfit.pet_type) {
              error_options.close = function () {
                window.location = '/';
              }
              error_options.modal = true;
            }
            View.error("We haven't seen this pet type before. If it's out there, " +
              "please help us out by " +
              "<a href='http://beta.impress.openneo.net/pet_types/needed'>" +
              "helping us find it</a>! Thanks!", error_options);
            View.Outfit.showBiologyAssets();
            if(Outfit.pet_type) {
              HashDaemon.set({
                'color': Outfit.pet_type.color_id,
                'species': Outfit.pet_type.species_id
              });
              View.modules.pet_type.update();
            }
          }
        });
      } else {
        Outfit.updateObjects();
      }
    }    
    
    
    // It feels silly, doesn't it? But updatePetType just starts the updating
    // *chain*, and isn't really the whole function, so I feel weird about
    // just plain calling it the update function.
    
    this.update = function () {
      updatePetType();
      updateBiologyAssets();
    }
    
    this.initialize = this.update;
  }
  
  var Search = new function WardrobeSearch() {
    var objects = [];
    
    this.getObjects = function () {
      return objects;
    }
    
    $('#search-form').submit(function (e) {
      e.preventDefault();
      $('#search-module-error').hide();
      WardrobeRequest('/objects.json', {
        search: $('#search-form-query').val()
      }, function (object_data) {
        objects = [];
        $.each(object_data, function () {
          objects.push(new WardrobeObject(this));
        });
        View.modules.search.update();
      }, {
        error: function (xhr) {
          $('#search-module-error').text(xhr.responseText).show();
          objects = [];
          View.modules.search.update();
        }
      });
    });
  }
  
  var View = this.View = new function WardrobeView() {
    var View = this;
    
    this.Outfit = new function WardrobeViewOutfit() {
      var updatePendingFlash = false;
      
      this.hideBiologyAssets = function () {
        //$('.biology-asset').hide();
      }
      
      this.removeBodySpecificAssets = function () {
        $('.body-specific-asset').remove();
      }
      
      this.showBiologyAssets = function () {
        $('.biology-asset').show();
      }
      
      this.initialize = function () {
        swfobject.embedSWF(
          '/assets/swf/preview.swf',
          'outfit-preview-swf',
          '100%',
          '100%',
          '9',
          '/assets/js/swfobject/expressInstall.swf',
          {'swf_assets_path': '/assets'},
          {'wmode': 'transparent'}
        );
      }
      
      this.setFlashIsReady = function () {
        if(updatePendingFlash) {
          updatePendingFlash = false;
          View.Outfit.update();
        }
      }
      
      this.update = function update() {
        var jEl, el;
        if(updatePendingFlash) return false;
        jEl = $('#outfit-preview-swf');
        el = jEl.get(0);
        if(el.setAssets) {
          var visible_assets = $.grep(Outfit.getAssets(), function(asset) {
            return $.inArray(parseInt(asset.zone_id), Outfit.restricted_zones) == -1;
          });
          el.setAssets(visible_assets);
        } else {
          updatePendingFlash = true;
        }

        this.Watermark.update();
      }
      
      this.Watermark = new function ViewOutfitWatermark () {
        var Watermark = this, currentClass, units = {
          r: [0, .2],
          e: [0, .7],
          s: [.5, .2],
          t: [.5, .7],
          m: [.25, .45]
        }, readyToUpdate = false;
        
        this.update = function () {
          function doUpdate() {
            var stylesheet = $('#' + currentClass + 's'), el, newClass = '';
            
            for(var i = 0; i < 25; i++) {
              newClass += String.fromCharCode(Math.random()*26 + 97);
            }
            
            if(stylesheet.length) {
              stylesheet.remove();
            }
            
            for(var unit_id in units) {
              el = $('.' + currentClass + unit_id);
              if(!el.length) {
                el = $('<div>The Wardrobe</div>');
                el.attr('class', newClass + unit_id).appendTo(document.body);
              } else {
                el.attr('class', newClass + unit_id);
              }
            }
            
            currentClass = newClass;
            Watermark.update_position();
          }
          
          if(readyToUpdate) {
            doUpdate();
          } else {
            $(function () {
              doUpdate();
              readyToUpdate = true;
            });
          }
        }
        
        this.update_position = function () {
          function doUpdate() {
            var preview = $('#outfit-preview'), height = preview.height(),
              width = preview.width(), offset = preview.offset(),
              classList = '', css = '';
            $.each(units, function (unit_id, unit_offset) {
              css += '.' + currentClass + unit_id + ' {'
                // IE doesn't support text-shadow, so more opacity
                + 'opacity: .1; filter:alpha(opacity=30);'
                + 'position: absolute;'
                + 'left: ' + (width * unit_offset[0] + offset.left) + 'px;'
                + 'top: ' + (height * unit_offset[1] + offset.top) + 'px;'
                + 'width: ' + (width / 2) + 'px;'
                + 'color: #fff;'
                + 'font-weight: bold;'
                + 'text-align: center;'
                + 'text-shadow: #000 1px 1px;'
                + 'z-index: 100;'
                + '}';
            });
            
            $('<style type="text/css">' + css + '</style>')
              .attr('id', currentClass + 's').appendTo('head');
            $('#outfit-preview').css('zIndex', 1);
          }
          
          if(readyToUpdate) {
            doUpdate();
          } else {
            $(function () {
              doUpdate();
              readyToUpdate = true;
            });
          }
        }
      }
    }
    
    function WardrobeObjectModule(objects_wrapper_query, object_owner) {
      this.afterUpdate = function () {}
      this.object_owner = object_owner;
      this.objects_wrapper_query = objects_wrapper_query;
      this.update = function () {
        var objects_wrapper = $(this.objects_wrapper_query).html(''),
          last_object;
        $.each(this.object_owner.getObjects(), function () {
          var object = $('<li></li>').attr({
            'id': 'object-' + this.id,
            'class': 'object'
          }).data('object_id', this.id);
          $('<img />').attr({
            'src': this.thumbnail_url,
            'alt': '',
            'height': 80,
            'width': 80
          }).appendTo(object);
          object.append('<span>' + this.name + '</span>')
            .wrapInner('<div></div>').appendTo(objects_wrapper);
        });
        View.updateObjectStatuses();
        this.afterUpdate();
      }
    }
    
    this.modules = [];
    
    this.modules.closet =
      new WardrobeObjectModule('#closet-module-objects', Closet);
    
    this.modules.pet_state = new function WardrobePetStateModule() {
      this.update = function () {
        var module = $('#pet-state-list').html(''), i = 0;
        $.each(Outfit.pet_type.pet_state_ids, function () {
          var id = this, a = $('<a/>', { // <3 new 1.4 constructor syntax
            href: '#',
            text: 'State #' + (++i),
            click: function (e) {
              e.preventDefault();
              Outfit.updatePetState(id);
            }
          }).wrap('<li/>').parent().appendTo(module);
        });
      }
    }
    
    this.modules.pet_type = new function WardrobePetTypeModule() {
      this.update = function () {
        $.each(['color', 'species'], function () {
          var selected_value = HashDaemon.get(this);
          findSelectFor(this).children('option').each(function () {
            var el = $(this);
            if(el.val() == selected_value) {
              el.attr('selected', 'selected');
            }
          });
        });
      }
      
      function findSelectFor(type) {
        return $('#pet-type-form-' + type);
      }
      
      WardrobeRequest('/pet_attributes.json', null, function (data) {
        $.each(data, function (type, values) {
          var select = findSelectFor(type);
          $.each(values, function () {
            var option = $('<option value="' + this.id + '">'
              + this.name + '</option>');
            option.appendTo(select);
          });
        });
        View.modules.pet_type.update();
        $('#pet-type-form').css('visibility', 'visible');
      });
      
      $('#pet-type-form').submit(function (e) {
        e.preventDefault();
        var toSet = {};
        $.each(['species', 'color'], function () {
          toSet[this] = $('#pet-type-form-' + this + ' option:selected').val();
        });
        HashDaemon.set(toSet);
        Outfit.update();
      });
    }
    
    this.modules.search =
      new WardrobeObjectModule('#search-module-objects', Search);
    this.modules.search.afterUpdate = function () {
      var objects = this.object_owner.getObjects(),
        wrapper = $(this.objects_wrapper_query),
        width = wrapper.children('.object:first').outerWidth()*objects.length;
      wrapper.width(width);
      $('#toolbar-bottom').animate({
        height: wrapper.outerHeight() + wrapper.position().top
      }, 250, onResize);
    }
      
    this.updateObjectStatuses = function () {
      $('.object').each(function () {
        var el = $(this), object = WardrobeObject.find(el.data('object_id'));
        el.toggleClass('unavailable-object', object.isUnavailable());
        el.toggleClass('worn-object', object.isWorn());
      });
    }
    
    function onResize() {
      var null_position = {top: null, left: null},
        jWindow = $(window);
        available = {
          height: jWindow.height()-toolbars.bottom.outerHeight(),
          width: jWindow.width()-toolbars.right.outerWidth()
        }
      $.each(toolbars, function () {
        this.css(null_position);
      });
      toolbars.right.css('height', null);
      toolbars.bottom.width(available.width);
      $('#toolbar-float').css('right', toolbars.right.outerWidth());
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
      View.Outfit.Watermark.update_position();
      $('#object-description').css({
        bottom: toolbars.bottom.outerHeight(),
        right: toolbars.right.outerWidth()
      });
    }
    
    var toolbars = {};
    
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
    
    $('.object').live('mouseenter', function (e) {
      var el = $(this), descriptionEl = $('#object-description');
      if(!el.children('.object-action').length) {
        var object = WardrobeObject.find(el.data('object_id')), error = '';
        
        function addAction(name) {
          var klass = name.toLowerCase();
          $('<a href="#" class="object-action object-action-' + klass + '">'
            + name + '</a>').appendTo(el);
        }
        
        if(object.isWorn()) {
          addAction('Unwear');
        } else {
          addAction('Wear');
        }
        
        if(object.isCloseted()) {
          addAction('Uncloset');
        } else {
          addAction('Closet');
        }
        
        if(object.isUnavailable()) {
          error = '<p class="ui-state-error">' +
            "We haven't seen this body type wearing this item before. " +
            'If you have, go to the homepage and add the pet, so we can ' +
            'get that data! Thanks!</p>'
        }
        
        descriptionEl.html(
          '<h1>'+
            object.name +
            ' (' + [object.rarity, object.rarity_index].join(' - ') + ')' +
          '</h1>' +
          '<p>' + object.description + '</p>' +
          error +
          '<dl>' +
            '<dt>Type</dt><dd>' + object.type + '</dd>' +
            '<dt>Est. Price</dt><dd>' + object.price + '</dd>' +
          '</dl>'
        ).css('backgroundImage', 'url('+object.thumbnail_url+')').show();
      }
    }).live('mouseleave', function () {
      $(this).children('.object-action').remove();
      $('#object-description').hide();
    });

    this.error = function (message, options) {
      var dialog = $('#error-dialog');
      if(dialog.length) {
        dialog.dialog('destroy');
      } else {
        dialog = $('<div/>', {id: 'error-dialog'});
      }
      dialog.html(message);
      dialog.dialog($.extend({
        title: 'Uh oh! Error!'
      }, options));
    }
    
    $('.object-action-wear').live('click', function (e) {
      var el = $(this).parent(),
        object = WardrobeObject.find(el.data('object_id'));
      e.preventDefault();
      object.addToOutfit();
      Outfit.updateObjects();
      View.modules.closet.update();
    });
    
    $('.object-action-unwear').live('click', function (e) {
      var el = $(this).parent(),
        object = WardrobeObject.find(el.data('object_id'));
      e.preventDefault();
      object.removeFromOutfit();
      View.Outfit.update();
      View.modules.closet.update();
    });
    
    $('.object-action-closet').live('click', function (e) {
      var el = $(this).parent(),
        object = WardrobeObject.find(el.data('object_id'));
      e.preventDefault();
      object.addToCloset();
      View.modules.closet.update();
    });
    
    $('.object-action-uncloset').live('click', function (e) {
      var el = $(this).parent(),
        object = WardrobeObject.find(el.data('object_id'));
      e.preventDefault();
      if(el.parents('#closet-module').length) {
        $('#object-description').hide();
      }
      object.removeFromCloset();
      View.Outfit.update();
      View.modules.closet.update();
    });
  }
  
  View.Outfit.initialize();
  Outfit.initialize();
  Closet.initialize();
}

var ef = function () {};

function log(str) {
  if(typeof console != 'undefined' && typeof console.log != 'undefined') {
    console.log(str);
  }
}

function dir(obj) {
  if(typeof console != 'undefined' && typeof console.dir != 'undefined') {
    console.dir(obj);
  }
}
