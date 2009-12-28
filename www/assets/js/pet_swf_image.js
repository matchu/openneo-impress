var APPLICATION_DATA;

function loadApplicationData(callback) {
  if(APPLICATION_DATA) return callback(APPLICATION_DATA);
  $.getJSON('/application_data.php', function (data) {
    APPLICATION_DATA = data;
    callback(APPLICATION_DATA);
  });
}

$(function () {
  var swfImageItemCount = 0,
    swfImages = $('.pet-swf-image').each(function () {
      var list = $(this).addClass('active-pet-swf-image').addClass('loading-pet-swf-image'),
        width = list.width(), height = list.height();
      list.children('li').hide().each(function () {
        var item = $(this), id = item.attr('id'), assetData = {
          asset_url: item.attr('data-asset-url'),
          zone_id: item.attr('data-zone-id')
        };
        if(!id) {
          id = "pet-swf-image-item-" + swfImageItemCount++;
          item.attr('id', id);
        }
        swfobject.embedSWF(item.attr('data-asset-url'), id,
          width, height, '9', '/assets/js/swfobject/expressInstall.swf', null,
          {wmode: 'transparent'});
        $('#' + id).data('assetData', assetData);
      });
      list.removeClass('loading-pet-swf-image');
    });
  if(swfImages.length) {
    loadApplicationData(function (applicationData) {
      $('.pet-swf-image object').each(function () {
        var swf = $(this), swfZoneId = swf.data('assetData').zone_id,
          zone = $.grep(applicationData.zones, function (grepped_zone) {
            return grepped_zone.id == swfZoneId;
          })[0];
        swf.css('zIndex', zone.depth);
      });
    });
  }
});
