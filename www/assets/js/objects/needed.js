function closetItemsCallback(b){var a=$("#needed-objects li").filter(function(){return $.inArray(parseInt($(this).attr("data-object-id")),b)!=-1}).addClass("in-closet");if(a.length){closetFeedback("You already have <strong>"+a.length+"</strong> of these items in your closet! How lucky is that?",{"class":"in-closet"});$(".object:not(.in-closet)").fadeTo(1E3,0.5)}else closetFeedback("You don't have any of these items in your closet. Make sure they're there and not in your <a href='http://www.neopets.com/objects.phtml?type=inventory' target='_blank'>inventory</a>!",
{"class":"content-box"})}function closetFeedback(b,a){a||(a={});a.html=b;$("#loading-closet").remove();$("<p/>",a).insertBefore("#needed-objects")}var amf_errors={"PHP: You must be the owner to do that operation.":'If you owned this pet, we would be able to show you which of these objects you could model. If you <em>are</em> the owner, be sure to <a href="http://www.neopets.com/loginpage.phtml" target="_blank">log in to Neopets</a>!',"PHP: Unable to retrieve records from the database.":"Neopets returned an error looking up your closet data from this pet. How odd."};
function amfError(b){var a=amf_errors[b.description];a||(a="Unexpected error: "+b.description);closetFeedback(a,{"class":"content-box"})}
$(function(){function b(){var c=$("#amf-proxy:not(div)");(c=c.length?c.get(0):false)&&typeof c.requestKeys!="undefined"?c.requestKeys(["CustomPetService.getEditorData","closetItemsCallback",d,null],["object_info_registry"]):setTimeout(b,100)}var a=$("#pet-name"),d;if(a.length){d=a.text();$("<div/>",{id:"amf-proxy"}).appendTo("body");swfobject.embedSWF("/assets/swf/amf_proxy.swf","amf-proxy",1,1,"9","/assets/js/swfobject/expressInstall.swf",{},{allowscriptaccess:"always"});$("<img/>",{id:"loading-closet",
src:"/assets/images/loading.gif"}).insertBefore("#needed-objects");b()}});