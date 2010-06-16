var View = {}, main_wardrobe;

function Wardrobe() {
  var wardrobe = this;
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
  
  function Cache() {}

  Cache.prototype.deepGet = function () {
    var scope = this, i;
    $.each(arguments, function () {
      scope = scope[this];
      if(typeof scope == 'undefined') return false;
    });
    return scope;
  }

  Cache.prototype.deepSet = function () {
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
    
    this.toString = function () {
      return 'PetType{color_id: ' + this.color_id + ', species_id: ' +
        this.species_id + '}';
    }
  }
  
  PetType.cache_by_color_and_species = new Cache();
  
  PetType.findOrCreateByColorAndSpecies = function (color_id, species_id) {
    var pet_type = PetType.cache_by_color_and_species.deepGet(color_id, species_id);
    if(!pet_type) {
      pet_type = new PetType();
      pet_type.color_id = color_id;
      pet_type.species_id = species_id;
    }
    return pet_type;
  }
  
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
          pet_state.assets = data;
          success(pet_state);
        });
      }
    }
  }
  
  this.outfit = new function Outfit() {
    var outfit = this, loading_pet_type;
    
    function petStateOnLoad(pet_state) {
      wardrobe.events.trigger('updatePetState', pet_state);
    }
    
    function petTypeOnLoad(pet_type) {
      if(pet_type == loading_pet_type) {
        this.pet_type = pet_type;
        wardrobe.events.trigger('updatePetType', pet_type);
        pet_type.pet_states[0].assets.load(petStateOnLoad);
      }
    }
    
    function petTypeOnError(pet_type) {
      if(pet_type == loading_pet_type) {
        wardrobe.events.trigger('petTypeNotFound', pet_type);
        loading_pet_type = null;
      }
    }
    
    this.setPetTypeByColorAndSpecies = function (color_id, species_id) {
      loading_pet_type = PetType.findOrCreateByColorAndSpecies(color_id, species_id);
      loading_pet_type.load(petTypeOnLoad, petTypeOnError);
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

View.Console = function (wardrobe) {
  var log = (typeof console == 'undefined' || typeof console.log != 'function') ?
    $.noop : $.proxy(console, 'log');
  
  wardrobe.bind('initialize', function () {
    log('Welcome to the Wardrobe!');
  });
  
  $.each(['log', 'updatePetType', 'updatePetState'], function () {
    wardrobe.bind(this, log);
  });
  
  wardrobe.bind('petTypeNotFound', function (pet_type) {
    log(pet_type.toString() + ' not found');
  });
}

View.Hash = function (wardrobe) {
  var data = {}, previous_query, TYPES = {
    INTEGER: 1,
    ARRAY: 2
  }, KEYS = {
    color: TYPES.INTEGER,
    species: TYPES.INTEGER,
    objects: TYPES.ARRAY
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
        key = key_value[0], value = key_value[1];
      if(KEYS[key]) {
        if(KEYS[key] == TYPES.INTEGER) value = +value;
        new_data[key] = value;
      }
    });
    
    if(new_data.color !== data.color || new_data.species !== data.species) {
      wardrobe.outfit.setPetTypeByColorAndSpecies(new_data.color, new_data.species);
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

main_wardrobe = new Wardrobe();
main_wardrobe.registerViews(View);
main_wardrobe.initialize();
