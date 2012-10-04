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

  Data.load_plays = function() {
    $.getJSON(
        './4hands2.json',
        function(data) {
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

          var scenarios = Data.get_data('play')['scenarios'];
          for (var i in scenarios) {
            var s = scenarios[i];
            if (current['scenario'] === null) {
              current['scenario'] = i;
            }
            $("<option/>").attr('value', i).text(s['desc']).appendTo($("#scenarios"));
          }

          var kfs = Data.get_data('scenario')['kfs'];
          for (var i in kfs) {
            var k = kfs[i];
            if (current['kf'] === null) {
              current['kf'] = i;
            }
            $("<option/>").attr('value', i).text(k['desc']).appendTo($("#kfs"));
          }
          Field.position_players(Data.get_data('kf')); 
        }
    );
  }

}).call(this);
