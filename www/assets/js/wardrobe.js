var View={},Partial={},main_wardrobe,ITEMS_SERVER="items.impress.openneo.net";if(document.location.hostname.substr(0,5)=="beta.")ITEMS_SERVER="beta."+ITEMS_SERVER;ITEMS_SERVER="http://"+ITEMS_SERVER;window.log=window.SWFLog=$.noop;
function arraysMatch(c,n){var p;if(!$.isArray(c)||!$.isArray(n))return c==n;p=[];if(!c[0]||!n[0])return false;if(c.length!=n.length)return false;for(var i=0;i<c.length;i++){key=typeof c[i]+"~"+c[i];if(p[key])p[key]++;else p[key]=1}for(i=0;i<n.length;i++){key=typeof n[i]+"~"+n[i];if(p[key])if(p[key]==0)return false;else p[key]--;else return false}return true}Array.prototype.map=function(c){return $.map(this,function(n){return n[c]})};function DeepObject(){}
DeepObject.prototype.deepGet=function(){var c=this;$.each(arguments,function(){c=c[this];if(typeof c=="undefined")return false});return c};DeepObject.prototype.deepSet=function(){var c=$.proxy(Array.prototype.pop,"apply"),n=c(arguments);c=c(arguments);var p=this;$.each(arguments,function(){if(typeof p[this]=="undefined")p[this]={};p=p[this]});p[c]=n};
function Wardrobe(){function c(){var a;for(this.restricted_zones=[];(a=this.zones_restrict.indexOf(1,a)+1)!=0;)this.restricted_zones.push(a)}function n(a){for(var b in a)if(a.hasOwnProperty(b))this[b]=a[b]}function p(a){n.apply(this,[a]);c.apply(this)}function i(a){n.apply(this,[a])}function m(a){var b=this;this.id=a;this.assets_by_body_id={};this.loaded=this.load_started=false;this.getAssetsFitting=function(e){return this.assets_by_body_id[e.body_id]||[]};this.hasAssetsFitting=function(e){return typeof b.assets_by_body_id[e.body_id]!=
"undefined"&&b.assets_by_body_id[e.body_id].length>0};this.couldNotLoadAssetsFitting=function(e){return typeof b.assets_by_body_id[e.body_id]!="undefined"&&b.assets_by_body_id[e.body_id].length==0};this.update=function(e){for(var g in e)if(e.hasOwnProperty(g)&&g!="id")b[g]=e[g];c.apply(this);this.loaded=true};m.cache[a]=this}function s(a){this.name=a}function r(){}function v(a){var b=this,e=false;this.id=a;this.assets=[];this.loadAssets=function(g){e?g(b):$.getJSON("/biology_assets.json?parent_id="+
b.id,function(t){b.assets=$.map(t,function(q){return new p(q)});e=true;g(b)})};v.cache[a]=this}function k(){var a=this;this.loaded=false;this.pet_states=[];this.load=function(b,e){a.loaded?b(a):$.getJSON("/pet_types.json",{"for":"wardrobe",color_id:a.color_id,species_id:a.species_id},function(g){if(g){for(var t in g)if(g.hasOwnProperty(t))a[t]=g[t];for(g=0;g<a.pet_state_ids.length;g++)a.pet_states.push(v.find(a.pet_state_ids[g]));k.cache_by_color_and_species.deepSet(a.color_id,a.species_id,a);a.loaded=
true;b(a)}else e(a)})};this.loadItemAssets=function(b,e){for(var g=[],t=0;t<b.length;t++){var q=b[t];m.find(q).hasAssetsFitting(a)||g.push(q)}g.length?$.getJSON("/object_assets.json",{body_id:a.body_id,parent_ids:g},function(h){$.each(h,function(){var z=m.find(this.parent_id),C=new i(this);if(typeof z.assets_by_body_id[a.body_id]=="undefined")z.assets_by_body_id[a.body_id]=[];z.assets_by_body_id[a.body_id].push(C)});for(var A=0,o=b.length;A<o;A++){h=m.find(b[A]);h.hasAssetsFitting(a)||(h.assets_by_body_id[a.body_id]=
[])}e()}):e()};this.toString=function(){return"PetType{color_id: "+this.color_id+", species_id: "+this.species_id+"}"};this.ownsPetState=function(b){for(var e=0;e<this.pet_states.length;e++)if(this.pet_states[e]==b)return true;return false}}function d(){var a=this;this.events={};this.bind=function(b,e){if(typeof this.events[b]=="undefined")this.events[b]=[];this.events[b].push(e)};this.events.trigger=function(b){var e;if(a.events[b]){e=Array.prototype.slice.apply(arguments,[1]);$.each(a.events[b],
function(){this.apply(a,e)})}}}var f=this;m.find=function(a){var b=m.cache[a];b||(b=new m(a));return b};var j=[];m.loadByIds=function(a,b){var e=[],g=[],t=$.map(a,function(q){var h=m.find(q);if(!h.load_started){e.push(q);h.load_started=true}h.loaded||g.push(q);return h});if(e.length)$.getJSON("/objects.json",{ids:e},function(q){var h,A,o,z=[];$.each(q,function(){z.push(+this.id);m.find(this.id).update(this)});for(var C=0;C<j.length;C++){h=j[C];q=h[0];A=h[1];h=h[2];o=true;for(var B=0;B<A.length;B++)if($.inArray(A[B],
z)==-1){o=false;break}o&&h(q)}b(t)});else g.length?j.push([t,g,b]):b(t);return t};var l=ITEMS_SERVER+"/index.js?callback=?";m.PER_PAGE=21;m.loadByQuery=function(a,b,e,g){var t=Math.round(b/m.PER_PAGE)+1;$.getJSON(l,{q:a,per_page:m.PER_PAGE,page:t},function(q){var h=[],A,o;if(q.items){for(var z=0;z<q.items.length;z++){o=q.items[z];A=m.find(o.id);A.update(o);h.push(A)}e(h,q.total_pages,t)}else q.error&&g(q.error)})};m.cache={};s.loadAll=function(a){$.getJSON(ITEMS_SERVER+"/item_zone_sets.js?callback=?",
function(b){for(var e=0,g=b.length;e<g;e++)s.all.push(new s(b[e]));a(s.all)})};s.all=[];r.loadAll=function(a){$.getJSON("/pet_attributes.json",function(b){a(b)})};v.find=function(a){var b=v.cache[a];b||(b=new v(a));return b};v.cache={};k.cache_by_color_and_species=new DeepObject;k.findOrCreateByColorAndSpecies=function(a,b){var e=k.cache_by_color_and_species.deepGet(a,b);if(!e){e=new k;e.color_id=a;e.species_id=b}return e};d.all={};d.all.Outfit=function(){function a(){var o=[],z=h.items.concat(h.pet_state.assets);
$.each(z,function(){o=o.concat(this.restricted_zones)});return o}function b(o){h.events.trigger("updateItems",o)}function e(o){h.events.trigger("updatePetState",o)}function g(o){if(!h.pet_state||!o.ownsPetState(h.pet_state))h.setPetStateById();h.events.trigger("petTypeLoaded",o);q()}function t(o){h.events.trigger("petTypeNotFound",o)}function q(o){h.pet_type&&h.pet_type.loaded&&A.length&&h.pet_type.loadItemAssets(A,function(){var z,C,B,G,D,H=[],I=[];if(o){z=o.getAssetsFitting(h.pet_type).map("zone_id");
C=z.length;for(var E=0;E<h.items.length;E++){B=h.items[E];G=B.getAssetsFitting(h.pet_type).map("zone_id");D=true;if(B!=o)for(var F=0;F<C;F++)if($.inArray(z[F],G)!=-1){D=false;break}if(D){H.push(B);I.push(B.id)}}h.items=H;A=I;h.events.trigger("updateItems",h.items)}h.events.trigger("updateItemAssets")})}var h=this,A=[];this.items=[];this.addItem=function(o){if($.inArray(o,h.items)==-1){this.items.push(o);A.push(o.id);q(o);h.events.trigger("updateItems",this.items)}};this.getVisibleAssets=function(){for(var o=
this.pet_state.assets,z=a(),C=[],B=0;B<h.items.length;B++)o=o.concat(h.items[B].getAssetsFitting(h.pet_type));$.each(o,function(){$.inArray(this.zone_id,z)==-1&&C.push(this)});return C};this.removeItem=function(o){var z=$.inArray(o,this.items);if(z!=-1){this.items.splice(z,1);o=$.inArray(o.id,A);A.splice(o,1);h.events.trigger("updateItems",this.items)}};this.setPetStateById=function(o){if(!o&&this.pet_type)o=this.pet_type.pet_state_ids[0];if(o){this.pet_state=v.find(o);this.pet_state.loadAssets(e)}};
this.setPetTypeByColorAndSpecies=function(o,z){this.pet_type=k.findOrCreateByColorAndSpecies(o,z);h.events.trigger("updatePetType",this.pet_type);this.pet_type.load(g,t)};this.setItemsByIds=function(o){if(o)A=o;if(o&&o.length)this.items=m.loadByIds(o,b);else{this.items=[];b(this.items)}q()}};d.all.Closet=function(){function a(g){b.events.trigger("updateItems",g)}var b=this,e=[];this.items=[];this.addItem=function(g){if($.inArray(g,b.items)==-1){this.items.push(g);e.push(g.id);b.events.trigger("updateItems",
this.items)}};this.removeItem=function(g){var t=$.inArray(g,this.items);if(t!=-1){this.items.splice(t,1);g=$.inArray(g.id,e);e.splice(g,1);b.events.trigger("updateItems",this.items)}};this.setItemsByIds=function(g){if(g&&g.length){e=g;this.items=m.loadByIds(g,a)}else{e=g;this.items=[];a(this.items)}}};d.all.BasePet=function(){var a=this;this.setName=function(b){a.name=b;a.events.trigger("updateName",b)}};d.all.PetAttributes=function(){function a(e){b.events.trigger("update",e)}var b=this;this.load=
function(){r.loadAll(a)}};d.all.ItemZoneSets=function(){function a(e){b.events.trigger("update",e)}var b=this;this.load=function(){s.loadAll(a)}};d.all.Search=function(){function a(g,t,q){e.events.trigger("updateItems",g);e.events.trigger("updatePagination",q,t)}function b(g){e.events.trigger("error",g)}var e=this;this.request={};this.setItemsByQuery=function(g,t){var q=typeof t.offset!="undefined"?t.offset:m.PER_PAGE*(t.page-1);e.request={query:g,offset:q};e.events.trigger("updateRequest",e.request);
if(g){m.loadByQuery(g,q,a,b);e.events.trigger("startRequest")}else{e.events.trigger("updateItems",[]);e.events.trigger("updatePagination",0,0)}};this.setPerPage=function(g){m.PER_PAGE=g}};var w;for(var u in d.all)if(d.all.hasOwnProperty(u)){w=u.replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").toLowerCase();f[w]=new d.all[u];d.apply(f[w])}this.initialize=function(){var a;for(var b in f.views)if(f.views.hasOwnProperty(b)){a=f.views[b];typeof a.initialize=="function"&&a.initialize()}};
this.registerViews=function(a){f.views={};$.each(a,function(b){f.views[b]=new this(f)})}}
Partial.ItemSet=function(c,n){function p(j){return function(l){for(var w,u=0;u<s.length;u++){w=s[u];in_set=$.inArray(w,l)!=-1;$("li.object-"+w.id).toggleClass(j,in_set).data("item",w).data(j,in_set).children("ul").children("li.control-set-for-"+j).remove().end()[j=="worn"?"prepend":"append"](Partial.ItemSet.CONTROL_SETS[j][in_set].clone())}}}function i(j){for(var l,w,u,a=0,b=j.length;a<b;a++){l=j[a];w=l.couldNotLoadAssetsFitting(c.outfit.pet_type);l=$("li.object-"+l.id).toggleClass("no-assets",w);
(function(e){u=e.find("span.no-assets-message");u.remove();w&&$("<span/>",{"class":"no-assets-message",text:"No data yet"}).appendTo(e)})(l)}}var m=$(n),s=[],r,v,k,d=$("#no-assets-full-message"),f=$("#container");Partial.ItemSet.setWardrobe(c);r=p("closeted");k=p("worn");v=function(j){k(j);i(j)};this.setItems=function(j){var l,w;s=j;m.children().remove();for(var u=0;u<s.length;u++){j=s[u];l=$("<li/>",{"class":"object object-"+j.id});img=$("<img/>",{src:j.thumbnail_url,alt:j.description,title:j.description});
w=$("<ul/>");l.append(img).append(w).append(j.name).appendTo(m)}r(c.closet.items);v(c.outfit.items)};$("span.no-assets-message").live("mouseover",function(){var j=$(this),l=j.offset();d.css({left:l.left+j.width()/2-d.width()/2-f.offset().left,top:l.top+j.height()+10})}).live("mouseout",function(){d.removeAttr("style")});c.outfit.bind("updateItemAssets",function(){i(c.outfit.items)});c.outfit.bind("updateItems",v);c.closet.bind("updateItems",r)};Partial.ItemSet.CONTROL_SETS={};
Partial.ItemSet.setWardrobe=function(c){for(var n,p,i,m,s,r={},v=0;v<2;v++){n=v==0?"worn":"closeted";p=v==0?["Unwear","Wear"]:["Uncloset","Closet"];Partial.ItemSet.CONTROL_SETS[n]={};for(var k=0;k<2;k++){i=k==0;s="control-set control-set-for-"+n;m="control-set-"+(i?"":"not-")+n;s+=" "+m;Partial.ItemSet.CONTROL_SETS[n][i]=$("<a/>",{href:"#",text:p[i?0:1]}).wrap("<li/>").parent().attr("class",s);(function(d,f){$("li."+m+" a").live("click",function(j){var l=$(this).closest(".object").data("item");r[d][!f](l);
j.preventDefault()})})(n,i)}}r.closeted={};r.closeted[true]=$.proxy(c.closet,"addItem");r.closeted[false]=function(d){c.outfit.removeItem(d);c.closet.removeItem(d)};r.worn={};r.worn[true]=function(d){c.closet.addItem(d);c.outfit.addItem(d)};r.worn[false]=$.proxy(c.outfit,"removeItem");Partial.ItemSet.setWardrobe=$.noop};
if(document.location.search.substr(0,6)=="?debug")View.Console=function(c){if(typeof console!="undefined"&&typeof console.log=="function")window.log=$.proxy(console,"log");this.initialize=function(){log("Welcome to the Wardrobe!")};for(var n=["updateItems","updateItemAssets","updatePetType","updatePetState"],p=0;p<n.length;p++)(function(i){c.outfit.bind(i,function(m){log(i,m)})})(n[p]);c.outfit.bind("petTypeNotFound",function(i){log(i.toString()+" not found")})};
View.Closet=function(c){var n=new Partial.ItemSet(c,"#preview-closet ul");c.closet.bind("updateItems",$.proxy(n,"setItems"))};
View.Fullscreen=function(c){function n(){if(p){r=$("#preview-swf");var k={height:s.offset().top-m.offset().top,width:m.innerWidth()-v.outerWidth()-12},d={},f={},j={old:{height:r.height(),width:r.width()},next:{}};if(k.height>k.width){d.larger="height";d.smaller="width";f.active="marginTop";f.inactive="marginLeft"}else{d.larger="width";d.smaller="height";f.active="marginLeft";f.inactive="marginTop"}j.next[d.smaller]=k[d.smaller];j.next[d.larger]=k[d.smaller];j.next[f.active]=(k[d.larger]-j.next[d.larger])/
2;j.next[f.inactive]=0;r.css(j.next);m.height(k.height)}}var p=$(document.body).hasClass("fullscreen"),i=$(window),m=$("#preview"),s=$("#preview-search-form"),r=$("#preview-swf"),v=$("#preview-closet");$("#footer");$("#preview").data("fit",n);i.resize(n).load(n);n();konami=new (function(){var k={addEvent:function(d,f,j,l){if(d.addEventListener)d.addEventListener(f,j,false);else if(d.attachEvent){d["e"+f+j]=j;d[f+j]=function(){d["e"+f+j](window.event,l)};d.attachEvent("on"+f,d[f+j])}},input:"",pattern:"3838404037393739666513",
load:function(d){this.addEvent(document,"keydown",function(f,j){if(j)k=j;k.input+=f?f.keyCode:event.keyCode;if(k.input.indexOf(k.pattern)!=-1){k.code(d);k.input=""}},this);this.iphone.load(d)},code:function(d){window.location=d},iphone:{start_x:0,start_y:0,stop_x:0,stop_y:0,tap:false,capture:false,keys:["UP","UP","DOWN","DOWN","LEFT","RIGHT","LEFT","RIGHT","TAP","TAP","TAP"],code:function(d){k.code(d)},load:function(d){k.addEvent(document,"touchmove",function(f){if(f.touches.length==1&&k.iphone.capture==
true){f=f.touches[0];k.iphone.stop_x=f.pageX;k.iphone.stop_y=f.pageY;k.iphone.tap=false;k.iphone.capture=false;k.iphone.check_direction()}});k.addEvent(document,"touchend",function(){k.iphone.tap==true&&k.iphone.check_direction(d)},false);k.addEvent(document,"touchstart",function(f){k.iphone.start_x=f.changedTouches[0].pageX;k.iphone.start_y=f.changedTouches[0].pageY;k.iphone.tap=true;k.iphone.capture=true})},check_direction:function(d){x_magnitude=Math.abs(this.start_x-this.stop_x);y_magnitude=Math.abs(this.start_y-
this.stop_y);x=this.start_x-this.stop_x<0?"RIGHT":"LEFT";y=this.start_y-this.stop_y<0?"DOWN":"UP";result=x_magnitude>y_magnitude?x:y;result=this.tap==true?"TAP":result;if(result==this.keys[0])this.keys=this.keys.slice(1,this.keys.length);this.keys.length==0&&this.code(d)}}};return k});konami.code=function(){$(document.body).removeClass("fullscreen");r.removeAttr("style").css("visibility","visible");m.removeAttr("style");c.search.setPerPage(21);c.search.setItemsByQuery(c.search.request.query,{offset:c.search.request.offset});
p=false};konami.load()};
View.Hash=function(c){function n(){var d=(document.location.hash||document.location.search).substr(1);if(d!=m){var f={},j=d.split("&");s=true;for(var l=0;l<j.length;l++){var w=j[l].split("="),u=decodeURIComponent(w[0]);if(w=decodeURIComponent(w[1]))if(v[u]==r.INTEGER)f[u]=+w;else if(v[u]==r.STRING)f[u]=decodeURIComponent(w).replace(/\+/g," ");else if(u.substr(u.length-2)=="[]"){u=u.substr(0,u.length-2);if(v[u]==r.INTEGER_ARRAY){if(typeof f[u]=="undefined")f[u]=[];f[u].push(+w)}}}if(f.color!==i.color||
f.species!==i.species)c.outfit.setPetTypeByColorAndSpecies(f.color,f.species);if(f.closet)arraysMatch(f.closet,i.closet)||c.closet.setItemsByIds(f.closet.slice(0));else arraysMatch(f.objects,i.closet)||c.closet.setItemsByIds(f.objects.slice(0));arraysMatch(f.objects,i.objects)||c.outfit.setItemsByIds(f.objects.slice(0));f.name!=i.name&&f.name&&c.base_pet.setName(f.name);f.state!=i.state&&c.outfit.setPetStateById(f.state);if(f.search!=i.search||f.search_offset!=i.search_offset)c.search.setItemsByQuery(f.search,
{offset:f.search_offset});i=f;s=false;m=d}}function p(d){var f;if(!s){for(var j in d)if(d.hasOwnProperty(j)){f=d[j];if(f===undefined)delete i[j];else i[j]=d[j]}m=d=$.param(i).replace(/%5B%5D/g,"[]");document.location.hash="#"+d;k()}}var i={},m,s=false,r={INTEGER:1,STRING:2,INTEGER_ARRAY:3},v={closet:r.INTEGER_ARRAY,color:r.INTEGER,name:r.STRING,objects:r.INTEGER_ARRAY,search:r.STRING,search_offset:r.INTEGER,species:r.INTEGER,state:r.INTEGER},k;this.initialize=function(){n();setInterval(n,100);k()};
c.outfit.bind("updateItems",function(d){d=d.map("id");var f={};if(!arraysMatch(d,i.objects))f.objects=d;f.closet=arraysMatch(d,i.closet)||arraysMatch(d,i.objects)?undefined:c.closet.items.map("id");if(f.objects||f.closet)p(f)});c.outfit.bind("updatePetType",function(d){if(d.color_id!=i.color||d.species_id!=i.species)p({color:d.color_id,species:d.species_id,state:undefined})});c.outfit.bind("petTypeNotFound",function(){window.history.back()});c.outfit.bind("updatePetState",function(d){var f=c.outfit.pet_type;
if(d.id!=i.state&&f&&(i.state||d.id!=f.pet_state_ids[0]))p({state:d.id})});c.search.bind("updateRequest",function(d){if(d.offset!=i.search_offset||d.query!=i.search)p({search_offset:d.offset,search:d.query})});(function(){function d(q){if(typeof addthis_share!="undefined"){addthis_share.url=q;w.replaceWith(w.clone());addthis.button(l)}}function f(){if(!g&&!t){g=true;BitlyClient.shorten(e,"BitlyCB."+j)}}var j="shortenResponse",l="#share-button",w=$(l),u=w.parent(),a=$("#short-url-button"),b=$("#short-url-response"),
e,g=false,t=false;k=function(){var q=window.location,h=q.hash;h||(h="#"+q.search.substr(1));e=q.protocol+"//"+q.host+q.pathname+h;d(e);b.hide();t=false};BitlyCB[j]=function(q){var h,A;for(A in q.results){h="http://outfits.openneo.net/"+q.results[A].hash;break}d(h);b.val(h).show();g=false;t=true};a.click(f);u.mouseover(f);w.focus(f);b.mouseover(function(){b.focus().select()})})()};
View.Preview=function(c){function n(){var m;if(i)return false;if(p&&p.setAssets){m=c.outfit.getVisibleAssets();p.setAssets(m)}else i=true}$("#preview");var p,i=false;swfobject.embedSWF("/assets/swf/preview.swf?v=0.11","preview-swf","100%","100%","9","/assets/js/swfobject/expressInstall.swf",{swf_assets_path:"/assets"},{wmode:"transparent"});window.previewSWFIsReady=function(){p=document.getElementById("preview-swf");if(i){i=false;n()}};c.outfit.bind("updateItems",n);c.outfit.bind("updateItemAssets",
n);c.outfit.bind("updatePetState",n)};
View.PetStateForm=function(c){function n(s){if(s){i.children("li.selected").removeClass("selected");$(m+"[value="+s.id+"]").attr("checked","checked").parent().addClass("selected")}}var p=$("#pet-state-form"),i=p.children("ul"),m="#pet-state-form input[name=pet_state_id]";$(m).live("click",function(){c.outfit.setPetStateById(+this.value)});c.outfit.bind("petTypeLoaded",function(s){s=s.pet_state_ids;var r,v,k,d;i.children().remove();if(s.length==1)p.hide();else{p.show();for(r=0;r<s.length;r++){v="pet-state-radio-"+
r;k=$("<li/>");d=$("<input/>",{id:v,name:"pet_state_id",type:"radio",value:s[r]});v=$("<label/>",{"for":v,text:r+1});r==0&&d.attr("checked","checked");d.appendTo(k);v.appendTo(k);k.appendTo(i)}n(c.outfit.pet_state)}});c.outfit.bind("updatePetState",n)};
View.PetTypeForm=function(c){function n(m){i&&m&&$.each(p,function(s){p[s].val(m[s+"_id"])})}var p={},i=false;$("#pet-type-form").submit(function(m){m.preventDefault();c.outfit.setPetTypeByColorAndSpecies(+p.color.val(),+p.species.val())}).children("select").each(function(){p[this.name]=$(this)});this.initialize=function(){c.pet_attributes.load()};c.pet_attributes.bind("update",function(m){$.each(m,function(s){var r=p[s];$.each(this,function(){$("<option/>",{text:this.name,value:this.id}).appendTo(r)})});
i=true;n(c.outfit.pet_type)});c.outfit.bind("updatePetType",n);c.outfit.bind("petTypeNotFound",function(){$("#pet-type-not-found").show("normal").delay(3E3).hide("fast")})};
View.Search=function(c){function n(){var a=Math.floor(i.width()/w);if(a!=l.PER_PAGE){l.PER_PAGE=a;c.search.setPerPage(l.PER_PAGE);if(u){a=u.offset;c.search.setItemsByQuery(s.val(),{offset:a})}}}function p(a,b){return function(e){var g=$("<select/>",{"class":"search-helper","data-search-filter":a}),t=$("span.search-helper[data-search-filter="+a+"]");e=b(e);for(var q=0,h=e.length;q<h;q++)$("<option/>",{text:e[q].name}).appendTo(g);t.replaceWith(function(){return g.clone().fadeIn("fast")})}}var i=$("#preview-search-form"),
m=new Partial.ItemSet(c,"#preview-search-form ul"),s=i.find("input[name=query]"),r=$("#preview-search-form-clear"),v=$("#preview-search-form-error"),k=$("#preview-search-form-help"),d=$("#preview-search-form-loading"),f=$("#preview-search-form-no-results"),j=f.children("span"),l={INNER_WINDOW:4,OUTER_WINDOW:1,GAP_TEXT:"&hellip;",PREV_TEXT:"&larr; Previous",NEXT_TEXT:"Next &rarr;",PAGE_EL:$("<a/>",{href:"#"}),CURRENT_EL:$("<span/>",{"class":"current"}),EL_ID:"#preview-search-form-pagination",PER_PAGE:21},
w=112,u;l.EL=$(l.EL_ID);l.GAP_EL=$("<span/>",{"class":"gap",html:l.GAP_TEXT});l.PREV_EL=$("<a/>",{href:"#",rel:"prev",html:l.PREV_TEXT});l.NEXT_EL=$("<a/>",{href:"#",rel:"next",html:l.NEXT_TEXT});$(l.EL_ID+" a").live("click",function(a){a.preventDefault();a=$(this).data("page");c.search.setItemsByQuery(s.val(),{page:a})});this.initialize=$.proxy(c.item_zone_sets,"load");c.search.setPerPage(l.PER_PAGE);$(window).resize(n).load(n);n();i.submit(function(a){a.preventDefault();c.search.setItemsByQuery(s.val(),
{page:1})});r.click(function(a){a.preventDefault();s.val("");i.submit()});c.search.bind("startRequest",function(){d.delay(1E3).show("slow")});c.search.bind("updateItems",function(a){var b=$("#preview").data("fit")||$.noop;d.stop(true,true).hide();m.setItems(a);if(c.search.request.query)a.length||f.show();else k.show();i.toggleClass("has-results",a.length>0);b()});c.search.bind("updateRequest",function(a){u=a;v.hide("fast");k.hide();f.hide();s.val(a.query||"");j.text(a.query);r.toggle(!!a.query)});
c.search.bind("updatePagination",function(a,b){var e=a-l.INNER_WINDOW,g=a+l.INNER_WINDOW,t,q,h=1;if(g>b){e-=g-b;g=b}if(e<1){g+=1-e;e=1;if(g>b)g=b}e=[2+l.OUTER_WINDOW,e];g=[g+1,b-l.OUTER_WINDOW];t=e[1]-e[0]>1;q=g[1]-g[0]>1;l.EL.children().remove();for(a>1&&l.PREV_EL.clone().data("page",a-1).appendTo(l.EL);h<=b;)if(t&&h>=e[0]&&h<e[1]){l.GAP_EL.clone().appendTo(l.EL);h=e[1]}else if(q&&h>=g[0]&&h<g[1]){l.GAP_EL.clone().appendTo(l.EL);h=g[1]}else{h==a?l.CURRENT_EL.clone().text(h).appendTo(l.EL):l.PAGE_EL.clone().text(h).data("page",
h).appendTo(l.EL);h++}a<b&&l.NEXT_EL.clone().data("page",a+1).appendTo(l.EL)});c.search.bind("error",function(a){d.stop(true,true).hide();v.text(a).show("normal")});k.find("dt").each(function(){var a=$(this);a.children().length||a.wrapInner($("<a/>",{href:"#"}))}).children("span:not(.search-helper)").each(function(){var a=$(this);a.replaceWith($("<a/>",{href:"#",text:a.text()}))});k.find("dt a").live("click",function(a){var b=$(this),e=b.parent().children();a.preventDefault();a=e.length>1?e.map(function(){var g=
$(this);return g[g.is("select")?"val":"text"]()}).get().join(""):b.text();s.val(a);i.submit()});$("select.search-helper").live("change",function(){var a=$(this),b=a.attr("data-search-filter");$("select.search-helper[data-search-filter="+b+"]").val(a.val())});c.item_zone_sets.bind("update",p("type",function(a){return a}));c.pet_attributes.bind("update",p("species",function(a){return a.species}))};View.Title=function(c){c.base_pet.bind("updateName",function(n){$("#title").text("Planning "+n+"'s outfit")})};
$.ajaxSetup({error:function(){$.jGrowl("There was an error loading that last resource. Oops. Please try again!")}});main_wardrobe=new Wardrobe;main_wardrobe.registerViews(View);main_wardrobe.initialize();