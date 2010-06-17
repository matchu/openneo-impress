var View = {}, main_wardrobe;

window.log = $.noop;

function DeepObject() {}

DeepObject.prototype.deepGet = function () {
  var scope = this, i;
  $.each(arguments, function () {
    scope = scope[this];
    if(typeof scope == 'undefined') return false;
  });
  return scope;
}

DeepObject.prototype.deepSet = function () {
  var pop = $.proxy(Array.prototype.pop, 'apply'),
    value = pop(arguments),
    final_key = pop(arguments),
    scope = this;
  $.each(arguments, function () {
    if(typeof scope[this] == 'undefined') {
      scope[this] = {};
    }
    scope = scope[this];
  });
  scope[final_key] = value;
}

function Wardrobe() {
  var wardrobe = this, BiologyAsset, ItemAsset;
  this.events = {};
  this.events.trigger = function (event) {
    var subarguments;
    if(wardrobe.events[event]) {
      subarguments = Array.prototype.slice.apply(arguments, [1]);
      $.each(wardrobe.events[event], function () {
        this.apply(wardrobe, subarguments);
      });
    }
  }
  
  function determineRestrictedZones() {
    var i, zone;
    this.restricted_zones = [];
    while((zone = this.zones_restrict.indexOf(1, zone) + 1) != 0) {
      this.restricted_zones.push(zone);
    }
  }
  
  function Asset(data) {
    var asset = this;
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        asset[key] = data[key];
      }
    }
  }
  
  function BiologyAsset(data) {
    Asset.apply(this, [data]);
    determineRestrictedZones.apply(this);
  }
  
  function ItemAsset(data) {
    Asset.apply(this, [data]);
  }
  
  function Item(id) {
    var item = this;
    this.id = id;
    this.assets = [];
    this.loaded = false;
    
    this.update = function (data) {
      $.each(data, function (key, value) {
        item[key] = value;
      });
      determineRestrictedZones.apply(this);
      this.loaded = true;
    }
    
    Item.cache[id] = this;
  }
  
  Item.find = function (id) {
    var item = Item.cache[id];
    if(!item) {
      item = new Item(id);
    }
    return item;
  }
  
  Item.loadByIds = function (ids, success) {
    var ids_to_load = [], items = $.map(ids, function (id) {
      var item = Item.find(id);
      if(!item.loaded) ids_to_load.push(id);
      return item;
    });
    if(ids_to_load.length) {
      $.getJSON('/objects.json', {ids: ids_to_load}, function (data) {
        $.each(data, function () {
          Item.find(this.id).update(this);
        });
        success(items);
      });
    } else {
      success(items);
    }
    return items;
  }
  
  Item.cache = {};
  
  function PetState(id) {
    var pet_state = this, loaded = false;
    
    this.id = id;
    this.assets = [];
    
    this.assets.load = function (success) {
      var params;
      if(loaded) {
        success(pet_state);
      } else {
        $.getJSON('/biology_assets.json?parent_id=' + pet_state.id, // FIXME: params object didn't work here...
        function (data) {
          pet_state.assets = $.map(data, function (obj) { return new BiologyAsset(obj) });
          success(pet_state);
        });
      }
    }
  }
  
  function PetType() {
    var pet_type = this, loaded = false;
    
    this.pet_states = [];

    this.load = function (success, error) {
      if(loaded) {
        success(pet_type);
      } else {
        $.getJSON('/pet_types.json', {
          'for': 'wardrobe',
          color_id: pet_type.color_id,
          species_id: pet_type.species_id
        }, function (data) {
          if(data) {
            $.each(data, function (key) {
              pet_type[key] = this;
            });
            $.each(pet_type.pet_state_ids, function () {
              pet_type.pet_states.push(new PetState(this));
            });
            PetType.cache_by_color_and_species.deepSet(
              pet_type.color_id,
              pet_type.species_id,
              pet_type
            );
            loaded = true;
            success(pet_type);
          } else {
            error(pet_type);
          }
        });
      }
    }
    
    this.loadItemAssets = function (item_ids, success) {
      // TODO cache
      $.getJSON('/object_assets.json?body_id=' + pet_type.body_id, { // FIXME: params object didn't work here...
        parent_ids: item_ids
      }, function (data) {
        var item_assets = [];
        $.each(data, function () {
          var item = Item.find(this.parent_id),
            asset = new ItemAsset(this);
          item.assets.push(asset);
          item_assets.push(asset);
        });
        success(item_assets);
      });
    }
    
    this.toString = function () {
      return 'PetType{color_id: ' + this.color_id + ', species_id: ' +
        this.species_id + '}';
    }
  }
  
  PetType.cache_by_color_and_species = new DeepObject();
  
  PetType.findOrCreateByColorAndSpecies = function (color_id, species_id) {
    var pet_type = PetType.cache_by_color_and_species.deepGet(color_id, species_id);
    if(!pet_type) {
      pet_type = new PetType();
      pet_type.color_id = color_id;
      pet_type.species_id = species_id;
    }
    return pet_type;
  }
  
  function SwfAsset() {}
  
  this.outfit = new function Outfit() {
    var outfit = this, loading_pet_type, item_ids = [];
    
    this.items = [];
    
    function getRestrictedZones() {
      // note: may contain duplicates - loop through assets, not these, for
      // best performance
      var restricted_zones = [],
        restrictors = outfit.items.concat(outfit.pet_state.assets);
      $.each(restrictors, function () {
        restricted_zones = restricted_zones.concat(this.restricted_zones);
      });
      return restricted_zones;
    }
    
    function itemAssetsOnLoad(item_assets) {
      wardrobe.events.trigger('updateItemAssets', item_assets);
    }
    
    function itemsOnLoad(items) {
      wardrobe.events.trigger('updateItems', items);
    }
    
    function petStateOnLoad(pet_state) {
      outfit.pet_state = pet_state;
      wardrobe.events.trigger('updatePetState', pet_state);
    }
    
    function petTypeOnLoad(pet_type) {
      if(pet_type == loading_pet_type) {
        outfit.pet_type = pet_type;
        wardrobe.events.trigger('updatePetType', pet_type);
        pet_type.pet_states[0].assets.load(petStateOnLoad);
        updateItemAssets();
      }
    }
    
    function petTypeOnError(pet_type) {
      if(pet_type == loading_pet_type) {
        wardrobe.events.trigger('petTypeNotFound', pet_type);
        loading_pet_type = null;
      }
    }
    
    function updateItemAssets() {
      if(outfit.pet_type && item_ids.length) {
        outfit.pet_type.loadItemAssets(item_ids, itemAssetsOnLoad);
      }
    }
    
    this.getVisibleAssets = function () {
      var assets = [], restricted_zones = getRestrictedZones(),
        asset_parents = outfit.items.concat([outfit.pet_state]);
      $.each(asset_parents, function () {
        $.each(this.assets, function () {
          if($.inArray(this.zone_id, restricted_zones) == -1) {
            assets.push(this);
          }
        });
      });
      return assets;
    }
    
    this.setPetTypeByColorAndSpecies = function (color_id, species_id) {
      loading_pet_type = PetType.findOrCreateByColorAndSpecies(color_id, species_id);
      loading_pet_type.load(petTypeOnLoad, petTypeOnError);
    }
    
    this.setItemsByIds = function (ids) {
      item_ids = ids;
      if(ids.length) {
        this.items = Item.loadByIds(ids, itemsOnLoad);
      }
      updateItemAssets();
    }
  }
  
  this.bind = function (event, callback) {
    if(typeof this.events[event] == 'undefined') {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  this.initialize = function () {
    this.events.trigger('initialize');
  }
  
  this.registerViews = function (views) {
    $.each(views, function () {
      this(wardrobe);
    });
  }
}

if(document.location.search.substr(0, 6) == '?debug') {
  View.Console = function (wardrobe) {
    if(typeof console != 'undefined' && typeof console.log == 'function') {
      window.log = $.proxy(console, 'log');
    }
    
    wardrobe.bind('initialize', function () {
      log('Welcome to the Wardrobe!');
    });
    
    $.each(['updateItems', 'updateItemAssets', 'updatePetType', 'updatePetState'], function () {
      var event = this;
      wardrobe.bind(event, function (obj) {
        log(event, obj);
      });
    });
    
    wardrobe.bind('petTypeNotFound', function (pet_type) {
      log(pet_type.toString() + ' not found');
    });
  }
}

View.Hash = function (wardrobe) {
  var data = {}, previous_query, TYPES = {
    INTEGER: 1,
    ARRAY: 2
  }, KEYS = {
    color: TYPES.INTEGER,
    species: TYPES.INTEGER,
    objects: TYPES.INTEGER_ARRAY
  };
  
  function checkQuery() {
    var query = (document.location.hash || document.location.search).substr(1);
    if(query != previous_query) {
      parseQuery(query);
      previous_query = query;
    }
  }
  
  function parseQuery(query) {
    var new_data = {};
    $.each(query.split('&'), function () {
      var key_value = this.split('='),
        key = decodeURIComponent(key_value[0]),
        value = decodeURIComponent(key_value[1]);
      if(value) {
        if(KEYS[key] == TYPES.INTEGER) {
          new_data[key] = +value;
        } else if(key.substr(key.length-2) == '[]') {
          key = key.substr(0, key.length-2);
          if(KEYS[key] == TYPES.INTEGER_ARRAY) {
            if(typeof new_data[key] == 'undefined') new_data[key] = [];
            new_data[key].push(+value);
          }
        }
      }
    });
    
    if(new_data.color !== data.color || new_data.species !== data.species) {
      wardrobe.outfit.setPetTypeByColorAndSpecies(new_data.color, new_data.species);
    }
    if(new_data.objects !== data.objects) {
      wardrobe.outfit.setItemsByIds(new_data.objects);
    }
    data = new_data;
  }
  
  function updateQuery() {
    var new_query = $.param(data);
    previous_query = new_query;
    document.location.hash = '#' + new_query;
  }
  
  wardrobe.bind('initialize', function () {
    checkQuery();
    setInterval(checkQuery, 100);
  });
  
  wardrobe.bind('updatePetType', function (pet_type) {
    if(pet_type.color_id != data.color || pet_type.species_id != data.species) {
      data.color = pet_type.color_id;
      data.species = pet_type.species_id;
      updateQuery();
    }
  });
}

View.Preview = function (wardrobe) {
  var preview_el = $('#preview'),
    preview_swf_id = 'preview-swf',
    preview_swf,
    update_pending_flash = false;
  
  swfobject.embedSWF(
    '/assets/swf/preview.swf?v=0.10',
    'preview-swf',
    '100%',
    '100%',
    '9',
    '/assets/js/swfobject/expressInstall.swf',
    {'swf_assets_path': '/assets'},
    {'wmode': 'transparent'}
  );
  
  window.previewSWFIsReady = function () {
    log('Preview SWF is ready');
    preview_swf = document.getElementById(preview_swf_id);
    if(update_pending_flash) {
      log('About to set assets');
      update_pending_flash = false;
      updateAssets();
    }
  }
  
  function updateAssets() {
    var assets, assets_for_swf;
    if(update_pending_flash) return false;
    if(preview_swf && preview_swf.setAssets) {
      log('Getting assets');
      assets = wardrobe.outfit.getVisibleAssets();
      log('Setting assets');
      log(assets);
      preview_swf.setAssets(assets);
    } else {
      log('Will set assets once SWF is ready');
      update_pending_flash = true;
    }
  }
  
  wardrobe.bind('updateItems', updateAssets);
  wardrobe.bind('updateItemAssets', updateAssets);
  wardrobe.bind('updatePetState', updateAssets);
}

main_wardrobe = new Wardrobe();
main_wardrobe.registerViews(View);
main_wardrobe.initialize();
