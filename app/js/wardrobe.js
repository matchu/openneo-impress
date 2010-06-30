var View = {}, Partial = {}, main_wardrobe, ITEMS_SERVER = 'items.impress.openneo.net';
if(document.location.hostname.substr(0, 5) == 'beta.') {
  ITEMS_SERVER = 'beta.' + ITEMS_SERVER;
}
ITEMS_SERVER = 'http://' + ITEMS_SERVER;

window.log = window.SWFLog = $.noop;

function arraysMatch(array1, array2) {
  // http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256BFB0077DFFD
  var temp;
  if(!$.isArray(array1)|| !$.isArray(array2)) {
    return array1 == array2;
  }
  temp = [];
  if ( (!array1[0]) || (!array2[0]) ) {
    return false;
  }
  if (array1.length != array2.length) {
    return false;
  }
  for (var i=0; i<array1.length; i++) {
    key = (typeof array1[i]) + "~" + array1[i];
    if (temp[key]) { temp[key]++; } else { temp[key] = 1; }
  }
  for (var i=0; i<array2.length; i++) {
    key = (typeof array2[i]) + "~" + array2[i];
    if (temp[key]) {
      if (temp[key] == 0) { return false; } else { temp[key]--; }
    } else {
      return false;
    }
  }
  return true;
}

