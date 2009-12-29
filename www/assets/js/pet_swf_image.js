var APPLICATION_DATA, APPLICATION_DATA_CALLBACK_STACK;

function loadApplicationData(callback) {
  if(APPLICATION_DATA) {
    return callback(APPLICATION_DATA);
  } else {
    $.getJSON('/application_data.php', function (data) {
      APPLICATION_DATA = data;
      callback(APPLICATION_DATA);
    });
  }
}

(function () {
  var allAssetData = {}, swfImageItemCount = 0;

  $.fn.swfImage = function () {
    var list = this.hide(),
      imageWrapper = $('<div class="active-pet-swf-image loading-pet-swf-image">'
        + '<div class="pet-swf-image-layers"></div></div>').insertBefore(list),
      imageLayersWrapper = imageWrapper.children().eq(0),
      width = imageLayersWrapper.width(), height = imageLayersWrapper.height();
    list.children('li').hide().each(function () {
      var item = $(this),
        layerId = "pet-swf-image-item-" + swfImageItemCount++,
        assetData = {
          asset_url: item.attr('data-asset-url'),
          zone_id: item.attr('data-zone-id')
        };
      imageLayersWrapper.append('<div id="'+layerId+'"></div>');
      swfobject.embedSWF(item.attr('data-asset-url'), layerId,
        width, height, '9', '/assets/js/swfobject/expressInstall.swf', null,
        {wmode: 'transparent'});
      allAssetData[layerId] = assetData;
    });
    imageWrapper.removeClass('loading-pet-swf-image');
    loadApplicationData(function (applicationData) {
      var assetsByZone = {};
      function zoneById(id) {
        return $.grep(applicationData.zones, function (zone) {
          return zone.id == id;
        })[0];
      }
      imageWrapper.find('object').each(function () {
        var swf = $(this), swfZoneId = allAssetData[swf.attr('id')].zone_id,
          zone = zoneById(swfZoneId);
        if(!assetsByZone[swfZoneId]) assetsByZone[swfZoneId] = [];
        assetsByZone[swfZoneId].push(swf);
        swf.css('zIndex', zone.depth);
      });
      $.each(assetsByZone, function (zone_id, assets) {
        if(assets.length > 1) {
          var toggleBar = imageWrapper.children('.swf-image-toggle-bar'),
            label = zoneById(zone_id).label.toLowerCase();
          if(!toggleBar.length) {
            toggleBar = $('<div class="swf-image-toggle-bar">toggle:</div>')
              .appendTo(imageWrapper);
          }
          for(var i=1;i<assets.length;i++) {
            assets[i].hide();
          }
          $('<a href="#">' + label + '</a>').click(function (e) {
            e.preventDefault();
            $.each(assets, function (i) {
              if(this.is(':visible')) {
                var nextAsset = assets[i+1];
                if(!nextAsset) nextAsset = assets[0];
                this.hide();
                nextAsset.show();
                return false;
              }
            });
          }).appendTo(toggleBar);
        }
      });
    });
  }
})();

$(function () {
  var swfImages = $('.pet-swf-image').each(function () {
    $(this).swfImage();
  });
});

function log(obj) {
  if(console && console.log) console.log(obj);
}
