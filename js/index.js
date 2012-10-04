var settings = {
  'tactics': {},
  'tactic': {
    'type': null,
    'play': null,
    'scenario': null,
    'kf': null,
  }
}


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

function get_type_for_play(play) {
  for (var i in settings['tactics']) {
    for (var j in settings['tactics'][j]) {
      if (j === play) {
        return i;
      }
    }
  }
  return false;
}

function get_data(name, type, play, scenario, kf) {
  var ptr = null; // pointer;

  if (type === undefined) {
    type = settings['tactic']['type'];
  }
  ptr = settings['tactics'][type];
  if (name === 'type') {
    return ptr;
  }

  if (play === undefined) {
    play = settings['tactic']['play'];
  } else if (type === null) {
    type = get_type_for_play(play);
  }
  ptr = ptr[play];
  if (name == 'play') {
    return ptr;
  }

  if (scenario === undefined) {
    scenario = settings['tactic']['scenario'];
  }
  ptr = ptr['scenarios'][scenario];
  if (name == 'scenario') {
    return ptr;
  }

  if (kf === undefined) {
    kf = settings['tactic']['kf'];
  }
  ptr = ptr['kfs'][kf];
  if (name == 'kf') {
    return ptr;
  }
  throw "Wrong parameters";
}

function load_plays() {
  $.getJSON(
    './4hands2.json',
    function(data) {
      setups = data;
      var tactics = settings['tactics'];
      var current = settings['tactic'];

      for (var i=0;i<data['plays'].length;i++) {
        var p = data['plays'][i];
        if (!tactics[p['type']]) {
          tactics[p['type']] = {};
        }
        if (current['type'] === null) {
          current['type'] = p['type'];
        }
        tactics[p['type']][p['name']] = p;
      }

      for (var i in tactics) {
        $("<option/>").text(" -- " + i + " -- ").appendTo($("#plays"));
        for (var j in tactics[i]) {
          if (current['play'] === null) {
            current['play'] = j;
          }
          $("<option/>").attr('value', j).html("&nbsp;&nbsp;" + j).appendTo($("#plays"));
        }
      }

      var scenarios = get_data('play')['scenarios'];
      for (var i in scenarios) {
        var s = scenarios[i];
        if (current['scenario'] === null) {
          current['scenario'] = i;
        }
        $("<option/>").attr('value', i).text(s['desc']).appendTo($("#scenarios"));
      }
      
      var kfs = get_data('scenario')['kfs'];
      for (var i in kfs) {
        var k = kfs[i];
        if (current['kf'] === null) {
          current['kf'] = i;
        }
        $("<option/>").attr('value', i).text(k['desc']).appendTo($("#kfs"));
      }
      position_players(get_data('kf')); 
    }
  );
}

function draw_vision(player) {
  var pos = $(".player"+player).position();
  var kf = get_data('kf');
  var vis = kf['home'][player-1]['vis'];
  if (vis) {
    var d = $("<div/>").attr('id', 'vision').appendTo($(".field"));
    d.css({'top': pos['top']-45+10, 'left': pos['left']-45+10});
    d.css('-moz-transform', 'rotate('+vis+'deg)');
  }
}

function init() {
  if (location.hash) {
    settings['tactic']['play'] = location.hash.substr(1);
  }
  Field.setupField();
  $(".field").show();
  //load_plays();
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
