var settings = {
  'circle': {
    'radius': 20,
  },
  'field': {
    'orientation': 'horizontal',
    'width': 100,
    'height': 37,
    'scale': 9,
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
    rotate = 90;
    width = height;
    height = settings['field']['width']*scale;
  }
  $(".field")
    .removeClass('vertical')
    .removeClass('horizontal')
    .addClass(orient)
    .css({'width': width,
          'height': height});
}


var setups = {}

function calculate_pos(pos, rotate) {
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
    './4hands.json',
    function(data) {
      setups = data;
      for (var i in data) {
        $("<option/>").attr('value', i).text(i).appendTo($("#plays"));
      }
      position_players(setups['pool']);
    }
  );
}

function init() {
  setupField();
  $(".field").show();
  load_plays();
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
