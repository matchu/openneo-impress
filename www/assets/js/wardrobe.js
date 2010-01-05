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
      var object_ids = Closet.getObjectIds(), i = object_ids.indexOf(this.id);
      object_ids.splice(i, 1);
      HashDaemon.set('closet', object_ids);
    }
    
    this.removeFromOutfit = function () {
      var object_ids = Outfit.getObjectIds(), i = object_ids.indexOf(this.id);
      object_ids.splice(i, 1);
      HashDaemon.set('objects', object_ids);
    }
    
    data.id = parseInt(data.id);
    
    for(var key in data) {
      this[key] = data[key];
    }
    
    if(!WardrobeObject.cache[this.id]) {
      WardrobeObject.cache[this.id] = this;
    }
  }
  
  WardrobeObject.cache = {};
  
  WardrobeObject.find = function (id) {
    return WardrobeObject.cache[id];
  }

  function WardrobeRequest(type, method, data, callback) {
    var query = data ? buildQuery(data) : '';
    $.getJSON('/get/' + type + '/' + method + '.json', query, callback);
  }
  
  var Closet = new function WardrobeCloset() {    
    this.unavailable_object_ids = [];
    
    this.setUnavailableObjectIds = function (ids) {
      this.unavailable_object_ids = $.map(ids,
        function (x) { return parseInt(x) });
      View.modules.closet.updateObjectStatuses();
    }
    
    this.clearObjectStatuses = function () {
      this.unavailable_object_ids = [];
    }
    
    this.getObjectIds = function () {
      return $.map(HashDaemon.get('closet'), 
        function (x) { return parseInt(x) });
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
    var Outfit = this;
    
    this.assets = [];
    this.pet_type = null;
    
    function addAssets(assets, is_object_asset) {
      $.each(assets, function () { this.is_object_asset = is_object_asset });
      Outfit.assets = Outfit.assets.concat(assets);
    }
    
    this.getObjectIds = function () {
      return $.map(HashDaemon.get('objects'),
        function (x) { return parseInt(x) });
    }
    
    this.setPetType = function (species, color) {
      HashDaemon.set('species', species);
      HashDaemon.set('color', color);
    }
    
    this.updateObjects = function () {
      var object_ids = HashDaemon.get('objects');
      WardrobeRequest('object_asset', 'findByParentIdsAndBodyId', {
        'parent_ids': object_ids,
        'body_id': Outfit.pet_type.body_id
      }, function (assets) {
        var unavailable_object_ids = $.extend([], object_ids);
        addAssets(assets, true);
        $.each(assets, function () {
          var asset = this, i = unavailable_object_ids.indexOf(asset.parent_id);
          if(i != -1) {
            unavailable_object_ids.splice(i, 1);
          }
        });
        Closet.setUnavailableObjectIds(unavailable_object_ids);
        View.Outfit.update();
      });
    }
    
    function updatePetType() {
      WardrobeRequest('pet_type', 'findBySpeciesAndColor', {
        'species_id': HashDaemon.get('species'),
        'color_id': HashDaemon.get('color')
      }, function (pet_type) {
        if(pet_type) {
          if(Outfit.pet_type && pet_type.body_id != Outfit.pet_type.body_id) {
            Outfit.assets = $.grep(Outfit.assets, function (asset) {
              return asset.is_body_specific == 0;
            });
          }
          Outfit.assets = $.grep(Outfit.assets, function (asset) {
            return asset.is_object_asset;
          });
          Outfit.pet_type = pet_type;
          addAssets(pet_type.assets, false);
          Outfit.updateObjects();
        } else {
          View.error('Pet type not found!');
        }
      });
    }
    
    // It feels silly, doesn't it? But updatePetType just starts the updating
    // *chain*, and isn't really the whole function, so I feel weird about
    // just plain calling it the update function.
    
    this.update = updatePetType;
    
    this.initialize = this.update;
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
    
    this.Outfit = new function WardrobeViewOutfit() {
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
        
        $.each(Outfit.assets, function() {
          if(
            (this.is_object_asset && WardrobeObject.find(this.parent_id).isWorn())
            || (!this.is_object_asset)
          ) {
            var id = 'outfit-asset-' + this.id + '-'
              + (this.is_object_asset ? 'object' : 'biology'),
              klass = 'outfit-asset';
            if(!$('#' + id).length) {
              $('<div id="' + id + '"></div>')
                .appendTo('#outfit-preview');
              if(this.is_object_asset) klass += ' object-asset';
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
            'alt': ''
          }).appendTo(object);
          object.append(this.name).appendTo(objects_wrapper);
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
        $.each(['species', 'color'], function () {
          var option = $('#pet-type-form-' + this + ' option:selected');
          HashDaemon.set(this, option.val());
        });
        Outfit.update();
      });
    }
    
    $('.object').live('mouseenter', function (e) {
      var el = $(e.target);
      if(el.is('.object') && !el.children('.object-actions').length) {
        var object = WardrobeObject.find(el.data('object_id'));
        
        function addAction(name) {
          var klass = name.toLowerCase();
          $('<a href="#" class="object-action object-action-' + klass + '">'
            + name + '</div>').appendTo(el);
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
      }
    }).live('mouseleave', function () {
      $(this).children('.object-action').remove();
    });

    this.error = function (message) {
      alert(message);
    }
  }
  
  $('.object-action-wear').live('click', function (e) {
    var el = $(this).parent(),
      object = WardrobeObject.find(el.data('object_id'));
    e.preventDefault();
    object.addToOutfit();
    View.Outfit.update();
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
  
  Outfit.initialize();
  Closet.initialize();
}
