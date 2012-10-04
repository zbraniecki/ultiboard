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
    $(".field").show();
  }

  Field.calculate_pos = function(pos, rotate) {
    if (pos['pos']) {
      pos = pos['pos'];
    }

    var st = this.settings;

    var scale = st['scale'];
    var cr = st['circle']['radius'];

    var orient = st['orientation'];
    var rotate = 0;
    var p = [0,1];
    var width = st['width']*scale;
    var height = st['height']*scale;
    var left = 'left';
    var right = 'right';
    if (orient == 'vertical') {
      rotate = 90;
      p = [1,0];
      width = height;
      height = st['width']*scale;
      left = 'right';  
      right = 'left';
    }

    var obj = {}
    obj['top'] = height*(pos[p[0]]/100)-(cr/2);
    obj[left] = width*(pos[p[1]]/100)-(cr/2);
    obj[right] = 'auto';
    return obj;
  }

  Field.position_players = function(play) {
    if (play === undefined) {
      play = Data.get_data('kf');
    }
    for (var i=0;i<play['home'].length;i++) {
      $(".player"+(i+1)+".home").css(Field.calculate_pos(play['home'][i])).show();
    }
    for (var i=0;i<play['away'].length;i++) {
      $(".player"+(i+1)+".away").css(Field.calculate_pos(play['away'][i])).show();
    }
    if (play['disc']) {
      $(".disc").css(Field.calculate_pos(play['disc'])).show();
    }
  }


  Field.draw_vision = function(player) {
    var pos = $(".player"+player).position();
    var kf = get_data('kf');
    var vis = kf['home'][player-1]['vis'];
    if (vis) {
      var d = $("<div/>").attr('id', 'vision').appendTo($(".field"));
      d.css({'top': pos['top']-45+10, 'left': pos['left']-45+10});
      d.css('-moz-transform', 'rotate('+vis+'deg)');
    }
  }

}).call(this);
