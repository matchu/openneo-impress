var preview_el=$("#pet-preview"),img_el=preview_el.find("img"),response_el=preview_el.find("span"),name_el=$("#name");preview_el.click(function(){name_el.val(Preview.Job.current.name).closest("form").submit()});
var Preview={clear:function(){typeof Preview.Job.fallback!="undefined"&&Preview.Job.fallback.setAsCurrent()},displayLoading:function(){preview_el.addClass("loading");response_el.text("Loading...")},notFound:function(a){preview_el.addClass("hidden");response_el.text(a)},updateWithName:function(){var a=name_el.val();if(a){currentName=a;if(!Preview.Job.current||a!=Preview.Job.current.name){a=new Preview.Job.Name(a);a.setAsCurrent();Preview.displayLoading()}}else Preview.clear()}};
$.get("/spotlight_pets.txt",function(a){a=a.split("\n");Preview.Job.fallback=new Preview.Job.Name(a[Math.floor(Math.random()*(a.length-1))]);Preview.Job.current||Preview.Job.fallback.setAsCurrent()});Preview.Job=function(a,g){function b(){d.loading=true;img_el.attr("src",petImage(g+"/"+a,c))}var d=this,c=2;d.loading=false;this.increaseQualityIfPossible=function(){if(c==2){c=4;b()}};this.setAsCurrent=function(){Preview.Job.current=d;b()}};
Preview.Job.Name=function(a){this.name=a;Preview.Job.apply(this,[a,"cpn"])};Preview.Job.Hash=function(a){Preview.Job.apply(this,[a,"cp"])};
$(function(){var a;name_el.val(PetQuery.name);Preview.updateWithName();name_el.keyup(function(){if(a){clearTimeout(a);Preview.Job.current.loading=false}a=setTimeout(Preview.updateWithName,250)});img_el.load(function(){if(Preview.Job.current.loading){Preview.Job.loading=false;Preview.Job.current.increaseQualityIfPossible();preview_el.removeClass("loading").removeClass("hidden").addClass("loaded");response_el.text(Preview.Job.current.name)}}).error(function(){if(Preview.Job.current.loading){Preview.Job.loading=
false;Preview.notFound("Pet not found.")}});var g=$("#species, #color");g.change(function(){var b={},d=[];g.each(function(){var c=$(this),f=c.children(":selected");b[c.attr("id")]=f.val();d.push(f.text())});d=d.join(" ");Preview.displayLoading();$.ajax({url:"/pet_types.json",data:{"for":"image",species_id:b.species,color_id:b.color},dataType:"json",success:function(c){if(c){c=new Preview.Job.Hash(c.image_hash);c.name=d;c.setAsCurrent()}else Preview.notFound("We haven't seen a "+d+". Have you?")},
error:function(){Preview.notFound("Error fetching preview. Try again?")}})});$.getJSON("http://blog.openneo.net/api/read/json?callback=?",function(b){b=b.posts[0];var d=$("#blog-preview"),c=b["url-with-slug"],f="Here's the latest!",e="",h;if(b.type=="regular"){f=b["regular-title"];e=b["regular-body"]}else if(b.type=="link"){f=b["link-text"];e=b["link-description"]}else if(b.type=="photo"){e=b["photo-caption"];h=b["photo-url-75"]}e=e.replace(/(<\/?[\S][^>]*>)/gi,"");if(e.length>100){e=e.substring(0,
100);e=e.replace(/\s+\w+$/,"");e+="&hellip;"}d.find("h4").text(f).wrapInner($("<a/>",{href:c}));d.find("p").html(e);$("<a/>",{id:"read-more",href:c,text:"read more"}).appendTo(d.find("div"));h&&d.find("img").attr("src",h).parent().attr("href",c)})});