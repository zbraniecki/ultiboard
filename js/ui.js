(function() {
  'use strict';

  var UI = this.UI =  {};

  UI.nodes = {
    'orientation': null,
  }

  UI.init = function() {
    UI.nodes.orientations = $("#orientations");
    $("a", UI.nodes.orientations).on('click', UI.onmodechange);
    UI.nodes.plays = $("#plays");
    UI.nodes.plays.on('change', UI.onplaychange);

    UI.nodes.scenario = $("#scenario");

    UI.nodes.kf = $("#kf");
  }

  UI.reset_values = function() {
    
    $("li", UI.nodes.orientations).removeClass('active');
    $("li[data-value="+Field.settings.orientation+"]", UI.nodes.orientations).addClass('active');
 
    UI.nodes.plays.val(Data.tactic.play);

    UI.nodes.scenario.empty();
    var scenarios = Data.get_data('play').scenarios;
    for (var i in scenarios) {
      var s = scenarios[i];
      $("<option/>").attr('value', i).text(s['desc']).appendTo(UI.nodes.scenario);
    }
   
    UI.nodes.kf.empty(); 
    var kfs = Data.get_data('scenario')['kfs'];
    for (var i in kfs) {
      var k = kfs[i];
      $("<option/>").attr('value', i).text(k['desc']).appendTo(UI.nodes.kf);
    }

    $('h1').text(Data.get_data('play').name);
  }

  UI.switch_fov = function(f) {
    for(var i=0;i<7;i++) {
      draw_vision(i+1);
    }
  }

  UI.onmodechange = function() {
    $('.field').hide();
    var val = $(this).parent().attr('data-value');
    $('.player, .disc').css('transition-property', 'none');
    Field.settings['orientation'] = val;
    Field.setupField();
    Field.position_players();
    UI.reset_values();
    $('.field').show();
  }

  UI.onplaychange = function() {
    var val = this.options[this.selectedIndex].value;
    Data.set_play(val);
    UI.reset_values();
    $('.player, .disc').css('transition-property', 'all');
    Field.position_players();
  }

}).call(this);
