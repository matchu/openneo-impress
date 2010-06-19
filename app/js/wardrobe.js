var View = {}, main_wardrobe;

window.log = window.SWFLog = $.noop;

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
  
  /*
  *
  * Models
  *
  */
  
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
    this.assets_by_body_id = {};
    this.loaded = false;
    
    this.getAssetsFitting = function (pet_type) {
      return this.assets_by_body_id[pet_type.body_id] || [];
    }
    
    this.hasAssetsFitting = function (pet_type) {
      return typeof item.assets_by_body_id[pet_type.body_id] != 'undefined';
    }
    
    this.update = function (data) {
      for(var key in data) {
        if(data.hasOwnProperty(key)) {
          item[key] = data[key];
        }
      }
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
  
  function PetAttribute() {}
  
  PetAttribute.loadAll = function (success) {
    $.getJSON('/pet_attributes.json', function (data) {
      success(data);
    });
  }
  
  function PetState(id) {
    var pet_state = this, loaded = false;
    
    this.id = id;
    this.assets = [];
    
    this.loadAssets = function (success) {
      var params;
      if(loaded) {
        success(pet_state);
      } else {
        $.getJSON('/biology_assets.json?parent_id=' + pet_state.id, // FIXME: params object didn't work here...
        function (data) {
          pet_state.assets = $.map(data, function (obj) { return new BiologyAsset(obj) });
          loaded = true;
          success(pet_state);
        });
      }
    }
  }
  
  function PetType() {
    var pet_type = this;
    
    this.loaded = false;
    this.pet_states = [];

    this.load = function (success, error) {
      if(pet_type.loaded) {
        success(pet_type);
      } else {
        $.getJSON('/pet_types.json', {
          'for': 'wardrobe',
          color_id: pet_type.color_id,
          species_id: pet_type.species_id
        }, function (data) {
          if(data) {
            for(var key in data) {
              if(data.hasOwnProperty(key)) {
                pet_type[key] = data[key];
              }
            }
            $.each(pet_type.pet_state_ids, function () {
              pet_type.pet_states.push(new PetState(this));
            });
            PetType.cache_by_color_and_species.deepSet(
              pet_type.color_id,
              pet_type.species_id,
              pet_type
            );
            pet_type.loaded = true;
            success(pet_type);
          } else {
            error(pet_type);
          }
        });
      }
    }
    
    this.loadItemAssets = function (item_ids, success) {
      var item_ids_needed = [];
      for(var i = 0; i < item_ids.length; i++) {
        var id = item_ids[i], item = Item.find(id);
        if(!item.hasAssetsFitting(pet_type)) item_ids_needed.push(id);
      }
      if(item_ids_needed.length) {
        $.getJSON('/object_assets.json', {
          body_id: pet_type.body_id,
          parent_ids: item_ids_needed
        }, function (data) {
          var item_assets = [];
          $.each(data, function () {
            var item = Item.find(this.parent_id),
              asset = new ItemAsset(this);
            if(typeof item.assets_by_body_id[pet_type.body_id] == 'undefined') {
              item.assets_by_body_id[pet_type.body_id] = [];
            }
            item.assets_by_body_id[pet_type.body_id].push(asset);
          });
          success(item_assets);
        });
      }
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
  
  /*
  *
  * Controllers
  *
  */
  
  function Controller() {
    var controller = this;
    this.events = {};
    
    this.bind = function (event, callback) {
      if(typeof this.events[event] == 'undefined') {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    }
    
    this.events.trigger = function (event) {
      var subarguments;
      if(controller.events[event]) {
        subarguments = Array.prototype.slice.apply(arguments, [1]);
        $.each(controller.events[event], function () {
          this.apply(controller, subarguments);
        });
      }
    }
  }
  
  Controller.Outfit = function OutfitController() {
    var outfit = this, previous_pet_type, item_ids = [];
    
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
      outfit.events.trigger('updateItemAssets', item_assets);
    }
    
    function itemsOnLoad(items) {
      outfit.events.trigger('updateItems', items);
    }
    
    function petStateOnLoad(pet_state) {
      outfit.pet_state = pet_state;
      outfit.events.trigger('updatePetState', pet_state);
    }
    
    function petTypeOnLoad(pet_type) {
      pet_type.pet_states[0].loadAssets(petStateOnLoad);
      updateItemAssets();
    }
    
    function petTypeOnError(pet_type) {
      outfit.events.trigger('petTypeNotFound', pet_type);
    }
    
    function updateItemAssets() {
      if(outfit.pet_type && outfit.pet_type.loaded && item_ids.length) {
        outfit.pet_type.loadItemAssets(item_ids, itemAssetsOnLoad);
      }
    }
    
    this.getVisibleAssets = function () {
      var assets = this.pet_state.assets, restricted_zones = getRestrictedZones(),
        visible_assets = [];
      $.each(this.items, function () {
        assets = assets.concat(this.getAssetsFitting(outfit.pet_type));
      });
      $.each(assets, function () {
        if($.inArray(this.zone_id, restricted_zones) == -1) {
          visible_assets.push(this);
        }
      });
      return visible_assets;
    }
    
    this.setPetTypeByColorAndSpecies = function (color_id, species_id) {
      this.pet_type = PetType.findOrCreateByColorAndSpecies(color_id, species_id);
      outfit.events.trigger('updatePetType', this.pet_type);
      this.pet_type.load(petTypeOnLoad, petTypeOnError);
    }
    
    this.setItemsByIds = function (ids) {
      if(ids) {
        item_ids = ids;
        if(ids.length) {
          this.items = Item.loadByIds(ids, itemsOnLoad);
        } else {
          this.items = [];
        }
      } else {
        this.items = [];
      }
      updateItemAssets();
    }
  }
  
  Controller.BasePet = function BasePetController() {
    var base_pet = this;
    
    this.setName = function (name) {
      base_pet.name = name;
      base_pet.events.trigger('updateName', name);
    }
  }
  
  Controller.PetAttributes = function PetAttributesController() {
    var pet_attributes = this;
    
    function onLoad(attributes) {
      pet_attributes.events.trigger('update', attributes);
    }
    
    this.load = function () {
      PetAttribute.loadAll(onLoad);
    }
  }

  var underscored_name;

  for(var name in Controller) {
    if(Controller.hasOwnProperty(name)) {
      // underscoring translated from
      // http://api.rubyonrails.org/classes/ActiveSupport/Inflector.html#M000710
      underscored_name = name.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').
        replace(/([a-z\d])([A-Z])/g,'$1_$2').toLowerCase();
      wardrobe[underscored_name] = new Controller[name];
      Controller.apply(wardrobe[underscored_name]);
    }
  }
  
  this.initialize = function () {
    var view;
    for(var name in wardrobe.views) {
      if(wardrobe.views.hasOwnProperty(name)) {
        view = wardrobe.views[name];
        if(typeof view.initialize == 'function') {
          view.initialize();
        }
      }
    }
  }
  
  this.registerViews = function (views) {
    wardrobe.views = {};
    $.each(views, function (name) {
      wardrobe.views[name] = new this(wardrobe);
    });
  }
}

/*
*
* Views
*
*/

if(document.location.search.substr(0, 6) == '?debug') {
  View.Console = function (wardrobe) {
    if(typeof console != 'undefined' && typeof console.log == 'function') {
      window.log = $.proxy(console, 'log');
    }
    
    this.initialize = function () {
      log('Welcome to the Wardrobe!');
    }
    
    var outfit_events = ['updateItems', 'updateItemAssets', 'updatePetType', 'updatePetState'];
    for(var i in outfit_events) {
      (function (event) {
        wardrobe.outfit.bind(event, function (obj) {
          log(event, obj);
        });
      })(outfit_events[i]);
    }
    
    wardrobe.outfit.bind('petTypeNotFound', function (pet_type) {
      log(pet_type.toString() + ' not found');
    });
  }
}

View.Hash = function (wardrobe) {
  var data = {}, proposed_data = {}, previous_query, parse_in_progress = false, TYPES = {
    INTEGER: 1,
    STRING: 2,
    ARRAY: 3
  }, KEYS = {
    color: TYPES.INTEGER,
    name: TYPES.STRING,
    objects: TYPES.INTEGER_ARRAY,
    species: TYPES.INTEGER
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
    parse_in_progress = true;
    $.each(query.split('&'), function () {
      var key_value = this.split('='),
        key = decodeURIComponent(key_value[0]),
        value = decodeURIComponent(key_value[1]);
      if(value) {
        if(KEYS[key] == TYPES.INTEGER) {
          new_data[key] = +value;
        } else if(KEYS[key] == TYPES.STRING) {
          new_data[key] = value;
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
    if(new_data.name != data.name && new_data.name) {
      wardrobe.base_pet.setName(new_data.name);
    }
    data = new_data;
    parse_in_progress = false;
  }
  
  function changeQuery(changes) {
    if(!parse_in_progress) {
      data = $.extend(data, changes);
      updateQuery();
    }
  }
  
  function updateQuery() {
    var new_query;
    new_query = $.param(data);
    previous_query = new_query;
    document.location.hash = '#' + new_query;
  }
  
  this.initialize = function () {
    checkQuery();
    setInterval(checkQuery, 100);
  }
  
  wardrobe.outfit.bind('updatePetType', function (pet_type) {
    if(pet_type.color_id != data.color || pet_type.species_id != data.species) {
      changeQuery({
        color: pet_type.color_id,
        species: pet_type.species_id
      });
    }
  });
  
  wardrobe.outfit.bind('petTypeNotFound', function () {
    window.history.back();
  });
}

View.Preview = function (wardrobe) {
  var preview_el = $('#preview'),
    preview_swf_id = 'preview-swf',
    preview_swf,
    update_pending_flash = false;
  
  swfobject.embedSWF(
    '/assets/swf/preview.swf?v=0.11',
    'preview-swf',
    '100%',
    '100%',
    '9',
    '/assets/js/swfobject/expressInstall.swf',
    {'swf_assets_path': '/assets'},
    {'wmode': 'transparent'}
  );
  
  window.previewSWFIsReady = function () {
    preview_swf = document.getElementById(preview_swf_id);
    if(update_pending_flash) {
      update_pending_flash = false;
      updateAssets();
    }
  }
  
  function updateAssets() {
    var assets, assets_for_swf;
    if(update_pending_flash) return false;
    if(preview_swf && preview_swf.setAssets) {
      assets = wardrobe.outfit.getVisibleAssets();
      preview_swf.setAssets(assets);
    } else {
      update_pending_flash = true;
    }
  }
  
  wardrobe.outfit.bind('updateItems', updateAssets);
  wardrobe.outfit.bind('updateItemAssets', updateAssets);
  wardrobe.outfit.bind('updatePetState', updateAssets);
}

View.PetTypeForm = function (wardrobe) {
  var form = $('#pet-type-form'), dropdowns = {}, loaded = false;
  form.submit(function (e) {
    e.preventDefault();
    wardrobe.outfit.setPetTypeByColorAndSpecies(
      parseInt(dropdowns.color.val()), parseInt(dropdowns.species.val())
    );
  }).children('select').each(function () {
    dropdowns[this.name] = $(this);
  });
  
  this.initialize = function () {
    wardrobe.pet_attributes.load();
  }
  
  function updatePetType(pet_type) {
    if(loaded && pet_type) {
      $.each(dropdowns, function (name) {
        dropdowns[name].val(pet_type[name + '_id']);
      });
    }
  }
  
  wardrobe.pet_attributes.bind('update', function (attributes) {
    $.each(attributes, function (type) {
      var dropdown = dropdowns[type];
      $.each(this, function () {
        var option = $('<option/>', {
          text: this.name,
          value: this.id
        });
        option.appendTo(dropdown);
      });
    });
    loaded = true;
    updatePetType(wardrobe.outfit.pet_type);
  });
  
  wardrobe.outfit.bind('updatePetType', updatePetType);
}

View.Title = function (wardrobe) {
  wardrobe.base_pet.bind('updateName', function (name) {
    $('#title').text("Planning " + name + "'s outfit");
  });
}

main_wardrobe = new Wardrobe();
main_wardrobe.registerViews(View);
main_wardrobe.initialize();
