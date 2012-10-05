(function() {
  'use strict';

  var Data = this.Data =  {};


  Data.tactics = {};
  Data.tactic = {
    'type': null,
    'play': null,
    'scenario': null,
    'kf': null,
  };

  Data.get_type_for_play = function(play) {
    for (var i in this.tactics) {
      for (var j in this.tactics[j]) {
        if (j === play) {
          return i;
        }
      }
    }
    return false;
  }

  Data.get_data = function(name, type, play, scenario, kf) {
    var ptr = null; // pointer;

    if (type === undefined) {
      type = this.tactic['type'];
    }
    ptr = this.tactics[type];
    if (name === 'type') {
      return ptr;
    }

    if (play === undefined) {
      play = this.tactic['play'];
    } else if (type === null) {
      type = this.get_type_for_play(play);
    }
    ptr = ptr[play];
    if (name == 'play') {
      return ptr;
    }

    if (scenario === undefined) {
      scenario = this.tactic['scenario'];
    }
    ptr = ptr['scenarios'][scenario];
    if (name == 'scenario') {
      return ptr;
    }

    if (kf === undefined) {
      kf = this.tactic['kf'];
    }
    ptr = ptr['kfs'][kf];
    if (name == 'kf') {
      return ptr;
    }
    throw "Wrong parameters";
  }

  Data.install_data = function(data) {
    var tactics = Data.tactics;
    var current = Data.tactic;

    for (var i=0;i<data['plays'].length;i++) {
      var p = data['plays'][i];
      if (!tactics[p['type']]) {
        tactics[p['type']] = {};
      }
      if (current['type'] === null) {
        current['type'] = p['type'];
      }
      tactics[p['type']][p['id']] = p;
    }

    for (var i in tactics) {
      var a = $("<a/>").attr('href', '#').text(" -- " + i + " -- ");
      var li = $("<li/>").append(a).addClass('disabled');
      li.appendTo(UI.nodes.plays);
      for (var j in tactics[i]) {
        if (current['play'] === null) {
          current['play'] = j;
        }
        var a = $("<a/>").attr('href', '#')
                         .html("&nbsp;&nbsp;" + tactics[i][j].name)
                         .on('click', UI.onplaychange);
        var li = $("<li/>").attr('data-value', j).append(a);
        li.appendTo(UI.nodes.plays);
      }
    }

    Data.set_play();

    Field.position_players(Data.get_data('kf')); 
  }

  Data.load_plays = function(callback) {
    $.getJSON(
        './4hands.json',
        function(data) {
          Data.install_data(data);
          callback();
        }
    );
  }

  Data.set_play = function(play) {
    if (play !== undefined) {
      Data.tactic.play = play;
    }
    var scenarios = Data.get_data('play')['scenarios'];
    for (var i in scenarios) {
      Data.tactic.scenario = i;
      break;
    }
    Data.tactic.kf = scenarios[i]['default'];
  }

  Data.set_scenario = function(scenario) {
    if (scenario !== undefined) {
      Data.tactic.scenario = scenario;
    }
    Data.tactic.kf = Data.get_data('scenario')['default'];
    console.log(Data.tactic);
  }

  Data.set_kf = function(kf) {
    if (kf !== undefined) {
      Data.tactic.kf = kf;
    }
  }

}).call(this);
