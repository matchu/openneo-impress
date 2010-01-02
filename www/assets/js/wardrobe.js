var MainWardrobe = new function Wardrobe() {
  var View = new function WardrobeView() {
    var View = this;
    
    var toolbars = {};
    
    function onResize() {
      var nullPosition = {top: null, left: null};
      $.each(toolbars, function () {
        this.css(nullPosition);
      });
      toolbars.bottom.width($(window).width()-toolbars.right.width());
      toolbars.right.css('height', null);
    }
    
    var generic_toolbar_options = {
      resize: onResize
    };
    
    var toolbar_options = {
      bottom: {
        handles: 'n'
      },
      right: {
        handles: 'w'
      }
    };
    
    $(document).ready(function () {
      $.each(toolbar_options, function (name, options) {
        toolbars[name] = $('#toolbar-' + name).resizable(
          $.extend(generic_toolbar_options, options)
        );
      });
      $(window).resize(onResize);
    });
  }
}


