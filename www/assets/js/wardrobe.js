var View={},main_wardrobe;window.log=window.SWFLog=$.noop;function arraysMatch(c,l){var h;if(!$.isArray(c)||!$.isArray(l))return c==l;h=[];if(!c[0]||!l[0])return false;if(c.length!=l.length)return false;for(var f=0;f<c.length;f++){key=typeof c[f]+"~"+c[f];if(h[key])h[key]++;else h[key]=1}for(f=0;f<l.length;f++){key=typeof l[f]+"~"+l[f];if(h[key])if(h[key]==0)return false;else h[key]--;else return false}return true}Array.prototype.map=function(c){return $.map(this,function(l){return l[c]})};
function DeepObject(){}DeepObject.prototype.deepGet=function(){var c=this;$.each(arguments,function(){c=c[this];if(typeof c=="undefined")return false});return c};DeepObject.prototype.deepSet=function(){var c=$.proxy(Array.prototype.pop,"apply"),l=c(arguments);c=c(arguments);var h=this;$.each(arguments,function(){if(typeof h[this]=="undefined")h[this]={};h=h[this]});h[c]=l};
function Wardrobe(){function c(){var a;for(this.restricted_zones=[];(a=this.zones_restrict.indexOf(1,a)+1)!=0;)this.restricted_zones.push(a)}function l(a){for(var b in a)if(a.hasOwnProperty(b))this[b]=a[b]}function h(a){l.apply(this,[a]);c.apply(this)}function f(a){l.apply(this,[a])}function j(a){var b=this;this.id=a;this.assets_by_body_id={};this.loaded=this.load_started=false;this.getAssetsFitting=function(e){return this.assets_by_body_id[e.body_id]||[]};this.hasAssetsFitting=function(e){return typeof b.assets_by_body_id[e.body_id]!=
"undefined"};this.update=function(e){for(var k in e)if(e.hasOwnProperty(k)&&k!="id")b[k]=e[k];c.apply(this);this.loaded=true};j.cache[a]=this}function p(){}function m(a){var b=this,e=false;this.id=a;this.assets=[];this.loadAssets=function(k){e?k(b):$.getJSON("/biology_assets.json?parent_id="+b.id,function(s){b.assets=$.map(s,function(u){return new h(u)});e=true;k(b)})};m.cache[a]=this}function q(){var a=this;this.loaded=false;this.pet_states=[];this.load=function(b,e){a.loaded?b(a):$.getJSON("/pet_types.json",
{"for":"wardrobe",color_id:a.color_id,species_id:a.species_id},function(k){if(k){for(var s in k)if(k.hasOwnProperty(s))a[s]=k[s];for(k=0;k<a.pet_state_ids.length;k++)a.pet_states.push(m.find(a.pet_state_ids[k]));q.cache_by_color_and_species.deepSet(a.color_id,a.species_id,a);a.loaded=true;b(a)}else e(a)})};this.loadItemAssets=function(b,e){for(var k=[],s=0;s<b.length;s++){var u=b[s];j.find(u).hasAssetsFitting(a)||k.push(u)}k.length?$.getJSON("/object_assets.json",{body_id:a.body_id,parent_ids:k},
function(t){$.each(t,function(){var o=j.find(this.parent_id),v=new f(this);if(typeof o.assets_by_body_id[a.body_id]=="undefined")o.assets_by_body_id[a.body_id]=[];o.assets_by_body_id[a.body_id].push(v)});e()}):e()};this.toString=function(){return"PetType{color_id: "+this.color_id+", species_id: "+this.species_id+"}"};this.ownsPetState=function(b){for(var e=0;e<this.pet_states.length;e++)if(this.pet_states[e]==b)return true;return false}}function n(){var a=this;this.events={};this.bind=function(b,
e){if(typeof this.events[b]=="undefined")this.events[b]=[];this.events[b].push(e)};this.events.trigger=function(b){var e;if(a.events[b]){e=Array.prototype.slice.apply(arguments,[1]);$.each(a.events[b],function(){this.apply(a,e)})}}}var d=this;j.find=function(a){var b=j.cache[a];b||(b=new j(a));return b};var g=[];j.loadByIds=function(a,b){var e=[],k=[],s=$.map(a,function(u){var t=j.find(u);if(!t.load_started){e.push(u);t.load_started=true}t.loaded||k.push(u);return t});if(e.length)$.getJSON("/objects.json",
{ids:e},function(u){var t,o,v,i=[];$.each(u,function(){i.push(+this.id);j.find(this.id).update(this)});for(var x=0;x<g.length;x++){t=g[x];u=t[0];o=t[1];t=t[2];v=true;for(var y=0;y<o.length;y++)if($.inArray(o[y],i)==-1){v=false;break}v&&t(u)}b(s)});else k.length?g.push([s,k,b]):b(s);return s};j.cache={};p.loadAll=function(a){$.getJSON("/pet_attributes.json",function(b){a(b)})};m.find=function(a){var b=m.cache[a];b||(b=new m(a));return b};m.cache={};q.cache_by_color_and_species=new DeepObject;q.findOrCreateByColorAndSpecies=
function(a,b){var e=q.cache_by_color_and_species.deepGet(a,b);if(!e){e=new q;e.color_id=a;e.species_id=b}return e};n.Outfit=function(){function a(){var i=[],x=o.items.concat(o.pet_state.assets);$.each(x,function(){i=i.concat(this.restricted_zones)});return i}function b(i){o.events.trigger("updateItemAssets",i)}function e(i){o.events.trigger("updateItems",i)}function k(i){o.events.trigger("updatePetState",i)}function s(i){if(!o.pet_state||!i.ownsPetState(o.pet_state))o.setPetStateById();o.events.trigger("petTypeLoaded",
i);t()}function u(i){o.events.trigger("petTypeNotFound",i)}function t(){o.pet_type&&o.pet_type.loaded&&v.length&&o.pet_type.loadItemAssets(v,b)}var o=this,v=[];this.items=[];this.addItem=function(i){this.items.push(i);v.push(i.id);t();o.events.trigger("updateItems",this.items)};this.getVisibleAssets=function(){for(var i=this.pet_state.assets,x=a(),y=[],z=0;z<o.items.length;z++)i=i.concat(o.items[z].getAssetsFitting(o.pet_type));$.each(i,function(){$.inArray(this.zone_id,x)==-1&&y.push(this)});return y};
this.removeItem=function(i){i=$.inArray(i,this.items);if(i!=-1){this.items.splice(i,1);o.events.trigger("updateItems",this.items)}};this.setPetStateById=function(i){if(!i&&this.pet_type)i=this.pet_type.pet_state_ids[0];if(i){this.pet_state=m.find(i);this.pet_state.loadAssets(k)}};this.setPetTypeByColorAndSpecies=function(i,x){this.pet_type=q.findOrCreateByColorAndSpecies(i,x);o.events.trigger("updatePetType",this.pet_type);this.pet_type.load(s,u)};this.setItemsByIds=function(i){if(i)v=i;if(i&&i.length)this.items=
j.loadByIds(i,e);else{this.items=[];e(this.items)}t()}};n.Closet=function(){function a(k){b.events.trigger("updateItems",k)}var b=this,e=[];this.items=[];this.setItemsByIds=function(k){if(k&&k.length){e=k;this.items=j.loadByIds(k,a)}else{e=k;this.items=[];a(this.items)}}};n.BasePet=function(){var a=this;this.setName=function(b){a.name=b;a.events.trigger("updateName",b)}};n.PetAttributes=function(){function a(e){b.events.trigger("update",e)}var b=this;this.load=function(){p.loadAll(a)}};var r;for(var w in n)if(n.hasOwnProperty(w)){r=
w.replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").toLowerCase();d[r]=new n[w];n.apply(d[r])}this.initialize=function(){var a;for(var b in d.views)if(d.views.hasOwnProperty(b)){a=d.views[b];typeof a.initialize=="function"&&a.initialize()}};this.registerViews=function(a){d.views={};$.each(a,function(b){d.views[b]=new this(d)})}}
if(document.location.search.substr(0,6)=="?debug")View.Console=function(c){if(typeof console!="undefined"&&typeof console.log=="function")window.log=$.proxy(console,"log");this.initialize=function(){log("Welcome to the Wardrobe!")};for(var l=["updateItems","updateItemAssets","updatePetType","updatePetState"],h=0;h<l.length;h++)(function(f){c.outfit.bind(f,function(j){log(f,j)})})(l[h]);c.outfit.bind("petTypeNotFound",function(f){log(f.toString()+" not found")})};
View.Closet=function(c){function l(q){for(var n,d,g=c.closet.items,r=0;r<g.length;r++){n=g[r];d=$.inArray(n,q)!=-1;$("li.object-"+n.id).toggleClass("worn",d).data({item:n,worn:d}).children("a.control-set").remove().end().append(f[d].clone())}}for(var h=$("#closet ul"),f={},j,p,m=0;m<2;m++){j=m==0;p="control-set-"+(j?"worn":"unworn");f[j]=$("<a/>",{"class":"control-set "+p,href:"#",text:j?"Unwear":"Wear"});(function(q){$("a."+p).live("click",function(n){var d=$(this).parent().data("item");!q?c.outfit.addItem(d):
c.outfit.removeItem(d);n.preventDefault()})})(j)}c.closet.bind("updateItems",function(q){var n,d;h.children().remove();for(var g=0;g<q.length;g++){n=q[g];d=$("<li/>",{"class":"object object-"+n.id});img=$("<img/>",{src:n.thumbnail_url,alt:n.description,title:n.description});d.append(img).append(n.name).appendTo(h)}l(c.outfit.items)});c.outfit.bind("updateItems",l)};
View.Hash=function(c){function l(){var d=(document.location.hash||document.location.search).substr(1);if(d!=j){var g={},r=d.split("&");p=true;for(var w=0;w<r.length;w++){var a=r[w].split("="),b=decodeURIComponent(a[0]);if(a=decodeURIComponent(a[1]))if(q[b]==m.INTEGER)g[b]=+a;else if(q[b]==m.STRING)g[b]=a;else if(b.substr(b.length-2)=="[]"){b=b.substr(0,b.length-2);if(q[b]==m.INTEGER_ARRAY){if(typeof g[b]=="undefined")g[b]=[];g[b].push(+a)}}}if(g.color!==f.color||g.species!==f.species)c.outfit.setPetTypeByColorAndSpecies(g.color,
g.species);if(g.closet)arraysMatch(g.closet,f.closet)||c.closet.setItemsByIds(g.closet.slice(0));else arraysMatch(g.objects,f.closet)||c.closet.setItemsByIds(g.objects.slice(0));arraysMatch(g.objects,f.objects)||c.outfit.setItemsByIds(g.objects.slice(0));g.name!=f.name&&g.name&&c.base_pet.setName(g.name);g.state!=f.state&&c.outfit.setPetStateById(g.state);f=g;p=false;n();j=d}}function h(d){var g;if(!p){for(var r in d)if(d.hasOwnProperty(r)){g=d[r];if(g===undefined)delete f[r];else f[r]=d[r]}j=d=$.param(f).replace(/%5B%5D/g,
"[]");document.location.hash="#"+d;n()}}var f={},j,p=false,m={INTEGER:1,STRING:2,INTEGER_ARRAY:3},q={closet:m.INTEGER_ARRAY,color:m.INTEGER,name:m.STRING,objects:m.INTEGER_ARRAY,species:m.INTEGER,state:m.INTEGER},n;this.initialize=function(){l();setInterval(l,100)};c.outfit.bind("updateItems",function(d){d=d.map("id");var g={};if(!arraysMatch(d,f.objects))g.objects=d;g.closet=arraysMatch(d,f.closet)||arraysMatch(d,f.objects)?undefined:c.closet.items.map("id");if(g.objects||g.closet)h(g)});c.outfit.bind("updatePetType",
function(d){if(d.color_id!=f.color||d.species_id!=f.species)h({color:d.color_id,species:d.species_id,state:undefined})});c.outfit.bind("petTypeNotFound",function(){window.history.back()});c.outfit.bind("updatePetState",function(d){var g=c.outfit.pet_type;if(d.id!=f.state&&g&&(f.state||d.id!=g.pet_state_ids[0]))h({state:d.id})});(function(){ZeroClipboard.setMoviePath("/assets/swf/ZeroClipboard.swf");var d=$("#shorten-url-response"),g=$("#shorten-url-form"),r=$("#shorten-url-response-form"),w=$("#shorten-url-loading"),
a=new ZeroClipboard.Client,b=false;n=function(){g.show();w.hide();r.hide()};BitlyCB.wardrobeSelfShorten=function(e){var k;try{k=e.results[document.location.href].hash}catch(s){log("shortener error: likely no longer same URL",s)}e="http://outfits.openneo.net/"+k;g.hide();r.show();if(!b){a.glue("shorten-url-copy-button","shorten-url-copy-button-wrapper");b=true}d.text(e);a.setText(e)};g.submit(function(e){BitlyClient.shorten(document.location.href,"BitlyCB.wardrobeSelfShorten");w.show();e.preventDefault()});
r.submit(function(e){e.preventDefault()})})()};
View.Preview=function(c){function l(){var j;if(f)return false;if(h&&h.setAssets){j=c.outfit.getVisibleAssets();h.setAssets(j)}else f=true}$("#preview");var h,f=false;swfobject.embedSWF("/assets/swf/preview.swf?v=0.11","preview-swf","100%","100%","9","/assets/js/swfobject/expressInstall.swf",{swf_assets_path:"/assets"},{wmode:"transparent"});window.previewSWFIsReady=function(){h=document.getElementById("preview-swf");if(f){f=false;l()}};c.outfit.bind("updateItems",l);c.outfit.bind("updateItemAssets",
l);c.outfit.bind("updatePetState",l)};
View.PetStateForm=function(c){function l(p){if(p){f.children("li.selected").removeClass("selected");$(j+"[value="+p.id+"]").attr("checked","checked").parent().addClass("selected")}}var h=$("#pet-state-form"),f=h.children("ul"),j="#pet-state-form input[name=pet_state_id]";$(j).live("click",function(){c.outfit.setPetStateById(+this.value)});c.outfit.bind("petTypeLoaded",function(p){p=p.pet_state_ids;var m,q,n,d;f.children().remove();if(p.length==1)h.hide();else{h.show();for(m=0;m<p.length;m++){q="pet-state-radio-"+
m;n=$("<li/>");d=$("<input/>",{id:q,name:"pet_state_id",type:"radio",value:p[m]});q=$("<label/>",{"for":q,text:m+1});m==0&&d.attr("checked","checked");d.appendTo(n);q.appendTo(n);n.appendTo(f)}l(c.outfit.pet_state)}});c.outfit.bind("updatePetState",l)};
View.PetTypeForm=function(c){function l(j){f&&j&&$.each(h,function(p){h[p].val(j[p+"_id"])})}var h={},f=false;$("#pet-type-form").submit(function(j){j.preventDefault();c.outfit.setPetTypeByColorAndSpecies(+h.color.val(),+h.species.val())}).children("select").each(function(){h[this.name]=$(this)});this.initialize=function(){c.pet_attributes.load()};c.pet_attributes.bind("update",function(j){$.each(j,function(p){var m=h[p];$.each(this,function(){$("<option/>",{text:this.name,value:this.id}).appendTo(m)})});
f=true;l(c.outfit.pet_type)});c.outfit.bind("updatePetType",l)};View.Title=function(c){c.base_pet.bind("updateName",function(l){$("#title").text("Planning "+l+"'s outfit")})};main_wardrobe=new Wardrobe;main_wardrobe.registerViews(View);main_wardrobe.initialize();