Array.prototype.map = function (property) {
  return $.map(this, function (element) {
    return element[property];
  });
}

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
    this.load_started = false;
    this.loaded = false;
    
    this.getAssetsFitting = function (pet_type) {
      return this.assets_by_body_id[pet_type.body_id] || [];
    }
    
    this.hasAssetsFitting = function (pet_type) {
      return typeof item.assets_by_body_id[pet_type.body_id] != 'undefined' &&
        item.assets_by_body_id[pet_type.body_id].length > 0;
    }
    
    this.couldNotLoadAssetsFitting = function (pet_type) {
      return typeof item.assets_by_body_id[pet_type.body_id] != 'undefined' &&
        item.assets_by_body_id[pet_type.body_id].length == 0;
    }
    
    this.update = function (data) {
      for(var key in data) {
        if(data.hasOwnProperty(key) && key != 'id') { // do not replace ID with string
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
  
  var item_load_callbacks = [];
  
  Item.loadByIds = function (ids, success) {
    var ids_to_load = [], ids_not_loaded = [], items = $.map(ids, function (id) {
      var item = Item.find(id);
      if(!item.load_started) {
        ids_to_load.push(id);
        item.load_started = true;
      }
      if(!item.loaded) {
        ids_not_loaded.push(id);
      }
      return item;
    });
    if(ids_to_load.length) {
      $.getJSON('/objects.json', {ids: ids_to_load}, function (data) {
        var set, set_items, set_ids, set_callback, run_callback, ids_from_data = [];
        $.each(data, function () {
          ids_from_data.push(+this.id);
          Item.find(this.id).update(this);
        });
        for(var i = 0; i < item_load_callbacks.length; i++) {
          set = item_load_callbacks[i];
          set_items = set[0];
          set_ids = set[1];
          set_callback = set[2];
          run_callback = true;
          for(var j = 0; j < set_ids.length; j++) {
            if($.inArray(set_ids[j], ids_from_data) == -1) {
              run_callback = false;
              break;
            }
          }
          if(run_callback) set_callback(set_items);
        }
        success(items);
      });
    } else if(ids_not_loaded.length) {
      item_load_callbacks.push([items, ids_not_loaded, success]);
    } else {
      success(items);
    }
    return items;
  }
  
  var ITEMS_URL = ITEMS_SERVER + '/index.js?callback=?',
    PER_PAGE = 21;
  
  Item.loadByQuery = function (query, page, success, error) {
    $.getJSON(ITEMS_URL, {q: query, per_page: PER_PAGE, page: page}, function (data) {
      var items = [], item, item_data;
      if(data.items) {
        for(var i = 0; i < data.items.length; i++) {
          item_data = data.items[i];
          item = Item.find(item_data.id);
          item.update(item_data);
          items.push(item);
        }
        success(items, data.total_pages);
      } else if(data.error) {
        error(data.error);
      }
    });
  }
  
  Item.cache = {};
  
  function ItemZoneSet(name) {
    this.name = name;
  }
  
  ItemZoneSet.loadAll = function (success) {
    $.getJSON(ITEMS_SERVER + '/item_zone_sets.js?callback=?', function (data) {
      for(var i = 0, l = data.length; i < l; i++) {
        ItemZoneSet.all.push(new ItemZoneSet(data[i]));
      }
      success(ItemZoneSet.all);
    });
  }
  
  ItemZoneSet.all = [];
  
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
    
    PetState.cache[id] = this;
  }
  
  PetState.find = function (id) {
    var pet_state = PetState.cache[id];
    if(!pet_state) {
      pet_state = new PetState(id);
    }
    return pet_state;
  }
  
  PetState.cache = {};
  
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
            for(var i = 0; i < pet_type.pet_state_ids.length; i++) {
              pet_type.pet_states.push(PetState.find(pet_type.pet_state_ids[i]));
            }
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
          var item;
          $.each(data, function () {
            var item = Item.find(this.parent_id),
              asset = new ItemAsset(this);
            if(typeof item.assets_by_body_id[pet_type.body_id] == 'undefined') {
              item.assets_by_body_id[pet_type.body_id] = [];
            }
            item.assets_by_body_id[pet_type.body_id].push(asset);
          });
          for(var i = 0, l = item_ids.length; i < l; i++) {
            item = Item.find(item_ids[i]);
            if(!item.hasAssetsFitting(pet_type)) {
              item.assets_by_body_id[pet_type.body_id] = [];
            }
          }
          success();
        });
      } else {
        success();
      }
    }
    
    this.toString = function () {
      return 'PetType{color_id: ' + this.color_id + ', species_id: ' +
        this.species_id + '}';
    }
    
    this.ownsPetState = function (pet_state) {
      for(var i = 0; i < this.pet_states.length; i++) {
        if(this.pet_states[i] == pet_state) return true;
      }
      return false;
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
    
    function hasItem(item) {
      return $.inArray(item, outfit.items) != -1;
    }
    
    function itemAssetsOnLoad(added_item) {
      var item_zones, item_zones_length, existing_item, existing_item_zones, passed,
        new_items = [], new_item_ids = [];
      if(added_item) {
        // now that we've loaded, check for conflicts on the added item
        item_zones = added_item.getAssetsFitting(outfit.pet_type).map('zone_id');
        item_zones_length = item_zones.length;
        for(var i = 0; i < outfit.items.length; i++) {
          existing_item = outfit.items[i];
          existing_item_zones = existing_item.getAssetsFitting(outfit.pet_type).map('zone_id');
          passed = true;
          if(existing_item != added_item) {
            for(var j = 0; j < item_zones_length; j++) {
              if($.inArray(item_zones[j], existing_item_zones) != -1) {
                passed = false;
                break;
              }
            }
          }
          if(passed) {
            new_items.push(existing_item);
            new_item_ids.push(existing_item.id);
          }
        }
        outfit.items = new_items;
        item_ids = new_item_ids;
        outfit.events.trigger('updateItems', outfit.items);
      }
      outfit.events.trigger('updateItemAssets');
    }
    
    function itemsOnLoad(items) {
      outfit.events.trigger('updateItems', items);
    }
    
    function petStateOnLoad(pet_state) {
      outfit.events.trigger('updatePetState', pet_state);
    }
    
    function petTypeOnLoad(pet_type) {
      if(!outfit.pet_state || !pet_type.ownsPetState(outfit.pet_state)) {
        outfit.setPetStateById();
      }
      outfit.events.trigger('petTypeLoaded', pet_type);
      updateItemAssets();
    }
    
    function petTypeOnError(pet_type) {
      outfit.events.trigger('petTypeNotFound', pet_type);
    }
    
    function updateItemAssets(added_item) {
      if(outfit.pet_type && outfit.pet_type.loaded && item_ids.length) {
        outfit.pet_type.loadItemAssets(item_ids, function () {
          itemAssetsOnLoad(added_item)
        });
      }
    }
    
    this.addItem = function (item) {
      if(!hasItem(item)) {
        this.items.push(item);
        item_ids.push(item.id);
        updateItemAssets(item);
        outfit.events.trigger('updateItems', this.items);
      }
    }
    
    this.getVisibleAssets = function () {
      var assets = this.pet_state.assets, restricted_zones = getRestrictedZones(),
        visible_assets = [];
      for(var i = 0; i < outfit.items.length; i++) {
        assets = assets.concat(outfit.items[i].getAssetsFitting(outfit.pet_type));
      }
      $.each(assets, function () {
        if($.inArray(this.zone_id, restricted_zones) == -1) {
          visible_assets.push(this);
        }
      });
      return visible_assets;
    }
    
    this.removeItem = function (item) {
      var i = $.inArray(item, this.items), id_i;
      if(i != -1) {
        this.items.splice(i, 1);
        id_i = $.inArray(item.id, item_ids);
        item_ids.splice(id_i, 1);
        outfit.events.trigger('updateItems', this.items);
      }
    }
    
    this.setPetStateById = function (id) {
      if(!id && this.pet_type) {
        id = this.pet_type.pet_state_ids[0];
      }
      if(id) {
        this.pet_state = PetState.find(id);
        this.pet_state.loadAssets(petStateOnLoad);
      }
    }
    
    this.setPetTypeByColorAndSpecies = function (color_id, species_id) {
      this.pet_type = PetType.findOrCreateByColorAndSpecies(color_id, species_id);
      outfit.events.trigger('updatePetType', this.pet_type);
      this.pet_type.load(petTypeOnLoad, petTypeOnError);
    }
    
    this.setItemsByIds = function (ids) {
      if(ids) item_ids = ids;
      if(ids && ids.length) {
        this.items = Item.loadByIds(ids, itemsOnLoad);
      } else {
        this.items = [];
        itemsOnLoad(this.items);
      }
      updateItemAssets();
    }
  }
  
  Controller.Closet = function ClosetController() {
    // FIXME: a lot of duplication from outfit controller
    var closet = this, item_ids = [];
    this.items = [];
    
    function hasItem(item) {
      return $.inArray(item, closet.items) != -1;
    }
    
    function itemsOnLoad(items) {
      closet.events.trigger('updateItems', items);
    }
    
    this.addItem = function (item) {
      if(!hasItem(item)) {
        this.items.push(item);
        item_ids.push(item.id);
        closet.events.trigger('updateItems', this.items);
      }
    }
    
    this.removeItem = function (item) {
      var i = $.inArray(item, this.items), id_i;
      if(i != -1) {
        this.items.splice(i, 1);
        id_i = $.inArray(item.id, item_ids);
        item_ids.splice(id_i, 1);
        closet.events.trigger('updateItems', this.items);
      }
    }
    
    this.setItemsByIds = function (ids) {
      if(ids && ids.length) {
        item_ids = ids;
        this.items = Item.loadByIds(ids, itemsOnLoad);
      } else {
        item_ids = ids;
        this.items = [];
        itemsOnLoad(this.items);
      }
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
  
  Controller.ItemZoneSets = function ItemZoneSetsController() {
    var item_zone_sets = this;
    
    function onLoad(sets) {
      item_zone_sets.events.trigger('update', sets);
    }
    
    this.load = function () {
      ItemZoneSet.loadAll(onLoad);
    }
  }
  
  Controller.Search = function SearchController() {
    var search = this;
    
    this.request = {};
    
    function itemsOnLoad(items, total_pages, page) {
      search.events.trigger('updateItems', items);
      search.events.trigger('updatePagination', page, total_pages);
    }
    
    function itemsOnError(error) {
      search.events.trigger('error', error);
    }
    
    this.setItemsByQuery = function (query, page) {
      search.request = {
        query: query,
        page: page
      };
      search.events.trigger('updateRequest', search.request);
      if(query && page) {
        Item.loadByQuery(query, page, function (items, total_pages) {
          itemsOnLoad(items, total_pages, page);
        }, itemsOnError);
        search.events.trigger('startRequest');
      } else {
        search.events.trigger('updateItems', []);
        search.events.trigger('updatePagination', 0, 0);
      }
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

Partial.ItemSet = function ItemSet(wardrobe, selector) {
  var item_set = this, ul = $(selector), items = [], setClosetItems,
    setOutfitItems, setOutfitItemsControls;
  
  Partial.ItemSet.setWardrobe(wardrobe);
  
  function prepSetSpecificItems(type) {
    return function (specific_items) {
      var item, worn, li;
      for(var i = 0; i < items.length; i++) {
        item = items[i];
        in_set = $.inArray(item, specific_items) != -1;
        li = $('li.object-' + item.id).toggleClass(type, in_set).
          data('item', item).data(type, in_set).children('ul').
          children('li.control-set-for-' + type).remove().end()
          [type == 'worn' ? 'prepend' : 'append']
          (Partial.ItemSet.CONTROL_SETS[type][in_set].clone());
      }
    }
  }
  
  setClosetItems = prepSetSpecificItems('closeted');
  
  setOutfitItemsControls = prepSetSpecificItems('worn');
  setOutfitItems = function (specific_items) {
    setOutfitItemsControls(specific_items);
    setHasAssets(specific_items);
  }
  
  function setHasAssets(specific_items) {
    var item, no_assets, li, existing_why_red;
    for(var i = 0, l = specific_items.length; i < l; i++) {
      item = specific_items[i];
      no_assets = item.couldNotLoadAssetsFitting(wardrobe.outfit.pet_type);
      $('li.object-' + item.id).toggleClass('no-assets', no_assets);
    }
  }
  
  this.setItems = function (new_items) {
    var item, li, controls;
    items = new_items;
    ul.children().remove();
    for(var i = 0; i < items.length; i++) {
      item = items[i];
      li = $('<li/>', {'class': 'object object-' + item.id});
      img = $('<img/>', {
        'src': item.thumbnail_url,
        'alt': item.description,
        'title': item.description
      });
      controls = $('<ul/>');
      li.append(img).append(controls).append(item.name).appendTo(ul);
    }
    setClosetItems(wardrobe.closet.items);
    setOutfitItems(wardrobe.outfit.items);
  }
  
  wardrobe.outfit.bind('updateItemAssets', function () { setHasAssets(wardrobe.outfit.items) });
  wardrobe.outfit.bind('updateItems', setOutfitItems);
  wardrobe.closet.bind('updateItems', setClosetItems);
}

Partial.ItemSet.CONTROL_SETS = {};

Partial.ItemSet.setWardrobe = function (wardrobe) {
  var type, verb_set, toggle, live_class, full_class, toggle_fn = {};
  for(var i = 0; i < 2; i++) {
    type = i == 0 ? 'worn' : 'closeted';
    verb_set = i == 0 ? ['Unwear', 'Wear'] : ['Uncloset', 'Closet'];
    Partial.ItemSet.CONTROL_SETS[type] = {};
    for(var j = 0; j < 2; j++) {
      toggle = j == 0;
      full_class = 'control-set control-set-for-' + type;
      live_class = 'control-set-' + (toggle ? '' : 'not-') + type;
      full_class += ' ' + live_class;
      Partial.ItemSet.CONTROL_SETS[type][toggle] = $('<a/>', {
        href: '#',
        text: verb_set[toggle ? 0 : 1]
      }).wrap('<li/>').parent().attr('class', full_class);
      
      (function (type, toggle) {
        $('li.' + live_class + ' a').live('click', function (e) {
          var el = $(this), item = el.closest('.object').data('item');
          toggle_fn[type][!toggle](item);
          e.preventDefault();
        });
      })(type, toggle);
    }
  }
  
  toggle_fn.closeted = {};
  toggle_fn.closeted[true] = $.proxy(wardrobe.closet, 'addItem');
  toggle_fn.closeted[false] = function (item) { wardrobe.outfit.removeItem(item); wardrobe.closet.removeItem(item); }

  toggle_fn.worn = {};
  toggle_fn.worn[true] = function (item) { wardrobe.closet.addItem(item); wardrobe.outfit.addItem(item); }
  toggle_fn.worn[false] = $.proxy(wardrobe.outfit, 'removeItem');
  
  Partial.ItemSet.setWardrobe = $.noop;
}

if(document.location.search.substr(0, 6) == '?debug') {
  View.Console = function (wardrobe) {
    if(typeof console != 'undefined' && typeof console.log == 'function') {
      window.log = $.proxy(console, 'log');
    }
    
    this.initialize = function () {
      log('Welcome to the Wardrobe!');
    }
    
    var outfit_events = ['updateItems', 'updateItemAssets', 'updatePetType', 'updatePetState'];
    for(var i = 0; i < outfit_events.length; i++) {
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

View.Closet = function (wardrobe) {
  var item_set = new Partial.ItemSet(wardrobe, '#preview-closet ul');
  
  wardrobe.closet.bind('updateItems', $.proxy(item_set, 'setItems'));
}

View.Hash = function (wardrobe) {
  var data = {}, proposed_data = {}, previous_query, parse_in_progress = false, TYPES = {
    INTEGER: 1,
    STRING: 2,
    INTEGER_ARRAY: 3
  }, KEYS = {
    closet: TYPES.INTEGER_ARRAY,
    color: TYPES.INTEGER,
    name: TYPES.STRING,
    objects: TYPES.INTEGER_ARRAY,
    search: TYPES.STRING,
    search_page: TYPES.INTEGER,
    species: TYPES.INTEGER,
    state: TYPES.INTEGER
  }, onUpdateQuery;
  
  function checkQuery() {
    var query = (document.location.hash || document.location.search).substr(1);
    if(query != previous_query) {
      parseQuery(query);
      previous_query = query;
    }
  }
  
  function parseQuery(query) {
    var new_data = {}, pairs = query.split('&');
    parse_in_progress = true;
    for(var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('='),
        key = decodeURIComponent(pair[0]),
        value = decodeURIComponent(pair[1]);
      if(value) {
        if(KEYS[key] == TYPES.INTEGER) {
          new_data[key] = +value;
        } else if(KEYS[key] == TYPES.STRING) {
          new_data[key] = decodeURIComponent(value).replace(/\+/g, ' ');
        } else if(key.substr(key.length-2) == '[]') {
          key = key.substr(0, key.length-2);
          if(KEYS[key] == TYPES.INTEGER_ARRAY) {
            if(typeof new_data[key] == 'undefined') new_data[key] = [];
            new_data[key].push(+value);
          }
        }
      }
    }
    
    if(new_data.color !== data.color || new_data.species !== data.species) {
      wardrobe.outfit.setPetTypeByColorAndSpecies(new_data.color, new_data.species);
    }
    if(new_data.closet) {
      if(!arraysMatch(new_data.closet, data.closet)) {
        wardrobe.closet.setItemsByIds(new_data.closet.slice(0));
      }
    } else if(!arraysMatch(new_data.objects, data.closet)) {
      wardrobe.closet.setItemsByIds(new_data.objects.slice(0));
    }
    if(!arraysMatch(new_data.objects, data.objects)) {
      wardrobe.outfit.setItemsByIds(new_data.objects.slice(0));
    }
    if(new_data.name != data.name && new_data.name) {
      wardrobe.base_pet.setName(new_data.name);
    }
    if(new_data.state != data.state) {
      wardrobe.outfit.setPetStateById(new_data.state);
    }
    if(new_data.search != data.search || new_data.search_page != data.search_page) {
      wardrobe.search.setItemsByQuery(new_data.search, new_data.search_page);
    }
    data = new_data;
    parse_in_progress = false;
    onUpdateQuery();
  }
  
  function changeQuery(changes) {
    var value;
    if(!parse_in_progress) {
      for(var key in changes) {
        if(changes.hasOwnProperty(key)) {
          value = changes[key];
          if(value === undefined) {
            delete data[key];
          } else {
            data[key] = changes[key];
          }
        }
      }
      updateQuery();
    }
  }
  
  function updateQuery() {
    var new_query;
    new_query = $.param(data).replace(/%5B%5D/g, '[]');
    previous_query = new_query;
    document.location.hash = '#' + new_query;
    onUpdateQuery();
  }
  
  this.initialize = function () {
    checkQuery();
    setInterval(checkQuery, 100);
  }
  
  wardrobe.outfit.bind('updateItems', function (items) {
    var item_ids = items.map('id'), changes = {};
    if(!arraysMatch(item_ids, data.objects)) {
      changes.objects = item_ids;
    }
    // FIXME: no, closet should be drawing from its own item set
    if(arraysMatch(item_ids, data.closet) || arraysMatch(item_ids, data.objects)) {
      changes.closet = undefined;
    } else {
      changes.closet = wardrobe.closet.items.map('id');
    }
    if(changes.objects || changes.closet) changeQuery(changes);
  });
  
  wardrobe.outfit.bind('updatePetType', function (pet_type) {
    if(pet_type.color_id != data.color || pet_type.species_id != data.species) {
      changeQuery({
        color: pet_type.color_id,
        species: pet_type.species_id,
        state: undefined
      });
    }
  });
  
  wardrobe.outfit.bind('petTypeNotFound', function () {
    window.history.back();
  });
  
  wardrobe.outfit.bind('updatePetState', function (pet_state) {
    var pet_type = wardrobe.outfit.pet_type;
    if(pet_state.id != data.state && pet_type && (data.state || pet_state.id != pet_type.pet_state_ids[0])) {
      changeQuery({state: pet_state.id});
    }
  });
  
  wardrobe.search.bind('updateRequest', function (request) {
    if(request.page != data.search_page || request.query != data.search) {
      changeQuery({
        search_page: request.page,
        search: request.query
      });
    }
  });
  
  (function Share() {
    ZeroClipboard.setMoviePath('/assets/swf/ZeroClipboard.swf');
    var response_el = $('#shorten-url-response'),
      form = $('#shorten-url-form'),
      response_form = $('#shorten-url-response-form'),
      loading = $('#shorten-url-loading'),
      clip = new ZeroClipboard.Client(),
      glued = false;
    
    onUpdateQuery = function () {
      form.show();
      loading.hide();
      response_form.hide();
    }
    
    BitlyCB.wardrobeSelfShorten = function (data) {
      var hash, url;
      try {
        hash = data.results[document.location.href].hash;
      } catch (e) {
        log('shortener error: likely no longer same URL', e);
      }
      url = 'http://outfits.openneo.net/' + hash;
      form.hide();
      response_form.show();
      if(!glued) {
        clip.glue('shorten-url-copy-button', 'shorten-url-copy-button-wrapper');
        glued = true;
      }
      response_el.text(url);
      clip.setText(url);
    }
    
    form.submit(function (e) {
      BitlyClient.shorten(document.location.href, 'BitlyCB.wardrobeSelfShorten');
      loading.show();
      e.preventDefault();
    });
    
    response_form.submit(function (e) { e.preventDefault() });
  })();
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

View.PetStateForm = function (wardrobe) {
  var INPUT_NAME = 'pet_state_id', form_query = '#pet-state-form',
    form = $(form_query),
    ul = form.children('ul'),
    radio_query = form_query + ' input[name=' + INPUT_NAME + ']';
  $(radio_query).live('click', function () {
    wardrobe.outfit.setPetStateById(+this.value);
  });
  
  function updatePetState(pet_state) {
    if(pet_state) {
      ul.children('li.selected').removeClass('selected');
      $(radio_query + '[value=' + pet_state.id + ']')
        .attr('checked', 'checked').parent().addClass('selected');
    }
  }
  
  wardrobe.outfit.bind('petTypeLoaded', function (pet_type) {
    var ids = pet_type.pet_state_ids, i, id, li, radio, label;
    ul.children().remove();
    if(ids.length == 1) {
      form.hide();
    } else {
      form.show();
      for(var i = 0; i < ids.length; i++) {
        id = 'pet-state-radio-' + i;
        li = $('<li/>');
        radio = $('<input/>', {
          id: id,
          name: INPUT_NAME,
          type: 'radio',
          value: ids[i]
        });
        label = $('<label/>', {
          'for': id,
          text: i + 1
        });
        if(i == 0) radio.attr('checked', 'checked');
        radio.appendTo(li);
        label.appendTo(li);
        li.appendTo(ul);
      }
      updatePetState(wardrobe.outfit.pet_state);
    }
  });
  
  wardrobe.outfit.bind('updatePetState', updatePetState);
}

View.PetTypeForm = function (wardrobe) {
  var form = $('#pet-type-form'), dropdowns = {}, loaded = false;
  form.submit(function (e) {
    e.preventDefault();
    wardrobe.outfit.setPetTypeByColorAndSpecies(
      +dropdowns.color.val(), +dropdowns.species.val()
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
  
  wardrobe.outfit.bind('petTypeNotFound', function () {
    $('#pet-type-not-found').show('normal').delay(3000).hide('fast');
  });
}

View.Search = function (wardrobe) {
  var form_selector = '#preview-search-form', form = $(form_selector),
    item_set = new Partial.ItemSet(wardrobe, form_selector + ' ul'),
    input_el = form.find('input[name=query]'),
    clear_el = $('#preview-search-form-clear'),
    error_el = $('#preview-search-form-error'),
    help_el = $('#preview-search-form-help'),
    loading_el = $('#preview-search-form-loading'),
    no_results_el = $('#preview-search-form-no-results'),
    no_results_span = no_results_el.children('span'),
    PAGINATION = {
      INNER_WINDOW: 4,
      OUTER_WINDOW: 1,
      GAP_TEXT: '&hellip;',
      PREV_TEXT: '&larr; Previous',
      NEXT_TEXT: 'Next &rarr;',
      PAGE_EL: $('<a/>', {href: '#'}),
      CURRENT_EL: $('<span/>', {'class': 'current'}),
      EL_ID: '#preview-search-form-pagination'
    }
    
  PAGINATION.EL = $(PAGINATION.EL_ID);
  PAGINATION.GAP_EL = $('<span/>', {'class': 'gap', html: PAGINATION.GAP_TEXT})
  PAGINATION.PREV_EL = $('<a/>', {href: '#', rel: 'prev', html: PAGINATION.PREV_TEXT});
  PAGINATION.NEXT_EL = $('<a/>', {href: '#', rel: 'next', html: PAGINATION.NEXT_TEXT});
  
  $(PAGINATION.EL_ID + ' a').live('click', function (e) {
    e.preventDefault();
    loadPage($(this).data('page'));
  });
  
  this.initialize = $.proxy(wardrobe.item_zone_sets, 'load');
  
  function loadPage(page) {
    wardrobe.search.setItemsByQuery(input_el.val(), page);
  }
  
  function stopLoading() {
    loading_el.stop(true, true).hide();
  }
  
  form.submit(function (e) {
    e.preventDefault();
    loadPage(1);
  });
  
  clear_el.click(function (e) {
    e.preventDefault();
    input_el.val('');
    form.submit();
  });
  
  wardrobe.search.bind('startRequest', function () {
    loading_el.delay(1000).show('slow');
  });
  
  wardrobe.search.bind('updateItems', function (items) {
    stopLoading();
    item_set.setItems(items);
    if(wardrobe.search.request.query) {
      if(!items.length) {
        no_results_el.show();
      }
    } else {
      help_el.show();
    }
  });
  
  wardrobe.search.bind('updateRequest', function (request) {
    error_el.hide('fast');
    help_el.hide();
    no_results_el.hide();
    input_el.val(request.query || '');
    no_results_span.text(request.query);
    clear_el.toggle(!!request.query);
  });
  
  wardrobe.search.bind('updatePagination', function (current_page, total_pages) {
    // ported from http://github.com/mislav/will_paginate/blob/master/lib/will_paginate/view_helpers.rb#L274
    var window_from = current_page - PAGINATION.INNER_WINDOW,
      window_to = current_page + PAGINATION.INNER_WINDOW,
      visible = [], left_gap, right_gap, subtract_left, subtract_right,
      i = 1;
    
    if(window_to > total_pages) {
      window_from -= window_to - total_pages;
      window_to = total_pages;
    }
    
    if(window_from < 1) {
      window_to += 1 - window_from;
      window_from = 1;
      if(window_to > total_pages) window_to = total_pages;
    }
    
    left_gap  = [2 + PAGINATION.OUTER_WINDOW, window_from];
    right_gap = [window_to + 1, total_pages - PAGINATION.OUTER_WINDOW];
    
    subtract_left = (left_gap[1] - left_gap[0]) > 1;
    subtract_right = (right_gap[1] - right_gap[0]) > 1;
    
    PAGINATION.EL.children().remove();
    
    if(current_page > 1) {
      PAGINATION.PREV_EL.clone().data('page', current_page - 1).appendTo(PAGINATION.EL);
    }
    
    while(i <= total_pages) {
      if(subtract_left && i >= left_gap[0] && i < left_gap[1]) {
        PAGINATION.GAP_EL.clone().appendTo(PAGINATION.EL);
        i = left_gap[1];
      } else if(subtract_right && i >= right_gap[0] && i < right_gap[1]) {
        PAGINATION.GAP_EL.clone().appendTo(PAGINATION.EL);
        i = right_gap[1];
      } else {
        if(i == current_page) {
          PAGINATION.CURRENT_EL.clone().text(i).appendTo(PAGINATION.EL);
        } else {
          PAGINATION.PAGE_EL.clone().text(i).data('page', i).appendTo(PAGINATION.EL);
        }
        i++;
      }
    }
    
    if(current_page < total_pages) {
      PAGINATION.NEXT_EL.clone().data('page', current_page + 1).appendTo(PAGINATION.EL);
    }
  });
  
  wardrobe.search.bind('error', function (error) {
    stopLoading();
    error_el.text(error).show('normal');
  });
  
  help_el.find('dt').each(function () {
    var el = $(this);
    if(!el.children().length) {
      el.wrapInner($('<a/>', {href: '#'}));
    }
  }).children('span:not(.search-helper)').each(function () {
    var el = $(this);
    el.replaceWith($('<a/>', {href: '#', text: el.text()}));
  });
  
  help_el.find('dt a').live('click', function (e) {
    var el = $(this), siblings = el.parent().children(), query;
    e.preventDefault();
    if(siblings.length) {
      query = siblings.map(function () {
        return this[$(this).is('select') ? 'value' : 'innerText'];
      }).get().join('');
    } else {
      query = el.text();
    }
    input_el.val(query);
    form.submit();
  });
  
  $('select.search-helper').live('change', function () {
    var el = $(this), filter = el.attr('data-search-filter');
    $('select.search-helper[data-search-filter=' + filter + ']').val(el.val());
  });
  
  function prepBuildHelper(type, getSet) {
    return function (objs) {
      var select = $('<select/>',
        {'class': 'search-helper', 'data-search-filter': type}),
        span = $('span.search-helper[data-search-filter=' + type + ']');
      objs = getSet(objs);
      for(var i = 0, l = objs.length; i < l; i++) {
        $('<option/>', {text: objs[i].name}).appendTo(select);
      }
      span.replaceWith(function () {
        return select.clone().fadeIn('fast');
      });
    }
  }
  
  function getSpecies(x) { return x.species }
  
  wardrobe.item_zone_sets.bind('update', prepBuildHelper('type', function (x) {
    return x;
  }));
  
  wardrobe.pet_attributes.bind('update', prepBuildHelper('species', getSpecies));
  wardrobe.pet_attributes.bind('update', prepBuildHelper('only', getSpecies));
}

View.Title = function (wardrobe) {
  wardrobe.base_pet.bind('updateName', function (name) {
    $('#title').text("Planning " + name + "'s outfit");
  });
}

$.ajaxSetup({
  error: function (xhr) {
    $.jGrowl("There was an error loading that last resource. Oops. Please try again!");
  }
});

main_wardrobe = new Wardrobe();
main_wardrobe.registerViews(View);
main_wardrobe.initialize();
