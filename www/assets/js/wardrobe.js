/* jQuery plugin for mouseenter, mouseleave */

(function(b){function o(i){var f=2;b.each(i,function(g,l){if(b.isFunction(l)){f=g;return false}});return f}(function(){function i(a,c){return jQuery.event.proxy(a,function(d){if(this!==d.relatedTarget&&d.relatedTarget&&!g(this,d.relatedTarget)){d.type=c;a.apply(this,arguments)}})}function f(a,c,d){return jQuery.event.proxy(a,function(h){var k=this.parentNode;for(a.apply(this,arguments);k&&k!==d&&k!==h.relatedTarget;){b.multiFilter(c,[k])[0]&&a.apply(k,arguments);k=k.parentNode}})}var g=document.compareDocumentPosition?
function(a,c){return a.compareDocumentPosition(c)&16}:function(a,c){return a!==c&&(a.contains?a.contains(c):true)},l=b.fn.live,j=b.fn.die,e={mouseenter:"mouseover",mouseleave:"mouseout"};b.fn.live=function(a){var c=this,d=arguments,h=o(d),k=d[h];b.each(a.split(" "),function(n,m){n=k;if(e[m]){n=i(n,m);m=e[m]}d[0]=m;d[h]=n;l.apply(c,d)});return this};b.fn.die=function(a,c){if(/mouseenter|mouseleave/.test(a)){if(a=="mouseenter")a=a.replace(/mouseenter/g,"mouseover");if(a=="mouseleave")a=a.replace(/mouseleave/g,
"mouseout")}j.call(this,a,c);return this};b.fn.bubbleLive=function(){var a=arguments,c=o(a);a[c]=f(a[c],this.selector,this.context);b.fn.live.apply(this,a)};b.fn.liveHover=function(a,c){return this.live("mouseenter",a).live("mouseleave",c)}})();(function(){b.support.bubblingChange=!(b.browser.msie||b.browser.safari);if(!b.support.bubblingChange){var i=b.fn.live,f=b.fn.die;function g(j){return b.event.proxy(j,function(e){var a=b(e.target);if((e.type!=="keydown"||e.keyCode===13)&&a.is("input, textarea, select")){var c=
a.data("changeVal"),d=a.is(":checkbox, :radio"),h;if(d&&a.is(":enabled")&&e.type==="click"){h=a.is(":checked");if((e.target.type!=="radio"||h===true)&&e.type!=="change"&&c!==h){e.type="change";a.trigger(e)}}else if(!d){h=a.val();if(c!==undefined&&c!==h){e.type="change";a.trigger(e)}}h!==undefined&&a.data("changeVal",h)}})}function l(j){return b.event.proxy(j,function(e){if(e.type==="change"){var a=b(e.target),c=a.is(":checkbox, :radio")?a.is(":checked"):a.val();if(c===a.data("changeVal"))return false;
a.data("changeVal",c)}j.apply(this,arguments)})}b.fn.live=function(j){var e=this,a=arguments,c=o(a),d=a[c];if(j.indexOf("change")!=-1){b(this.context).bind("click focusin focusout keydown",g(d));d=l(d)}a[c]=d;i.apply(e,a);return this};b.fn.die=function(j,e){j.indexOf("change")!=-1&&b(this.context).unbind("click focusin focusout keydown",e);f.apply(this,arguments);return this}}})();(function(){b.support.focusInOut=!!b.browser.msie;b.support.focusInOut||b.each({focus:"focusin",blur:"focusout"},function(f,
g){b.event.special[g]={setup:function(){if(!this.addEventListener)return false;this.addEventListener(f,b.event.special[g].handler,true)},teardown:function(){if(!this.removeEventListener)return false;this.removeEventListener(f,b.event.special[g].handler,true)},handler:function(l){arguments[0]=b.event.fix(l);arguments[0].type=g;return b.event.handle.apply(this,arguments)}}});var i=null;b(document).bind("focusin",function(f){var g=f.realTarget||f.target;if(i&&i!==g){f.type="focusout";b(i).trigger(f);
f.type="focusin";f.target=g}i=g}).bind("focusout",function(){i=null})})()})(jQuery);

