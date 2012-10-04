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

      $("li", UI.nodes.scenarios).removeClass('active');
      $("li[data-value="+Data.tactic.scenario+"]", UI.nodes.scenarios).addClass('active');
      UI.nodes.scenarios.parent().show();
    } else {
      UI.nodes.scenarios.parent().hide();
    }
   
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
      UI.nodes.kfs.show();
    } else {
      UI.nodes.kfs.hide();
    }
    $('h1').text(Data.get_data('play').name);
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
    var val = $(this).parent().attr('data-value');
    Data.set_play(val);
    UI.reset_values();
    $('.player, .disc').css('transition-property', 'none');
    Field.position_players();
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
