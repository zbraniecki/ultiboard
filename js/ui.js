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
    UI.nodes.scenarios = $("#scenarios");
    UI.nodes.kfs = $("#kfs");

    UI.nodes.vision = $("#vision");
    UI.nodes.vision.on("change", UI.onvisionchange);
  }

  UI.reset_values = function() {
    $("li", UI.nodes.orientations).removeClass('active');
    $("li[data-value="+Field.settings.orientation+"]", UI.nodes.orientations).addClass('active');


    $("li", UI.nodes.plays).removeClass('active');
    $("li[data-value="+Data.tactic.play+"]", UI.nodes.plays).addClass('active');

    UI.nodes.scenarios.empty();
    var scenarios = Data.get_data('play').scenarios;
    if (scenarios.length > 1) {
      for (var i in scenarios) {
        var s = scenarios[i];
        var a = $("<a/>").attr('href', '#')
          .html(s['desc'])
          .on('click', UI.onscenariochange);
        var li = $("<li/>").attr('data-value', i).append(a);
        li.appendTo(UI.nodes.scenarios);
      }

      UI.nodes.scenarios.parent().show();
    } else {
      UI.nodes.scenarios.parent().hide();
    }
    UI.reset_scenario();

    location.hash = Data.tactic.play;
    $('h1').html(Data.get_data('play').name+" <small>("+Data.get_data('scenario').desc+")</small>");
  }

  UI.reset_scenario = function() {
    UI.nodes.kfs.empty(); 
    var kfs = Data.get_data('scenario')['kfs'];
    if (kfs.length > 1) {
      for (var i in kfs) {
        var k = kfs[i];
        var a = $("<a/>").attr('href', '#')
          .html(k['desc'])
          .on('click', UI.onkfchange);
        var li = $("<li/>").attr('data-value', i).append(a);
        li.appendTo(UI.nodes.kfs);
      }
      UI.reset_kf();
      UI.nodes.kfs.show();
    } else {
      UI.nodes.kfs.hide();
    }
    $("li", UI.nodes.scenarios).removeClass('active');
    $("li[data-value="+Data.tactic.scenario+"]", UI.nodes.scenarios).addClass('active');
    $("h1 small").text(" ("+Data.get_data('scenario').desc+")")
  }

  UI.reset_kf = function() {
    $("li", UI.nodes.kfs).removeClass('active');
    $("li[data-value="+Data.tactic.kf+"]", UI.nodes.kfs).addClass('active');
  }

  UI.onmodechange = function(e) {
    $('.field').hide();
    var val = $(this).parent().attr('data-value');
    $('.player, .disc').css('transition-property', 'none');
    Field.settings['orientation'] = val;
    Field.setupField();
    Field.position_players();
    UI.reset_values();
    $('.field').show();
    e.preventDefault();
  }

  UI.onplaychange = function(e) {
    var val = $(this).parent().attr('data-value');
    Data.set_play(val);
    UI.reset_values();
    Field.position_players();
    e.preventDefault();
  }

  UI.onscenariochange = function(e) {
    var val = $(this).parent().attr('data-value');
    Data.set_scenario(val);
    UI.reset_scenario();
    Field.position_players();
    e.preventDefault();
  }

  UI.onkfchange = function(e) {
    var val = $(this).parent().attr('data-value');
    Data.set_kf(val);
    UI.reset_kf();
    Field.position_players(null, true);
    e.preventDefault();
  }

  UI.onvisionchange = function() {
    if (Field.vision) {
      Field.clear_vision();
      Field.vision = false;
    } else {
      for(var i=0;i<7;i++) {
        Field.draw_vision(i+1);
        Field.vision = true;
      }
    }
  }

}).call(this);