/*
  Needs:
    - AJAX error handling
    - Data caching
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
  
  function WardrobeRequest(type, method, data, callback) {
    var query = data ? buildQuery(data) : '';
    $.getJSON('/get/' + type + '/' + method + '.json', query, callback);
  }
  
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

  function WardrobeObject(data) {
    this.addToCloset = function () {
      var object_ids = Closet.getObjectIds();
      object_ids.push(this.id);
      HashDaemon.set('closet', object_ids);
    }
    
    this.addToOutfit = function () {
      var object_ids = Outfit.getObjectIds();
      object_ids.push(this.id);
      HashDaemon.set('objects', object_ids);
    }
    
    this.getAssetsByBodyId = function (body_id) {
      var body_cache = WardrobeObjectAsset.cache_by_body_and_parent_id[body_id],
        parent_cache;
      if(body_cache) {
        parent_cache = body_cache[this.id];
      }
      return parent_cache ? parent_cache : [];
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
      object = new WardrobeObject({id: id});
    }
    return object;
  }
  
  /* Modules */
  
  var Closet = new function WardrobeCloset() {    
    this.unavailable_object_ids = [];
    
    this.setUnavailableObjectIds = function (ids) {
      this.unavailable_object_ids = ids.toInt();
      View.modules.closet.updateObjectStatuses();
    }
    
    this.clearObjectStatuses = function () {
      this.unavailable_object_ids = [];
    }
    
    this.getObjectIds = function () {
      return HashDaemon.get('closet').toInt();
    }
    
    this.getObjects = function () {
      return $.map(HashDaemon.get('closet'), function (id) {
        return WardrobeObject.find(id);
      });
    }
    
    this.initialize = function () {
      if(!HashDaemon.get('closet')) {
        HashDaemon.set('closet', HashDaemon.get('objects'));
      }
      this.update();
    }
    
    this.update = function () {
      var object_ids = HashDaemon.get('closet');
      Closet.clearObjectStatuses();
      
      WardrobeRequest('object', 'find', {
        'ids': object_ids
      }, function (object_data) {
        $.each(object_data, function () {
          object = new WardrobeObject(this);
        });
        View.modules.closet.update();
      });
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
      console.dir(data);
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
    var Outfit = this;
    
    this.pet_type = null;
    
    function addAssets(asset_data, asset_type) {
      $.each(asset_data, function () {
        new asset_type(this);
      });
    }
    
    this.getAssets = function () {
      var assets = this.pet_type.assets;
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
    
    this.updateObjects = function () {
      var object_ids = $.grep(this.getObjectIds(), function (object_id) {
        return !WardrobeObject.find(object_id).hasAssetsWithBodyId(Outfit.pet_type.body_id);
      });
      
      function updateAssets() {
        var unavailable_object_ids = $.grep(object_ids.clone(),
          function (object_id) {
            return !WardrobeObject.find(object_id)
              .hasAssetsWithBodyId(Outfit.pet_type.body_id);
          });
        Closet.setUnavailableObjectIds(unavailable_object_ids);
        View.Outfit.update();
      }
      
      if(object_ids.length) {
        WardrobeRequest('object_asset', 'findByParentIdsAndBodyId', {
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
    
    function updatePetType() {
      var species = HashDaemon.get('species'), color = HashDaemon.get('color');
      if(
        !this.pet_type || species != this.pet_type.species_id ||
        color != this.pet_type.color_id
      ) {
        View.Outfit.hideBiologyAssets();
        WardrobeRequest('pet_type', 'findBySpeciesAndColor', {
          'species_id': species,
          'color_id': color
        }, function (pet_type) {
          if(pet_type) {
            if(Outfit.pet_type && pet_type.body_id != Outfit.pet_type.body_id) {
              View.Outfit.removeBodySpecificAssets();
            }
            pet_type.species_id = species;
            pet_type.color_id = color;
            Outfit.pet_type = pet_type;
            addAssets(pet_type.assets, WardrobeBiologyAsset);
            Outfit.updateObjects();
            View.Outfit.update();
          } else {
            View.error('Pet type not found!');
            View.Outfit.showBiologyAssets();
          }
        });
      } else {
        Outfit.updateObjects();
      }
    }
    
    // It feels silly, doesn't it? But updatePetType just starts the updating
    // *chain*, and isn't really the whole function, so I feel weird about
    // just plain calling it the update function.
    
    this.update = updatePetType;
    
    this.initialize = this.update;
  }
  
  var View = new function WardrobeView() {
    var View = this;
    
    this.Outfit = new function WardrobeViewOutfit() {
      this.hideBiologyAssets = function () {
        $('.biology-asset').hide();
      }
      
      this.removeBodySpecificAssets = function () {
        $('.body-specific-asset').remove();
      }
      
      this.showBiologyAssets = function () {
        $('.biology-asset').show();
      }
      
      this.update = function () {
        $('.outfit-asset').each(function () {
          var el = $(this), parent_id = el.attr('data-parent-id'), object;
          if(el.hasClass('object-asset')) {
            object = WardrobeObject.find(parent_id);
            if(!object.isWorn()) el.remove();
          } else {
            if(Outfit.pet_type.id != parent_id) el.remove();
          }
        });
        
        $.each(Outfit.getAssets(), function() {
          var is_object_asset = this.constructor == WardrobeObjectAsset;
          if(
            (is_object_asset && this.getObject().isWorn())
            || (!is_object_asset)
          ) {
            var id = 'outfit-asset-' + this.id + '-'
              + (is_object_asset ? 'object' : 'biology'),
              klass = 'outfit-asset ' +
                (is_object_asset ? 'object-asset' : 'biology-asset');
            if(!$('#' + id).length) {
              $('<div id="' + id + '"></div>')
                .appendTo('#outfit-preview');
              if(this.is_body_specific) klass += ' body-specific-asset';
              attrs = {
                'class': klass,
                'style': 'z-index: ' + this.depth,
                'data-parent-id': this.parent_id
              }
              swfobject.embedSWF(this.url, id, '100%', '100%', '9',
                '/assets/js/swfobject/expressInstall.swf', null,
                {wmode: 'transparent'},
                attrs);
            }
          }
        });
        
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
    
    this.modules = [];
    
    this.modules.closet = new function WardrobeClosetModule() {
      this.update = function () {
        var objects_wrapper = $('#closet-module-objects').html('');
        $.each(Closet.getObjects(), function () {
          var object = $('<div></div>').attr({
            'id': 'object-' + this.id,
            'class': 'object'
          }).data('object_id', this.id);
          $('<img />').attr({
            'src': this.thumbnail_url,
            'title': this.description,
            'alt': '',
            'height': 80,
            'width': 80
          }).appendTo(object);
          object.append('<span>' + this.name + '</span>')
            .appendTo(objects_wrapper);
        });
        this.updateObjectStatuses();
      }
      
      this.updateObjectStatuses = function () {
        $('.object').each(function () {
          var el = $(this), object = WardrobeObject.find(el.data('object_id'));
          el.toggleClass('unavailable-object', object.isUnavailable());
          el.toggleClass('worn-object', object.isWorn());
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
        var toSet = {};
        $.each(['species', 'color'], function () {
          toSet[this] = $('#pet-type-form-' + this + ' option:selected').val();
        });
        HashDaemon.set(toSet);
        Outfit.update();
      });
    }
    
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

    this.error = function (message) {
      alert(message);
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
    
    $('.object-action-uncloset').live('click', function (e) {
      var el = $(this).parent(),
        object = WardrobeObject.find(el.data('object_id'));
      e.preventDefault();
      object.removeFromCloset();
      View.Outfit.update();
      View.modules.closet.update();
    });
  }
  
  Outfit.initialize();
  Closet.initialize();
}
