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
          zone_id: item.attr('data-zone-id'),
          zone_depth: item.attr('data-zone-depth')
        };
      $('<div id="'+layerId+'"></div>').appendTo(imageLayersWrapper);
      swfobject.embedSWF(item.attr('data-asset-url'), layerId,
        width, height, '9', '/assets/js/swfobject/expressInstall.swf', null,
        {wmode: 'transparent'}, {style: 'z-index: ' + assetData.zone_depth});
      allAssetData[layerId] = assetData;
    });
    
    imageWrapper.removeClass('loading-pet-swf-image');
    var assetsByZone = {};
    imageWrapper.find('object').each(function () {
      var swf = $(this), asset_data = allAssetData[swf.attr('id')];
      if(!assetsByZone[asset_data.zone_id]) assetsByZone[asset_data.zone_id] = [];
      assetsByZone[asset_data.zone_id].push(swf);
    });
    
    $.each(assetsByZone, function (zone_id, assets) {
      if(assets.length > 1) {
        var toggleBar = imageWrapper.children('.swf-image-toggle-bar'),
          label = "Zone #" + zone_id;
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
  }
})();

$(function () {
  $('.pet-swf-image').each(function () {
    $(this).swfImage();
  });
});

function log(obj) {
  if(console && console.log) console.log(obj);
}
