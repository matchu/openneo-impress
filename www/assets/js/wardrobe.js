var View={},Partial={},main_wardrobe,ITEMS_SERVER="items.impress.openneo.net";if(document.location.hostname.substr(0,5)=="beta.")ITEMS_SERVER="beta."+ITEMS_SERVER;ITEMS_SERVER="http://"+ITEMS_SERVER;window.log=window.SWFLog=$.noop;
function arraysMatch(c,m){var o;if(!$.isArray(c)||!$.isArray(m))return c==m;o=[];if(!c[0]||!m[0])return false;if(c.length!=m.length)return false;for(var i=0;i<c.length;i++){key=typeof c[i]+"~"+c[i];if(o[key])o[key]++;else o[key]=1}for(i=0;i<m.length;i++){key=typeof m[i]+"~"+m[i];if(o[key])if(o[key]==0)return false;else o[key]--;else return false}return true}Array.prototype.map=function(c){return $.map(this,function(m){return m[c]})};function DeepObject(){}
DeepObject.prototype.deepGet=function(){var c=this;$.each(arguments,function(){c=c[this];if(typeof c=="undefined")return false});return c};DeepObject.prototype.deepSet=function(){var c=$.proxy(Array.prototype.pop,"apply"),m=c(arguments);c=c(arguments);var o=this;$.each(arguments,function(){if(typeof o[this]=="undefined")o[this]={};o=o[this]});o[c]=m};
function Wardrobe(){function c(){var a;for(this.restricted_zones=[];(a=this.zones_restrict.indexOf(1,a)+1)!=0;)this.restricted_zones.push(a)}function m(a){for(var d in a)if(a.hasOwnProperty(d))this[d]=a[d]}function o(a){m.apply(this,[a]);c.apply(this)}function i(a){m.apply(this,[a])}function l(a){var d=this;this.id=a;this.assets_by_body_id={};this.loaded=this.load_started=false;this.getAssetsFitting=function(f){return this.assets_by_body_id[f.body_id]||[]};this.hasAssetsFitting=function(f){return typeof d.assets_by_body_id[f.body_id]!=
"undefined"&&d.assets_by_body_id[f.body_id].length>0};this.couldNotLoadAssetsFitting=function(f){return typeof d.assets_by_body_id[f.body_id]!="undefined"&&d.assets_by_body_id[f.body_id].length==0};this.update=function(f){for(var g in f)if(f.hasOwnProperty(g)&&g!="id")d[g]=f[g];c.apply(this);this.loaded=true};l.cache[a]=this}function s(a){this.name=a}function r(){}function u(a){var d=this,f=false;this.id=a;this.assets=[];this.loadAssets=function(g){f?g(d):$.getJSON("/biology_assets.json?parent_id="+
d.id,function(t){d.assets=$.map(t,function(q){return new o(q)});f=true;g(d)})};u.cache[a]=this}function j(){var a=this;this.loaded=false;this.pet_states=[];this.load=function(d,f){a.loaded?d(a):$.getJSON("/pet_types.json",{"for":"wardrobe",color_id:a.color_id,species_id:a.species_id},function(g){if(g){for(var t in g)if(g.hasOwnProperty(t))a[t]=g[t];for(g=0;g<a.pet_state_ids.length;g++)a.pet_states.push(u.find(a.pet_state_ids[g]));j.cache_by_color_and_species.deepSet(a.color_id,a.species_id,a);a.loaded=
true;d(a)}else f(a)})};this.loadItemAssets=function(d,f){for(var g=[],t=0;t<d.length;t++){var q=d[t];l.find(q).hasAssetsFitting(a)||g.push(q)}g.length?$.getJSON("/object_assets.json",{body_id:a.body_id,parent_ids:g},function(h){$.each(h,function(){var v=l.find(this.parent_id),C=new i(this);if(typeof v.assets_by_body_id[a.body_id]=="undefined")v.assets_by_body_id[a.body_id]=[];v.assets_by_body_id[a.body_id].push(C)});for(var z=0,n=d.length;z<n;z++){h=l.find(d[z]);h.hasAssetsFitting(a)||(h.assets_by_body_id[a.body_id]=
[])}f()}):f()};this.toString=function(){return"PetType{color_id: "+this.color_id+", species_id: "+this.species_id+"}"};this.ownsPetState=function(d){for(var f=0;f<this.pet_states.length;f++)if(this.pet_states[f]==d)return true;return false}}function b(){var a=this;this.events={};this.bind=function(d,f){if(typeof this.events[d]=="undefined")this.events[d]=[];this.events[d].push(f)};this.events.trigger=function(d){var f;if(a.events[d]){f=Array.prototype.slice.apply(arguments,[1]);$.each(a.events[d],
function(){this.apply(a,f)})}}}var e=this;l.find=function(a){var d=l.cache[a];d||(d=new l(a));return d};var p=[];l.loadByIds=function(a,d){var f=[],g=[],t=$.map(a,function(q){var h=l.find(q);if(!h.load_started){f.push(q);h.load_started=true}h.loaded||g.push(q);return h});if(f.length)$.getJSON("/objects.json",{ids:f},function(q){var h,z,n,v=[];$.each(q,function(){v.push(+this.id);l.find(this.id).update(this)});for(var C=0;C<p.length;C++){h=p[C];q=h[0];z=h[1];h=h[2];n=true;for(var B=0;B<z.length;B++)if($.inArray(z[B],
v)==-1){n=false;break}n&&h(q)}d(t)});else g.length?p.push([t,g,d]):d(t);return t};var k=ITEMS_SERVER+"/index.js?callback=?";l.PER_PAGE=21;l.loadByQuery=function(a,d,f,g){var t=Math.round(d/l.PER_PAGE)+1;$.getJSON(k,{q:a,per_page:l.PER_PAGE,page:t},function(q){var h=[],z,n;if(q.items){for(var v=0;v<q.items.length;v++){n=q.items[v];z=l.find(n.id);z.update(n);h.push(z)}f(h,q.total_pages,t)}else q.error&&g(q.error)})};l.cache={};s.loadAll=function(a){$.getJSON(ITEMS_SERVER+"/item_zone_sets.js?callback=?",
function(d){for(var f=0,g=d.length;f<g;f++)s.all.push(new s(d[f]));a(s.all)})};s.all=[];r.loadAll=function(a){$.getJSON("/pet_attributes.json",function(d){a(d)})};u.find=function(a){var d=u.cache[a];d||(d=new u(a));return d};u.cache={};j.cache_by_color_and_species=new DeepObject;j.findOrCreateByColorAndSpecies=function(a,d){var f=j.cache_by_color_and_species.deepGet(a,d);if(!f){f=new j;f.color_id=a;f.species_id=d}return f};b.all={};b.all.Outfit=function(){function a(){var n=[],v=h.items.concat(h.pet_state.assets);
$.each(v,function(){n=n.concat(this.restricted_zones)});return n}function d(n){h.events.trigger("updateItems",n)}function f(n){h.events.trigger("updatePetState",n)}function g(n){if(!h.pet_state||!n.ownsPetState(h.pet_state))h.setPetStateById();h.events.trigger("petTypeLoaded",n);q()}function t(n){h.events.trigger("petTypeNotFound",n)}function q(n){h.pet_type&&h.pet_type.loaded&&z.length&&h.pet_type.loadItemAssets(z,function(){var v,C,B,G,D,H=[],I=[];if(n){v=n.getAssetsFitting(h.pet_type).map("zone_id");
C=v.length;for(var E=0;E<h.items.length;E++){B=h.items[E];G=B.getAssetsFitting(h.pet_type).map("zone_id");D=true;if(B!=n)for(var F=0;F<C;F++)if($.inArray(v[F],G)!=-1){D=false;break}if(D){H.push(B);I.push(B.id)}}h.items=H;z=I;h.events.trigger("updateItems",h.items)}h.events.trigger("updateItemAssets")})}var h=this,z=[];this.items=[];this.addItem=function(n){if($.inArray(n,h.items)==-1){this.items.push(n);z.push(n.id);q(n);h.events.trigger("updateItems",this.items)}};this.getVisibleAssets=function(){for(var n=
this.pet_state.assets,v=a(),C=[],B=0;B<h.items.length;B++)n=n.concat(h.items[B].getAssetsFitting(h.pet_type));$.each(n,function(){$.inArray(this.zone_id,v)==-1&&C.push(this)});return C};this.removeItem=function(n){var v=$.inArray(n,this.items);if(v!=-1){this.items.splice(v,1);n=$.inArray(n.id,z);z.splice(n,1);h.events.trigger("updateItems",this.items)}};this.setPetStateById=function(n){if(!n&&this.pet_type)n=this.pet_type.pet_state_ids[0];if(n){this.pet_state=u.find(n);this.pet_state.loadAssets(f)}};
this.setPetTypeByColorAndSpecies=function(n,v){this.pet_type=j.findOrCreateByColorAndSpecies(n,v);h.events.trigger("updatePetType",this.pet_type);this.pet_type.load(g,t)};this.setItemsByIds=function(n){if(n)z=n;if(n&&n.length)this.items=l.loadByIds(n,d);else{this.items=[];d(this.items)}q()}};b.all.Closet=function(){function a(g){d.events.trigger("updateItems",g)}var d=this,f=[];this.items=[];this.addItem=function(g){if($.inArray(g,d.items)==-1){this.items.push(g);f.push(g.id);d.events.trigger("updateItems",
this.items)}};this.removeItem=function(g){var t=$.inArray(g,this.items);if(t!=-1){this.items.splice(t,1);g=$.inArray(g.id,f);f.splice(g,1);d.events.trigger("updateItems",this.items)}};this.setItemsByIds=function(g){if(g&&g.length){f=g;this.items=l.loadByIds(g,a)}else{f=g;this.items=[];a(this.items)}}};b.all.BasePet=function(){var a=this;this.setName=function(d){a.name=d;a.events.trigger("updateName",d)}};b.all.PetAttributes=function(){function a(f){d.events.trigger("update",f)}var d=this;this.load=
function(){r.loadAll(a)}};b.all.ItemZoneSets=function(){function a(f){d.events.trigger("update",f)}var d=this;this.load=function(){s.loadAll(a)}};b.all.Search=function(){function a(g,t,q){f.events.trigger("updateItems",g);f.events.trigger("updatePagination",q,t)}function d(g){f.events.trigger("error",g)}var f=this;this.request={};this.setItemsByQuery=function(g,t){var q=t.offset?t.offset:l.PER_PAGE*(t.page-1);f.request={query:g,offset:q};f.events.trigger("updateRequest",f.request);if(g){l.loadByQuery(g,
q,a,d);f.events.trigger("startRequest")}else{f.events.trigger("updateItems",[]);f.events.trigger("updatePagination",0,0)}};this.setPerPage=function(g){l.PER_PAGE=g}};var A;for(var w in b.all)if(b.all.hasOwnProperty(w)){A=w.replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").toLowerCase();e[A]=new b.all[w];b.apply(e[A])}this.initialize=function(){var a;for(var d in e.views)if(e.views.hasOwnProperty(d)){a=e.views[d];typeof a.initialize=="function"&&a.initialize()}};this.registerViews=
function(a){e.views={};$.each(a,function(d){e.views[d]=new this(e)})}}
Partial.ItemSet=function(c,m){function o(b){return function(e){for(var p,k=0;k<s.length;k++){p=s[k];in_set=$.inArray(p,e)!=-1;$("li.object-"+p.id).toggleClass(b,in_set).data("item",p).data(b,in_set).children("ul").children("li.control-set-for-"+b).remove().end()[b=="worn"?"prepend":"append"](Partial.ItemSet.CONTROL_SETS[b][in_set].clone())}}}function i(b){for(var e,p,k=0,A=b.length;k<A;k++){e=b[k];p=e.couldNotLoadAssetsFitting(c.outfit.pet_type);$("li.object-"+e.id).toggleClass("no-assets",p)}}var l=
$(m),s=[],r,u,j;Partial.ItemSet.setWardrobe(c);r=o("closeted");j=o("worn");u=function(b){j(b);i(b)};this.setItems=function(b){var e,p;s=b;l.children().remove();for(var k=0;k<s.length;k++){b=s[k];e=$("<li/>",{"class":"object object-"+b.id});img=$("<img/>",{src:b.thumbnail_url,alt:b.description,title:b.description});p=$("<ul/>");e.append(img).append(p).append(b.name).appendTo(l)}r(c.closet.items);u(c.outfit.items)};c.outfit.bind("updateItemAssets",function(){i(c.outfit.items)});c.outfit.bind("updateItems",
u);c.closet.bind("updateItems",r)};Partial.ItemSet.CONTROL_SETS={};
Partial.ItemSet.setWardrobe=function(c){for(var m,o,i,l,s,r={},u=0;u<2;u++){m=u==0?"worn":"closeted";o=u==0?["Unwear","Wear"]:["Uncloset","Closet"];Partial.ItemSet.CONTROL_SETS[m]={};for(var j=0;j<2;j++){i=j==0;s="control-set control-set-for-"+m;l="control-set-"+(i?"":"not-")+m;s+=" "+l;Partial.ItemSet.CONTROL_SETS[m][i]=$("<a/>",{href:"#",text:o[i?0:1]}).wrap("<li/>").parent().attr("class",s);(function(b,e){$("li."+l+" a").live("click",function(p){var k=$(this).closest(".object").data("item");r[b][!e](k);
p.preventDefault()})})(m,i)}}r.closeted={};r.closeted[true]=$.proxy(c.closet,"addItem");r.closeted[false]=function(b){c.outfit.removeItem(b);c.closet.removeItem(b)};r.worn={};r.worn[true]=function(b){c.closet.addItem(b);c.outfit.addItem(b)};r.worn[false]=$.proxy(c.outfit,"removeItem");Partial.ItemSet.setWardrobe=$.noop};
if(document.location.search.substr(0,6)=="?debug")View.Console=function(c){if(typeof console!="undefined"&&typeof console.log=="function")window.log=$.proxy(console,"log");this.initialize=function(){log("Welcome to the Wardrobe!")};for(var m=["updateItems","updateItemAssets","updatePetType","updatePetState"],o=0;o<m.length;o++)(function(i){c.outfit.bind(i,function(l){log(i,l)})})(m[o]);c.outfit.bind("petTypeNotFound",function(i){log(i.toString()+" not found")})};
View.Closet=function(c){var m=new Partial.ItemSet(c,"#preview-closet ul");c.closet.bind("updateItems",$.proxy(m,"setItems"))};
View.Fullscreen=function(c){function m(){if(o){r=$("#preview-swf");var j={height:s.offset().top-l.offset().top,width:l.innerWidth()-u.outerWidth()-12},b={},e={},p={old:{height:r.height(),width:r.width()},next:{}};if(j.height>j.width){b.larger="height";b.smaller="width";e.active="marginTop";e.inactive="marginLeft"}else{b.larger="width";b.smaller="height";e.active="marginLeft";e.inactive="marginTop"}p.next[b.smaller]=j[b.smaller];p.next[b.larger]=j[b.smaller];p.next[e.active]=(j[b.larger]-p.next[b.larger])/
2;p.next[e.inactive]=0;r.css(p.next);l.height(j.height)}}var o=$(document.body).hasClass("fullscreen"),i=$(window),l=$("#preview"),s=$("#preview-search-form"),r=$("#preview-swf"),u=$("#preview-closet");$("#footer");$("#preview").data("fit",m);i.resize(m).load(m);m();konami=new (function(){var j={addEvent:function(b,e,p,k){if(b.addEventListener)b.addEventListener(e,p,false);else if(b.attachEvent){b["e"+e+p]=p;b[e+p]=function(){b["e"+e+p](window.event,k)};b.attachEvent("on"+e,b[e+p])}},input:"",pattern:"3838404037393739666513",
load:function(b){this.addEvent(document,"keydown",function(e,p){if(p)j=p;j.input+=e?e.keyCode:event.keyCode;if(j.input.indexOf(j.pattern)!=-1){j.code(b);j.input=""}},this);this.iphone.load(b)},code:function(b){window.location=b},iphone:{start_x:0,start_y:0,stop_x:0,stop_y:0,tap:false,capture:false,keys:["UP","UP","DOWN","DOWN","LEFT","RIGHT","LEFT","RIGHT","TAP","TAP","TAP"],code:function(b){j.code(b)},load:function(b){j.addEvent(document,"touchmove",function(e){if(e.touches.length==1&&j.iphone.capture==
true){e=e.touches[0];j.iphone.stop_x=e.pageX;j.iphone.stop_y=e.pageY;j.iphone.tap=false;j.iphone.capture=false;j.iphone.check_direction()}});j.addEvent(document,"touchend",function(){j.iphone.tap==true&&j.iphone.check_direction(b)},false);j.addEvent(document,"touchstart",function(e){j.iphone.start_x=e.changedTouches[0].pageX;j.iphone.start_y=e.changedTouches[0].pageY;j.iphone.tap=true;j.iphone.capture=true})},check_direction:function(b){x_magnitude=Math.abs(this.start_x-this.stop_x);y_magnitude=Math.abs(this.start_y-
this.stop_y);x=this.start_x-this.stop_x<0?"RIGHT":"LEFT";y=this.start_y-this.stop_y<0?"DOWN":"UP";result=x_magnitude>y_magnitude?x:y;result=this.tap==true?"TAP":result;if(result==this.keys[0])this.keys=this.keys.slice(1,this.keys.length);this.keys.length==0&&this.code(b)}}};return j});konami.code=function(){$(document.body).removeClass("fullscreen");r.removeAttr("style").css("visibility","visible");l.removeAttr("style");c.search.setPerPage(21);c.search.setItemsByQuery(c.search.request.query,{offset:c.search.request.offset});
o=false};konami.load()};
View.Hash=function(c){function m(){var b=(document.location.hash||document.location.search).substr(1);if(b!=l){var e={},p=b.split("&");s=true;for(var k=0;k<p.length;k++){var A=p[k].split("="),w=decodeURIComponent(A[0]);if(A=decodeURIComponent(A[1]))if(u[w]==r.INTEGER)e[w]=+A;else if(u[w]==r.STRING)e[w]=decodeURIComponent(A).replace(/\+/g," ");else if(w.substr(w.length-2)=="[]"){w=w.substr(0,w.length-2);if(u[w]==r.INTEGER_ARRAY){if(typeof e[w]=="undefined")e[w]=[];e[w].push(+A)}}}if(e.color!==i.color||
e.species!==i.species)c.outfit.setPetTypeByColorAndSpecies(e.color,e.species);if(e.closet)arraysMatch(e.closet,i.closet)||c.closet.setItemsByIds(e.closet.slice(0));else arraysMatch(e.objects,i.closet)||c.closet.setItemsByIds(e.objects.slice(0));arraysMatch(e.objects,i.objects)||c.outfit.setItemsByIds(e.objects.slice(0));e.name!=i.name&&e.name&&c.base_pet.setName(e.name);e.state!=i.state&&c.outfit.setPetStateById(e.state);if(e.search!=i.search||e.search_offset!=i.search_offset)c.search.setItemsByQuery(e.search,
{offset:e.search_offset});i=e;s=false;l=b}}function o(b){var e;if(!s){for(var p in b)if(b.hasOwnProperty(p)){e=b[p];if(e===undefined)delete i[p];else i[p]=b[p]}l=b=$.param(i).replace(/%5B%5D/g,"[]");document.location.hash="#"+b;j()}}var i={},l,s=false,r={INTEGER:1,STRING:2,INTEGER_ARRAY:3},u={closet:r.INTEGER_ARRAY,color:r.INTEGER,name:r.STRING,objects:r.INTEGER_ARRAY,search:r.STRING,search_offset:r.INTEGER,species:r.INTEGER,state:r.INTEGER},j;this.initialize=function(){m();setInterval(m,100);j()};
c.outfit.bind("updateItems",function(b){b=b.map("id");var e={};if(!arraysMatch(b,i.objects))e.objects=b;e.closet=arraysMatch(b,i.closet)||arraysMatch(b,i.objects)?undefined:c.closet.items.map("id");if(e.objects||e.closet)o(e)});c.outfit.bind("updatePetType",function(b){if(b.color_id!=i.color||b.species_id!=i.species)o({color:b.color_id,species:b.species_id,state:undefined})});c.outfit.bind("petTypeNotFound",function(){window.history.back()});c.outfit.bind("updatePetState",function(b){var e=c.outfit.pet_type;
if(b.id!=i.state&&e&&(i.state||b.id!=e.pet_state_ids[0]))o({state:b.id})});c.search.bind("updateRequest",function(b){if(b.offset!=i.search_offset||b.query!=i.search)o({search_offset:b.offset,search:b.query})});(function(){function b(q){if(typeof addthis_share!="undefined"){addthis_share.url=q;A.replaceWith(A.clone());addthis.button(k)}}function e(){if(!g&&!t){g=true;BitlyClient.shorten(f,"BitlyCB."+p)}}var p="shortenResponse",k="#share-button",A=$(k),w=A.parent(),a=$("#short-url-button"),d=$("#short-url-response"),
f,g=false,t=false;j=function(){var q=window.location,h=q.hash;h||(h="#"+q.search.substr(1));f=q.protocol+"//"+q.host+q.pathname+h;b(f);d.hide();t=false};BitlyCB[p]=function(q){var h,z;for(z in q.results){h="http://outfits.openneo.net/"+q.results[z].hash;break}b(h);d.val(h).show();g=false;t=true};a.click(e);w.mouseover(e);A.focus(e);d.mouseover(function(){d.focus().select()})})()};
View.Preview=function(c){function m(){var l;if(i)return false;if(o&&o.setAssets){l=c.outfit.getVisibleAssets();o.setAssets(l)}else i=true}$("#preview");var o,i=false;swfobject.embedSWF("/assets/swf/preview.swf?v=0.11","preview-swf","100%","100%","9","/assets/js/swfobject/expressInstall.swf",{swf_assets_path:"/assets"},{wmode:"transparent"});window.previewSWFIsReady=function(){o=document.getElementById("preview-swf");if(i){i=false;m()}};c.outfit.bind("updateItems",m);c.outfit.bind("updateItemAssets",
m);c.outfit.bind("updatePetState",m)};
View.PetStateForm=function(c){function m(s){if(s){i.children("li.selected").removeClass("selected");$(l+"[value="+s.id+"]").attr("checked","checked").parent().addClass("selected")}}var o=$("#pet-state-form"),i=o.children("ul"),l="#pet-state-form input[name=pet_state_id]";$(l).live("click",function(){c.outfit.setPetStateById(+this.value)});c.outfit.bind("petTypeLoaded",function(s){s=s.pet_state_ids;var r,u,j,b;i.children().remove();if(s.length==1)o.hide();else{o.show();for(r=0;r<s.length;r++){u="pet-state-radio-"+
r;j=$("<li/>");b=$("<input/>",{id:u,name:"pet_state_id",type:"radio",value:s[r]});u=$("<label/>",{"for":u,text:r+1});r==0&&b.attr("checked","checked");b.appendTo(j);u.appendTo(j);j.appendTo(i)}m(c.outfit.pet_state)}});c.outfit.bind("updatePetState",m)};
View.PetTypeForm=function(c){function m(l){i&&l&&$.each(o,function(s){o[s].val(l[s+"_id"])})}var o={},i=false;$("#pet-type-form").submit(function(l){l.preventDefault();c.outfit.setPetTypeByColorAndSpecies(+o.color.val(),+o.species.val())}).children("select").each(function(){o[this.name]=$(this)});this.initialize=function(){c.pet_attributes.load()};c.pet_attributes.bind("update",function(l){$.each(l,function(s){var r=o[s];$.each(this,function(){$("<option/>",{text:this.name,value:this.id}).appendTo(r)})});
i=true;m(c.outfit.pet_type)});c.outfit.bind("updatePetType",m);c.outfit.bind("petTypeNotFound",function(){$("#pet-type-not-found").show("normal").delay(3E3).hide("fast")})};
View.Search=function(c){function m(){var a=Math.floor(i.width()/A);if(a!=k.PER_PAGE){k.PER_PAGE=a;c.search.setPerPage(k.PER_PAGE);if(w){a=w.offset;c.search.setItemsByQuery(s.val(),{offset:a})}}}function o(a,d){return function(f){var g=$("<select/>",{"class":"search-helper","data-search-filter":a}),t=$("span.search-helper[data-search-filter="+a+"]");f=d(f);for(var q=0,h=f.length;q<h;q++)$("<option/>",{text:f[q].name}).appendTo(g);t.replaceWith(function(){return g.clone().fadeIn("fast")})}}var i=$("#preview-search-form"),
l=new Partial.ItemSet(c,"#preview-search-form ul"),s=i.find("input[name=query]"),r=$("#preview-search-form-clear"),u=$("#preview-search-form-error"),j=$("#preview-search-form-help"),b=$("#preview-search-form-loading"),e=$("#preview-search-form-no-results"),p=e.children("span"),k={INNER_WINDOW:4,OUTER_WINDOW:1,GAP_TEXT:"&hellip;",PREV_TEXT:"&larr; Previous",NEXT_TEXT:"Next &rarr;",PAGE_EL:$("<a/>",{href:"#"}),CURRENT_EL:$("<span/>",{"class":"current"}),EL_ID:"#preview-search-form-pagination",PER_PAGE:21},
A=112,w;k.EL=$(k.EL_ID);k.GAP_EL=$("<span/>",{"class":"gap",html:k.GAP_TEXT});k.PREV_EL=$("<a/>",{href:"#",rel:"prev",html:k.PREV_TEXT});k.NEXT_EL=$("<a/>",{href:"#",rel:"next",html:k.NEXT_TEXT});$(k.EL_ID+" a").live("click",function(a){a.preventDefault();a=$(this).data("page");c.search.setItemsByQuery(s.val(),{page:a})});this.initialize=$.proxy(c.item_zone_sets,"load");c.search.setPerPage(k.PER_PAGE);$(window).resize(m).load(m);m();i.submit(function(a){a.preventDefault();c.search.setItemsByQuery(s.val(),
{page:1})});r.click(function(a){a.preventDefault();s.val("");i.submit()});c.search.bind("startRequest",function(){b.delay(1E3).show("slow")});c.search.bind("updateItems",function(a){var d=$("#preview").data("fit")||$.noop;b.stop(true,true).hide();l.setItems(a);if(c.search.request.query)a.length||e.show();else j.show();i.toggleClass("has-results",a.length>0);d()});c.search.bind("updateRequest",function(a){w=a;u.hide("fast");j.hide();e.hide();s.val(a.query||"");p.text(a.query);r.toggle(!!a.query)});
c.search.bind("updatePagination",function(a,d){var f=a-k.INNER_WINDOW,g=a+k.INNER_WINDOW,t,q,h=1;if(g>d){f-=g-d;g=d}if(f<1){g+=1-f;f=1;if(g>d)g=d}f=[2+k.OUTER_WINDOW,f];g=[g+1,d-k.OUTER_WINDOW];t=f[1]-f[0]>1;q=g[1]-g[0]>1;k.EL.children().remove();for(a>1&&k.PREV_EL.clone().data("page",a-1).appendTo(k.EL);h<=d;)if(t&&h>=f[0]&&h<f[1]){k.GAP_EL.clone().appendTo(k.EL);h=f[1]}else if(q&&h>=g[0]&&h<g[1]){k.GAP_EL.clone().appendTo(k.EL);h=g[1]}else{h==a?k.CURRENT_EL.clone().text(h).appendTo(k.EL):k.PAGE_EL.clone().text(h).data("page",
h).appendTo(k.EL);h++}a<d&&k.NEXT_EL.clone().data("page",a+1).appendTo(k.EL)});c.search.bind("error",function(a){b.stop(true,true).hide();u.text(a).show("normal")});j.find("dt").each(function(){var a=$(this);a.children().length||a.wrapInner($("<a/>",{href:"#"}))}).children("span:not(.search-helper)").each(function(){var a=$(this);a.replaceWith($("<a/>",{href:"#",text:a.text()}))});j.find("dt a").live("click",function(a){var d=$(this),f=d.parent().children();a.preventDefault();a=f.length>1?f.map(function(){var g=
$(this);return g[g.is("select")?"val":"text"]()}).get().join(""):d.text();s.val(a);i.submit()});$("select.search-helper").live("change",function(){var a=$(this),d=a.attr("data-search-filter");$("select.search-helper[data-search-filter="+d+"]").val(a.val())});c.item_zone_sets.bind("update",o("type",function(a){return a}));c.pet_attributes.bind("update",o("species",function(a){return a.species}))};View.Title=function(c){c.base_pet.bind("updateName",function(m){$("#title").text("Planning "+m+"'s outfit")})};
$.ajaxSetup({error:function(){$.jGrowl("There was an error loading that last resource. Oops. Please try again!")}});main_wardrobe=new Wardrobe;main_wardrobe.registerViews(View);main_wardrobe.initialize();