var settings = {
  'circle': {
    'radius': 20,
  },
  'field': {
    'orientation': 'horizontal',
    'width': 100,
    'height': 37,
    'zone': 18,
    'scale': 8,
  },
  'play': 'pool',
}

function setupField() {
  var orient = settings['field']['orientation'];
  var scale = settings['field']['scale'];
  var rotate = 0;
  var width = settings['field']['width']*scale;
  var height = settings['field']['height']*scale;
  if (orient == 'vertical') {
    $(".field")
      .removeClass('vertical')
      .removeClass('horizontal')
      .addClass(orient)
      .css({'width': height,
        'height': width});
    $(".zone").css({
      'height': settings['field']['zone']*scale,
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
      'width': settings['field']['zone']*scale,
      'height': '100%'
    });
  }
}


var setups = {}

function calculate_pos(pos, rotate) {
  if (pos['pos']) {
    pos = pos['pos'];
  }

  var field = settings['field'];
  var circle = settings['circle'];
  var scale = settings['field']['scale'];

  var orient = settings['field']['orientation'];
  var rotate = 0;
  var p = [0,1];
  var width = settings['field']['width']*scale;
  var height = settings['field']['height']*scale;
  var left = 'left';
  var right = 'right';
  if (orient == 'vertical') {
    rotate = 90;
    p = [1,0];
    width = height;
    height = settings['field']['width']*scale;
    left = 'right';  
    right = 'left';
  }

  var obj = {}
  obj['top'] = height*(pos[p[0]]/100)-(circle['radius']/2);
  obj[left] = width*(pos[p[1]]/100)-(circle['radius']/2);
  obj[right] = 'auto';
  return obj;
}

function position_players(play) {
  for (var i=0;i<play['home'].length;i++) {
    $(".player"+(i+1)+".home").css(calculate_pos(play['home'][i])).show();
  }
  for (var i=0;i<play['away'].length;i++) {
    $(".player"+(i+1)+".away").css(calculate_pos(play['away'][i])).show();
  }
  if (play['disc']) {
    $(".disc").css(calculate_pos(play['disc'])).show();
  }
}

function load_plays() {
  $.getJSON(
    './4hands2.json',
    function(data) {
      setups = data;
      var types = {};
      var type = null;
      var play = null;
      var scenario = null;
      var sid = null;
      var kf = null;
      var kfid = null;

      for (var i=0;i<data['plays'].length;i++) {
        var p = data['plays'][i];
        if (!types[p['type']]) {
          types[p['type']] = {};
        }
        if (type === null) {
          type = p['type'];
        }
        types[p['type']][p['name']] = p;
      }
      for (var i in types) {
        $("<option/>").attr('value', i).text(i).appendTo($("#types"));
      }
      
      for (var i in types[type]) {
        if (play === null) {
          play = i;
        }
        $("<option/>").attr('value', i).text(i).appendTo($("#plays"));
      }
      for (var i in types[type][play]['scenarios']) {
        var s = types[type][play]['scenarios'][i];
        if (scenario === null) {
          scenario = s;
          sid = i;
        }
        $("<option/>").attr('value', i).text(s['desc']).appendTo($("#scenarios"));
      }
      for (var i in types[type][play]['scenarios'][sid]['kfs']) {
        var k = types[type][play]['scenarios'][sid]['kfs'][i];
        if (kf === null) {
          kf = k;
          kfid = i;
        }
        $("<option/>").attr('value', i).text(k['desc']).appendTo($("#kfs"));
      }
      position_players(types[type][play]['scenarios'][sid]['kfs'][kfid]);
    }
  );
}

function draw_vision(player) {
  var pos = $(".player"+player).position();
  var setup = setups[settings['play']];
  var vis = setup['home'][player-1]['vis'];
  if (vis) {
    var d = $("<div/>").attr('id', 'vision').appendTo($(".field"));
    d.css({'top': pos['top']-45+10, 'left': pos['left']-45+10});
    d.css('-moz-transform', 'rotate('+vis+'deg)');
  }
}

function init() {
  if (location.hash) {
    settings['play'] = location.hash.substr(1);
  }
  setupField();
  $(".field").show();
  load_plays();
}

function switch_fov(f) {
  for(var i=0;i<7;i++) {
    draw_vision(i+1);
  }
}

function switch_mode(t) {
  $('.field').hide();
  $('.player, .disc').css('transition-property', 'none');
  var val = t.options[t.selectedIndex].value;
  settings['field']['orientation'] = val;
  setupField();
  position_players(setups[settings['play']]);
  $('.field').show();
}

function switch_play(t) {
  var val = t.options[t.selectedIndex].value;
  settings['play'] = val;
  $('.player, .disc').css('transition-property', 'all');
  position_players(setups[val]);
}
