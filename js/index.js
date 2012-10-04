

function init() {
  if (location.hash) {
    settings['tactic']['play'] = location.hash.substr(1);
  }
  Field.setupField();
  Data.load_plays();
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
