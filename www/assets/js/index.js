function petImage(b,e){return"http://pets.neopets.com/"+b+"/1/"+e+".png"}var Preview={clear:function(){$("#preview-response").text(Preview.Job.current.name)},displayLoading:function(){$("#pet-preview").addClass("loading");$("#preview-response").text("Loading...")},notFound:function(b){$("#pet-preview").addClass("hidden");$("#preview-response").text(b)},updateWithName:function(){var b=$("#name").val();if(b){currentName=b;if(b!=Preview.Job.current.name){b=new Preview.Job.Name(b);b.setAsCurrent();Preview.displayLoading()}}else Preview.clear()}};
Preview.Job=function(b,e){function i(){g.loading=true;$("#pet-preview").attr("src",petImage(e+"/"+b,a))}var g=this,a=2;g.loading=false;this.increaseQualityIfPossible=function(){if(a==2){a=4;i()}};this.setAsCurrent=function(){Preview.Job.current=g;i()}};Preview.Job.Name=function(b){this.name=b;Preview.Job.apply(this,[b,"cpn"])};Preview.Job.Hash=function(b){Preview.Job.apply(this,[b,"cp"])};
$(function(){var b;Preview.Job.current={name:$("#preview-response").text()};var e={};$.each(document.location.search.substr(1).split("&"),function(){var a=this.split("=");if(a.length==2)e[a[0]]=a[1]});if(e.name){$("#name").val(e.name);if(e.species&&e.color){var i=$("<div></div>",{"class":"notice",html:"Thanks for showing us <strong>"+e.name+"</strong>! Keep up the good work!"});$("<img/>",{"class":"inline-image",src:petImage("cpn/"+e.name,1)}).prependTo(i);i.prependTo("#container")}}Preview.updateWithName();
$("#name").keyup(function(){if(b){clearTimeout(b);Preview.Job.current.loading=false}b=setTimeout(Preview.updateWithName,250)});$("#pet-preview").load(function(){if(Preview.Job.current.loading){Preview.Job.loading=false;Preview.Job.current.increaseQualityIfPossible();$(this).removeClass("loading").removeClass("hidden");$("#preview-response").text(Preview.Job.current.name)}}).error(function(){if(Preview.Job.current.loading){Preview.Job.loading=false;Preview.notFound("Pet not found.")}});var g=$("#species, #color");
g.change(function(){var a={},f=[];g.each(function(){var c=$(this),h=c.children(":selected");a[c.attr("id")]=h.val();f.push(h.text())});f=f.join(" ");Preview.displayLoading();$.ajax({url:"/pet_types.json",data:{"for":"image",species_id:a.species,color_id:a.color},dataType:"json",success:function(c){if(c){c=new Preview.Job.Hash(c.image_hash);c.name=f;c.setAsCurrent()}else Preview.notFound("We haven't seen a "+f+". Have you?")},error:function(){Preview.notFound("Error fetching preview. Try again?")}})});
$.getJSON("http://blog.openneo.net/api/read/json?callback=?",function(a){a=a.posts[0];var f=$("#blog-preview"),c=a["url-with-slug"],h="Here's the latest!",d="",j;if(a.type=="regular"){h=a["regular-title"];d=a["regular-body"]}else if(a.type=="link"){h=a["link-text"];d=a["link-description"]}else if(a.type=="photo"){d=a["photo-caption"];j=a["photo-url-75"]}d=d.replace(/(<\/?[\S][^>]*>)/gi,"");if(d.length>100){d=d.substring(0,100);d=d.replace(/\s+\w+$/,"");d+="&hellip;"}f.find("h4").text(h).wrapInner($("<a/>",
{href:c}));f.find("p").html(d);$("<a/>",{id:"read-more",href:c,text:"read more"}).appendTo(f.find("div"));j&&f.find("img").attr("src",j).parent().attr("href",c)})});