(function() {
  'use strict';

  var Field = this.Field =  {};

  Field.settings = {
    'orientation': 'horizontal',
    'width': 100,
    'height': 37,
    'zone': 18,
    'scale': 6,
    'circle': {
      'radius': 20,
    },
    'vision': false,
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
      $('svg').css({'width': width,
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

  Field.position_players = function(play, preserve) {
    if (!preserve) {
      $(".field .player").remove();
      $("#legend table tr.player").remove();
    }
    if (!play) {
      play = Data.get_data('kf');
    }
    var tableHome = $("#legend .home table");
    for (var i=0;i<play['home'].length;i++) {
      if (!preserve) {
        $("<div/>")
          .text(i+1)
          .addClass('player')
          .addClass('player'+(i+1))
          .addClass('home')
          .css(Field.calculate_pos(play['home'][i]))
          .on('mouseover', function() {
            Field.focus_player('home', $(this).text())
          })
        .on('mouseout', function() {
          Field.unfocus_players('home');
        })
        .appendTo($(".field"));
      var tr = $("<tr/>")
        .addClass('player'+(i+1))
        .addClass('player')
        .on('mouseover', function() {
        var nr = $(this).children().first().text();
        Field.focus_player('home', nr);
      }).on('mouseout', function() {
        Field.unfocus_players('home');
      });
      var td1 = $("<td/>").text(i+1).appendTo(tr);
      var td2 = $("<td/>").text(play['home'][i]['role']).appendTo(tr);
      var person = play['home'][i]['person'];
      if (!person) {
        person = ['','']
      }
      var td3 = $("<td/>").text(person[0]).appendTo(tr);
      var td4 = $("<td/>").text(person[1]).appendTo(tr);
      tr.appendTo(tableHome);
      } else {
        $(".field .home.player"+(i+1)).css(Field.calculate_pos(play['home'][i]))
      }
    }
    var tableAway = $("#legend .away table");
    for (var i=0;i<play['away'].length;i++) {
      if (!preserve) {
      $("<div/>")
        .text(i+1)
        .addClass('player')
        .addClass('player'+(i+1))
        .addClass('away')
        .css(Field.calculate_pos(play['away'][i]))
        .on('mouseover', function() {
          Field.focus_player('away', $(this).text())
        })
        .on('mouseout', function() {
          Field.unfocus_players('away');
        })
        .appendTo($(".field"));
      var tr = $("<tr/>")
        .addClass('player'+(i+1))
        .addClass('player')
        .on('mouseover', function() {
        var nr = $(this).children().first().text();
        Field.focus_player('away', nr);
      }).on('mouseout', function() {
        Field.unfocus_players('away');
      });
      var td1 = $("<td/>").text(i+1).appendTo(tr);
      var td2 = $("<td/>").text(play['away'][i]['role']).appendTo(tr);
      var person = play['away'][i]['person'];
      if (!person) {
        person = ['','']
      }
      var td3 = $("<td/>").text(person[0]).appendTo(tr);
      var td4 = $("<td/>").text(person[1]).appendTo(tr);
      tr.appendTo(tableAway);
      } else {
        $(".field .away.player"+(i+1)).css(Field.calculate_pos(play['away'][i]))
      }
    }
    if (play['disc']) {
      $(".disc").css(Field.calculate_pos(play['disc'])).show();
    }
  }

  Field.focus_player = function(team, nr) {
    $(".field ."+team+".player"+nr).addClass('active');
    $("#legend ."+team+" table tr.player"+nr).addClass('active');
  }

  Field.unfocus_players = function(team, nr) {
    $(".field ."+team+".player").removeClass('active');
    $("#legend ."+team+" table tr").removeClass('active');
  }

  Field.draw_vision = function(player) {
    var pos = $(".player"+player).position();
    var kf = Data.get_data('kf');
    var vis = kf['home'][player-1]['vis'];
    if (vis) {
      var d = $("<div/>").addClass('vision').appendTo($(".field"));
      d.css({'top': pos['top']-45+10, 'left': pos['left']-45+10});
      d.css('-moz-transform', 'rotate('+vis+'deg)');
    }
  }

  Field.clear_vision = function() {
    $(".vision").remove();
  }

  Field.draw_area = function(player) {
    var kf = Data.get_data('kf');
    var cov = kf['home'][player-1]['cov'];
    /*
     <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
  preserveAspectRatio="xMidYMid slice"
  style="width:300px; height:300px; position:absolute; top:100px; left:100px; z-index:30;">
  <ellipse cx="60" cy="60" rx="50" ry="25" fill="red" style="opacity: 0.3"/>
</svg>
   */
    //var svg = $("<svg/>").css('border', '1px solid black');
    //svg.appendTo($(".field"));
    var area = $("<ellipse/>").attr({
      'cx': 60,
      'cy': 60,
      'rx': 50,
      'ry': 25,
      'fill': 'red',
    });
    area.appendTo($("svg"));
  }

}).call(this);
