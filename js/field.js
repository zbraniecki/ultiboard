(function() {
  'use strict';

  var Field = this.Field =  {};

  Field.settings = {
    'orientation': 'horizontal',
    'width': 100,
    'height': 37,
    'zone': 18,
    'scale': 8,
    'circle': {
      'radius': 20,
    },
  }


  Field.setupField = function() {
    var st = this.settings;

    var orient = st['orientation'];
    var scale = st['scale'];
    var rotate = 0;
    var width = st['width']*scale;
    var height = st['height']*scale;
    if (orient == 'vertical') {
      $(".field")
        .removeClass('vertical')
        .removeClass('horizontal')
        .addClass(orient)
        .css({'width': height,
          'height': width});
      $(".zone").css({
        'height': st['zone']*scale,
        'width': '100%'
      });
    } else {
      $(".field")
        .removeClass('vertical')
        .removeClass('horizontal')
        .addClass(orient)
        .css({'width': width,
          'height': height});
      $(".zone").css({
        'width': st['zone']*scale,
        'height': '100%'
      });
    }
  }

}).call(this);
