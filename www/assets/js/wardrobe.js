var View={},main_wardrobe;window.log=$.noop;function DeepObject(){}DeepObject.prototype.deepGet=function(){var e=this;$.each(arguments,function(){e=e[this];if(typeof e=="undefined")return false});return e};DeepObject.prototype.deepSet=function(){var e=$.proxy(Array.prototype.pop,"apply"),h=e(arguments);e=e(arguments);var i=this;$.each(arguments,function(){if(typeof i[this]=="undefined")i[this]={};i=i[this]});i[e]=h};
function Wardrobe(){function e(){var a;for(this.restricted_zones=[];(a=this.zones_restrict.indexOf(1,a)+1)!=0;)this.restricted_zones.push(a)}function h(a){for(var b in a)if(a.hasOwnProperty(b))this[b]=a[b]}function i(a){h.apply(this,[a]);e.apply(this)}function j(a){h.apply(this,[a])}function g(a){var b=this;this.id=a;this.assets=[];this.loaded=false;this.update=function(c){$.each(c,function(l,k){b[l]=k});e.apply(this);this.loaded=true};g.cache[a]=this}function p(a){var b=this;this.id=a;this.assets=
[];this.assets.load=function(c){$.getJSON("/biology_assets.json?parent_id="+b.id,function(l){b.assets=$.map(l,function(k){return new i(k)});c(b)})}}function n(){var a=this,b=false;this.pet_states=[];this.load=function(c,l){b?c(a):$.getJSON("/pet_types.json",{"for":"wardrobe",color_id:a.color_id,species_id:a.species_id},function(k){if(k){$.each(k,function(o){a[o]=this});$.each(a.pet_state_ids,function(){a.pet_states.push(new p(this))});n.cache_by_color_and_species.deepSet(a.color_id,a.species_id,a);
b=true;c(a)}else l(a)})};this.loadItemAssets=function(c,l){$.getJSON("/object_assets.json?body_id="+a.body_id,{parent_ids:c},function(k){var o=[];$.each(k,function(){var s=g.find(this.parent_id),m=new j(this);s.assets.push(m);o.push(m)});l(o)})};this.toString=function(){return"PetType{color_id: "+this.color_id+", species_id: "+this.species_id+"}"}}var f=this;this.events={};this.events.trigger=function(a){var b;if(f.events[a]){b=Array.prototype.slice.apply(arguments,[1]);$.each(f.events[a],function(){this.apply(f,
b)})}};g.find=function(a){var b=g.cache[a];b||(b=new g(a));return b};g.loadByIds=function(a,b){var c=[],l=$.map(a,function(k){var o=g.find(k);o.loaded||c.push(k);return o});c.length?$.getJSON("/objects.json",{ids:c},function(k){$.each(k,function(){g.find(this.id).update(this)});b(l)}):b(l);return l};g.cache={};n.cache_by_color_and_species=new DeepObject;n.findOrCreateByColorAndSpecies=function(a,b){var c=n.cache_by_color_and_species.deepGet(a,b);if(!c){c=new n;c.color_id=a;c.species_id=b}return c};
this.outfit=new (function(){function a(){var d=[],q=m.items.concat(m.pet_state.assets);$.each(q,function(){d=d.concat(this.restricted_zones)});return d}function b(d){f.events.trigger("updateItemAssets",d)}function c(d){f.events.trigger("updateItems",d)}function l(d){m.pet_state=d;f.events.trigger("updatePetState",d)}function k(d){if(d==r){m.pet_type=d;f.events.trigger("updatePetType",d);d.pet_states[0].assets.load(l);s()}}function o(d){if(d==r){f.events.trigger("petTypeNotFound",d);r=null}}function s(){m.pet_type&&
t.length&&m.pet_type.loadItemAssets(t,b)}var m=this,r,t=[];this.items=[];this.getVisibleAssets=function(){var d=[],q=a(),u=m.items.concat([m.pet_state]);$.each(u,function(){$.each(this.assets,function(){$.inArray(this.zone_id,q)==-1&&d.push(this)})});return d};this.setPetTypeByColorAndSpecies=function(d,q){r=n.findOrCreateByColorAndSpecies(d,q);r.load(k,o)};this.setItemsByIds=function(d){t=d;if(d.length)this.items=g.loadByIds(d,c);s()}});this.bind=function(a,b){if(typeof this.events[a]=="undefined")this.events[a]=
[];this.events[a].push(b)};this.initialize=function(){this.events.trigger("initialize")};this.registerViews=function(a){$.each(a,function(){this(f)})}}
if(document.location.search.substr(0,6)=="?debug")View.Console=function(e){if(typeof console!="undefined"&&typeof console.log=="function")window.log=$.proxy(console,"log");e.bind("initialize",function(){log("Welcome to the Wardrobe!")});$.each(["updateItems","updateItemAssets","updatePetType","updatePetState"],function(){var h=this;e.bind(h,function(i){log(h,i)})});e.bind("petTypeNotFound",function(h){log(h.toString()+" not found")})};
View.Hash=function(e){function h(){var f=(document.location.hash||document.location.search).substr(1);if(f!=g){i(f);g=f}}function i(f){var a={};$.each(f.split("&"),function(){var b=this.split("="),c=decodeURIComponent(b[0]);if(b=decodeURIComponent(b[1]))if(n[c]==p.INTEGER)a[c]=+b;else if(c.substr(c.length-2)=="[]"){c=c.substr(0,c.length-2);if(n[c]==p.INTEGER_ARRAY){if(typeof a[c]=="undefined")a[c]=[];a[c].push(+b)}}});if(a.color!==j.color||a.species!==j.species)e.outfit.setPetTypeByColorAndSpecies(a.color,
a.species);a.objects!==j.objects&&e.outfit.setItemsByIds(a.objects);j=a}var j={},g,p={INTEGER:1,ARRAY:2},n={color:p.INTEGER,species:p.INTEGER,objects:p.INTEGER_ARRAY};e.bind("initialize",function(){h();setInterval(h,100)});e.bind("updatePetType",function(f){if(f.color_id!=j.color||f.species_id!=j.species){j.color=f.color_id;j.species=f.species_id;g=f=$.param(j);document.location.hash="#"+f}})};
View.Preview=function(e){function h(){var g;if(j)return false;if(i&&i.setAssets){log("Getting assets");g=e.outfit.getVisibleAssets();log("Setting assets");log(g);i.setAssets(g)}else{log("Will set assets once SWF is ready");j=true}}$("#preview");var i,j=false;swfobject.embedSWF("/assets/swf/preview.swf?v=0.10","preview-swf","100%","100%","9","/assets/js/swfobject/expressInstall.swf",{swf_assets_path:"/assets"},{wmode:"transparent"});window.previewSWFIsReady=function(){log("Preview SWF is ready");i=
document.getElementById("preview-swf");if(j){log("About to set assets");j=false;h()}};e.bind("updateItems",h);e.bind("updateItemAssets",h);e.bind("updatePetState",h)};main_wardrobe=new Wardrobe;main_wardrobe.registerViews(View);main_wardrobe.initialize();