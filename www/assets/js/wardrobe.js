var View={},Partial={},main_wardrobe;window.log=window.SWFLog=$.noop;function arraysMatch(b,n){var l;if(!$.isArray(b)||!$.isArray(n))return b==n;l=[];if(!b[0]||!n[0])return false;if(b.length!=n.length)return false;for(var f=0;f<b.length;f++){key=typeof b[f]+"~"+b[f];if(l[key])l[key]++;else l[key]=1}for(f=0;f<n.length;f++){key=typeof n[f]+"~"+n[f];if(l[key])if(l[key]==0)return false;else l[key]--;else return false}return true}Array.prototype.map=function(b){return $.map(this,function(n){return n[b]})};
function DeepObject(){}DeepObject.prototype.deepGet=function(){var b=this;$.each(arguments,function(){b=b[this];if(typeof b=="undefined")return false});return b};DeepObject.prototype.deepSet=function(){var b=$.proxy(Array.prototype.pop,"apply"),n=b(arguments);b=b(arguments);var l=this;$.each(arguments,function(){if(typeof l[this]=="undefined")l[this]={};l=l[this]});l[b]=n};
function Wardrobe(){function b(){var a;for(this.restricted_zones=[];(a=this.zones_restrict.indexOf(1,a)+1)!=0;)this.restricted_zones.push(a)}function n(a){for(var c in a)if(a.hasOwnProperty(c))this[c]=a[c]}function l(a){n.apply(this,[a]);b.apply(this)}function f(a){n.apply(this,[a])}function d(a){var c=this;this.id=a;this.assets_by_body_id={};this.loaded=this.load_started=false;this.getAssetsFitting=function(h){return this.assets_by_body_id[h.body_id]||[]};this.hasAssetsFitting=function(h){return typeof c.assets_by_body_id[h.body_id]!=
"undefined"};this.update=function(h){for(var j in h)if(h.hasOwnProperty(j)&&j!="id")c[j]=h[j];b.apply(this);this.loaded=true};d.cache[a]=this}function m(){}function k(a){var c=this,h=false;this.id=a;this.assets=[];this.loadAssets=function(j){h?j(c):$.getJSON("/biology_assets.json?parent_id="+c.id,function(s){c.assets=$.map(s,function(t){return new l(t)});h=true;j(c)})};k.cache[a]=this}function o(){var a=this;this.loaded=false;this.pet_states=[];this.load=function(c,h){a.loaded?c(a):$.getJSON("/pet_types.json",
{"for":"wardrobe",color_id:a.color_id,species_id:a.species_id},function(j){if(j){for(var s in j)if(j.hasOwnProperty(s))a[s]=j[s];for(j=0;j<a.pet_state_ids.length;j++)a.pet_states.push(k.find(a.pet_state_ids[j]));o.cache_by_color_and_species.deepSet(a.color_id,a.species_id,a);a.loaded=true;c(a)}else h(a)})};this.loadItemAssets=function(c,h){for(var j=[],s=0;s<c.length;s++){var t=c[s];d.find(t).hasAssetsFitting(a)||j.push(t)}j.length?$.getJSON("/object_assets.json",{body_id:a.body_id,parent_ids:j},
function(p){$.each(p,function(){var u=d.find(this.parent_id),i=new f(this);if(typeof u.assets_by_body_id[a.body_id]=="undefined")u.assets_by_body_id[a.body_id]=[];u.assets_by_body_id[a.body_id].push(i)});h()}):h()};this.toString=function(){return"PetType{color_id: "+this.color_id+", species_id: "+this.species_id+"}"};this.ownsPetState=function(c){for(var h=0;h<this.pet_states.length;h++)if(this.pet_states[h]==c)return true;return false}}function q(){var a=this;this.events={};this.bind=function(c,
h){if(typeof this.events[c]=="undefined")this.events[c]=[];this.events[c].push(h)};this.events.trigger=function(c){var h;if(a.events[c]){h=Array.prototype.slice.apply(arguments,[1]);$.each(a.events[c],function(){this.apply(a,h)})}}}var e=this;d.find=function(a){var c=d.cache[a];c||(c=new d(a));return c};var g=[];d.loadByIds=function(a,c){var h=[],j=[],s=$.map(a,function(t){var p=d.find(t);if(!p.load_started){h.push(t);p.load_started=true}p.loaded||j.push(t);return p});if(h.length)$.getJSON("/objects.json",
{ids:h},function(t){var p,u,i,v=[];$.each(t,function(){v.push(+this.id);d.find(this.id).update(this)});for(var z=0;z<g.length;z++){p=g[z];t=p[0];u=p[1];p=p[2];i=true;for(var w=0;w<u.length;w++)if($.inArray(u[w],v)==-1){i=false;break}i&&p(t)}c(s)});else j.length?g.push([s,j,c]):c(s);return s};var r="items.impress.openneo.net/index.js?callback=?";if(document.location.hostname.substr(0,5)=="beta.")r="beta."+r;r="http://"+r;d.loadByQuery=function(a,c,h,j){$.getJSON(r,{q:a,per_page:21,page:c},function(s){var t=
[],p,u;if(s.items){for(var i=0;i<s.items.length;i++){u=s.items[i];p=d.find(u.id);p.update(u);t.push(p)}h(t,s.total_pages)}else s.error&&j(s.error)})};d.cache={};m.loadAll=function(a){$.getJSON("/pet_attributes.json",function(c){a(c)})};k.find=function(a){var c=k.cache[a];c||(c=new k(a));return c};k.cache={};o.cache_by_color_and_species=new DeepObject;o.findOrCreateByColorAndSpecies=function(a,c){var h=o.cache_by_color_and_species.deepGet(a,c);if(!h){h=new o;h.color_id=a;h.species_id=c}return h};q.Outfit=
function(){function a(){var i=[],v=p.items.concat(p.pet_state.assets);$.each(v,function(){i=i.concat(this.restricted_zones)});return i}function c(i){p.events.trigger("updateItems",i)}function h(i){p.events.trigger("updatePetState",i)}function j(i){if(!p.pet_state||!i.ownsPetState(p.pet_state))p.setPetStateById();p.events.trigger("petTypeLoaded",i);t()}function s(i){p.events.trigger("petTypeNotFound",i)}function t(i){p.pet_type&&p.pet_type.loaded&&u.length&&p.pet_type.loadItemAssets(u,function(){var v,
z,w,D,A,E=[],F=[];if(i){v=i.getAssetsFitting(p.pet_type).map("zone_id");z=v.length;for(var B=0;B<p.items.length;B++){w=p.items[B];D=w.getAssetsFitting(p.pet_type).map("zone_id");A=true;if(w!=i)for(var C=0;C<z;C++)if($.inArray(v[C],D)!=-1){A=false;break}if(A){E.push(w);F.push(w.id)}}p.items=E;u=F;p.events.trigger("updateItems",p.items)}p.events.trigger("updateItemAssets")})}var p=this,u=[];this.items=[];this.addItem=function(i){if($.inArray(i,p.items)==-1){this.items.push(i);u.push(i.id);t(i);p.events.trigger("updateItems",
this.items)}};this.getVisibleAssets=function(){for(var i=this.pet_state.assets,v=a(),z=[],w=0;w<p.items.length;w++)i=i.concat(p.items[w].getAssetsFitting(p.pet_type));$.each(i,function(){$.inArray(this.zone_id,v)==-1&&z.push(this)});return z};this.removeItem=function(i){var v=$.inArray(i,this.items);if(v!=-1){this.items.splice(v,1);i=$.inArray(i.id,u);u.splice(i,1);p.events.trigger("updateItems",this.items)}};this.setPetStateById=function(i){if(!i&&this.pet_type)i=this.pet_type.pet_state_ids[0];if(i){this.pet_state=
k.find(i);this.pet_state.loadAssets(h)}};this.setPetTypeByColorAndSpecies=function(i,v){this.pet_type=o.findOrCreateByColorAndSpecies(i,v);p.events.trigger("updatePetType",this.pet_type);this.pet_type.load(j,s)};this.setItemsByIds=function(i){if(i)u=i;if(i&&i.length)this.items=d.loadByIds(i,c);else{this.items=[];c(this.items)}t()}};q.Closet=function(){function a(j){c.events.trigger("updateItems",j)}var c=this,h=[];this.items=[];this.addItem=function(j){if($.inArray(j,c.items)==-1){this.items.push(j);
h.push(j.id);c.events.trigger("updateItems",this.items)}};this.removeItem=function(j){var s=$.inArray(j,this.items);if(s!=-1){this.items.splice(s,1);j=$.inArray(j.id,h);h.splice(j,1);c.events.trigger("updateItems",this.items)}};this.setItemsByIds=function(j){if(j&&j.length){h=j;this.items=d.loadByIds(j,a)}else{h=j;this.items=[];a(this.items)}}};q.BasePet=function(){var a=this;this.setName=function(c){a.name=c;a.events.trigger("updateName",c)}};q.PetAttributes=function(){function a(h){c.events.trigger("update",
h)}var c=this;this.load=function(){m.loadAll(a)}};q.Search=function(){function a(h){c.events.trigger("error",h)}var c=this;this.setItemsByQuery=function(h,j){if(h&&j)d.loadByQuery(h,j,function(s,t){c.events.trigger("updateItems",s);c.events.trigger("updatePagination",j,t)},a);else{c.events.trigger("updateItems",[]);c.events.trigger("updatePagination",0,0)}c.events.trigger("updateRequest",{query:h,page:j})}};var y;for(var x in q)if(q.hasOwnProperty(x)){y=x.replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,
"$1_$2").toLowerCase();e[y]=new q[x];q.apply(e[y])}this.initialize=function(){var a;for(var c in e.views)if(e.views.hasOwnProperty(c)){a=e.views[c];typeof a.initialize=="function"&&a.initialize()}};this.registerViews=function(a){e.views={};$.each(a,function(c){e.views[c]=new this(e)})}}
Partial.ItemSet=function(b,n){function l(o){return function(q){for(var e,g=0;g<d.length;g++){e=d[g];in_set=$.inArray(e,q)!=-1;$("li.object-"+e.id).toggleClass(o,in_set).data("item",e).data(o,in_set).children("ul").children("li.control-set-for-"+o).remove().end()[o=="worn"?"prepend":"append"](Partial.ItemSet.CONTROL_SETS[o][in_set].clone())}}}var f=$(n),d=[],m,k;Partial.ItemSet.setWardrobe(b);m=l("closeted");k=l("worn");this.setItems=function(o){var q,e;d=o;f.children().remove();for(var g=0;g<d.length;g++){o=
d[g];q=$("<li/>",{"class":"object object-"+o.id});img=$("<img/>",{src:o.thumbnail_url,alt:o.description,title:o.description});e=$("<ul/>");q.append(img).append(e).append(o.name).appendTo(f)}m(b.closet.items);k(b.outfit.items)};b.outfit.bind("updateItems",k);b.closet.bind("updateItems",m)};Partial.ItemSet.CONTROL_SETS={};
Partial.ItemSet.setWardrobe=function(b){for(var n,l,f,d,m,k={},o=0;o<2;o++){n=o==0?"worn":"closeted";l=o==0?["Unwear","Wear"]:["Uncloset","Closet"];Partial.ItemSet.CONTROL_SETS[n]={};for(var q=0;q<2;q++){f=q==0;m="control-set control-set-for-"+n;d="control-set-"+(f?"":"not-")+n;m+=" "+d;Partial.ItemSet.CONTROL_SETS[n][f]=$("<a/>",{href:"#",text:l[f?0:1]}).wrap("<li/>").parent().attr("class",m);(function(e,g){$("li."+d+" a").live("click",function(r){var y=$(this).closest(".object").data("item");k[e][!g](y);
r.preventDefault()})})(n,f)}}k.closeted={};k.closeted[true]=$.proxy(b.closet,"addItem");k.closeted[false]=function(e){b.outfit.removeItem(e);b.closet.removeItem(e)};k.worn={};k.worn[true]=function(e){b.closet.addItem(e);b.outfit.addItem(e)};k.worn[false]=$.proxy(b.outfit,"removeItem");Partial.ItemSet.setWardrobe=$.noop};
if(document.location.search.substr(0,6)=="?debug")View.Console=function(b){if(typeof console!="undefined"&&typeof console.log=="function")window.log=$.proxy(console,"log");this.initialize=function(){log("Welcome to the Wardrobe!")};for(var n=["updateItems","updateItemAssets","updatePetType","updatePetState"],l=0;l<n.length;l++)(function(f){b.outfit.bind(f,function(d){log(f,d)})})(n[l]);b.outfit.bind("petTypeNotFound",function(f){log(f.toString()+" not found")})};
View.Closet=function(b){var n=new Partial.ItemSet(b,"#preview-closet ul");b.closet.bind("updateItems",$.proxy(n,"setItems"))};
View.Hash=function(b){function n(){var e=(document.location.hash||document.location.search).substr(1);if(e!=d){var g={},r=e.split("&");m=true;for(var y=0;y<r.length;y++){var x=r[y].split("="),a=decodeURIComponent(x[0]);if(x=decodeURIComponent(x[1]))if(o[a]==k.INTEGER)g[a]=+x;else if(o[a]==k.STRING)g[a]=x;else if(a.substr(a.length-2)=="[]"){a=a.substr(0,a.length-2);if(o[a]==k.INTEGER_ARRAY){if(typeof g[a]=="undefined")g[a]=[];g[a].push(+x)}}}if(g.color!==f.color||g.species!==f.species)b.outfit.setPetTypeByColorAndSpecies(g.color,
g.species);if(g.closet)arraysMatch(g.closet,f.closet)||b.closet.setItemsByIds(g.closet.slice(0));else arraysMatch(g.objects,f.closet)||b.closet.setItemsByIds(g.objects.slice(0));arraysMatch(g.objects,f.objects)||b.outfit.setItemsByIds(g.objects.slice(0));g.name!=f.name&&g.name&&b.base_pet.setName(g.name);g.state!=f.state&&b.outfit.setPetStateById(g.state);if(g.search!=f.search||g.search_page!=f.search_page)b.search.setItemsByQuery(g.search,g.search_page);f=g;m=false;q();d=e}}function l(e){var g;if(!m){for(var r in e)if(e.hasOwnProperty(r)){g=
e[r];if(g===undefined)delete f[r];else f[r]=e[r]}d=e=$.param(f).replace(/%5B%5D/g,"[]");document.location.hash="#"+e;q()}}var f={},d,m=false,k={INTEGER:1,STRING:2,INTEGER_ARRAY:3},o={closet:k.INTEGER_ARRAY,color:k.INTEGER,name:k.STRING,objects:k.INTEGER_ARRAY,search:k.STRING,search_page:k.INTEGER,species:k.INTEGER,state:k.INTEGER},q;this.initialize=function(){n();setInterval(n,100)};b.outfit.bind("updateItems",function(e){e=e.map("id");var g={};if(!arraysMatch(e,f.objects))g.objects=e;g.closet=arraysMatch(e,
f.closet)||arraysMatch(e,f.objects)?undefined:b.closet.items.map("id");if(g.objects||g.closet)l(g)});b.outfit.bind("updatePetType",function(e){if(e.color_id!=f.color||e.species_id!=f.species)l({color:e.color_id,species:e.species_id,state:undefined})});b.outfit.bind("petTypeNotFound",function(){window.history.back()});b.outfit.bind("updatePetState",function(e){var g=b.outfit.pet_type;if(e.id!=f.state&&g&&(f.state||e.id!=g.pet_state_ids[0]))l({state:e.id})});b.search.bind("updateRequest",function(e){if(e.page!=
f.search_page||e.query!=f.search)l({search_page:e.page,search:e.query})});(function(){ZeroClipboard.setMoviePath("/assets/swf/ZeroClipboard.swf");var e=$("#shorten-url-response"),g=$("#shorten-url-form"),r=$("#shorten-url-response-form"),y=$("#shorten-url-loading"),x=new ZeroClipboard.Client,a=false;q=function(){g.show();y.hide();r.hide()};BitlyCB.wardrobeSelfShorten=function(c){var h;try{h=c.results[document.location.href].hash}catch(j){log("shortener error: likely no longer same URL",j)}c="http://outfits.openneo.net/"+
h;g.hide();r.show();if(!a){x.glue("shorten-url-copy-button","shorten-url-copy-button-wrapper");a=true}e.text(c);x.setText(c)};g.submit(function(c){BitlyClient.shorten(document.location.href,"BitlyCB.wardrobeSelfShorten");y.show();c.preventDefault()});r.submit(function(c){c.preventDefault()})})()};
View.Preview=function(b){function n(){var d;if(f)return false;if(l&&l.setAssets){d=b.outfit.getVisibleAssets();l.setAssets(d)}else f=true}$("#preview");var l,f=false;swfobject.embedSWF("/assets/swf/preview.swf?v=0.11","preview-swf","100%","100%","9","/assets/js/swfobject/expressInstall.swf",{swf_assets_path:"/assets"},{wmode:"transparent"});window.previewSWFIsReady=function(){l=document.getElementById("preview-swf");if(f){f=false;n()}};b.outfit.bind("updateItems",n);b.outfit.bind("updateItemAssets",
n);b.outfit.bind("updatePetState",n)};
View.PetStateForm=function(b){function n(m){if(m){f.children("li.selected").removeClass("selected");$(d+"[value="+m.id+"]").attr("checked","checked").parent().addClass("selected")}}var l=$("#pet-state-form"),f=l.children("ul"),d="#pet-state-form input[name=pet_state_id]";$(d).live("click",function(){b.outfit.setPetStateById(+this.value)});b.outfit.bind("petTypeLoaded",function(m){m=m.pet_state_ids;var k,o,q,e;f.children().remove();if(m.length==1)l.hide();else{l.show();for(k=0;k<m.length;k++){o="pet-state-radio-"+
k;q=$("<li/>");e=$("<input/>",{id:o,name:"pet_state_id",type:"radio",value:m[k]});o=$("<label/>",{"for":o,text:k+1});k==0&&e.attr("checked","checked");e.appendTo(q);o.appendTo(q);q.appendTo(f)}n(b.outfit.pet_state)}});b.outfit.bind("updatePetState",n)};
View.PetTypeForm=function(b){function n(d){f&&d&&$.each(l,function(m){l[m].val(d[m+"_id"])})}var l={},f=false;$("#pet-type-form").submit(function(d){d.preventDefault();b.outfit.setPetTypeByColorAndSpecies(+l.color.val(),+l.species.val())}).children("select").each(function(){l[this.name]=$(this)});this.initialize=function(){b.pet_attributes.load()};b.pet_attributes.bind("update",function(d){$.each(d,function(m){var k=l[m];$.each(this,function(){$("<option/>",{text:this.name,value:this.id}).appendTo(k)})});
f=true;n(b.outfit.pet_type)});b.outfit.bind("updatePetType",n)};
View.Search=function(b){var n=$("#preview-search-form"),l=new Partial.ItemSet(b,"#preview-search-form ul"),f=n.find("input[name=query]"),d={INNER_WINDOW:4,OUTER_WINDOW:1,GAP_TEXT:"&hellip;",PREV_TEXT:"&larr; Previous",NEXT_TEXT:"Next &rarr;",PAGE_EL:$("<a/>",{href:"#"}),CURRENT_EL:$("<span/>",{"class":"current"}),EL_ID:"#preview-search-form-pagination"};d.EL=$(d.EL_ID);d.GAP_EL=$("<span/>",{"class":"gap",html:d.GAP_TEXT});d.PREV_EL=$("<a/>",{href:"#",rel:"prev",html:d.PREV_TEXT});d.NEXT_EL=$("<a/>",
{href:"#",rel:"next",html:d.NEXT_TEXT});$(d.EL_ID+" a").live("click",function(m){m.preventDefault();m=$(this).data("page");b.search.setItemsByQuery(f.val(),m)});n.submit(function(m){m.preventDefault();b.search.setItemsByQuery(f.val(),1)});b.search.bind("updateItems",function(m){l.setItems(m)});b.search.bind("updateRequest",function(m){f.val(m.query||"")});b.search.bind("updatePagination",function(m,k){var o=m-d.INNER_WINDOW,q=m+d.INNER_WINDOW,e,g,r=1;if(q>k){o-=q-k;q=k}if(o<1){q+=1-o;o=1;if(q>k)q=
k}o=[2+d.OUTER_WINDOW,o];q=[q+1,k-d.OUTER_WINDOW];e=o[1]-o[0]>1;g=q[1]-q[0]>1;d.EL.children().remove();for(m>1&&d.PREV_EL.clone().data("page",m-1).appendTo(d.EL);r<=k;)if(e&&r>=o[0]&&r<o[1]){d.GAP_EL.clone().appendTo(d.EL);r=o[1]}else if(g&&r>=q[0]&&r<q[1]){d.GAP_EL.clone().appendTo(d.EL);r=q[1]}else{r==m?d.CURRENT_EL.clone().text(r).appendTo(d.EL):d.PAGE_EL.clone().text(r).data("page",r).appendTo(d.EL);r++}m<k&&d.NEXT_EL.clone().data("page",m+1).appendTo(d.EL)});b.search.bind("error",function(m){log(m)})};
View.Title=function(b){b.base_pet.bind("updateName",function(n){$("#title").text("Planning "+n+"'s outfit")})};main_wardrobe=new Wardrobe;main_wardrobe.registerViews(View);main_wardrobe.initialize();