  // YOUR CODE HERE:
var app = {

  messageHeight: 102,


  init: function(){
    //handlers
    app.fetch();

    $('.fetch').on('click', function() {
      app.fetch();
    });

    app.svg = d3.select('#canvas').append('svg')
      .attr('width', '680')
      .attr('id', 'chats');

    $('#chats').on('click', '.add', function(e) {
      e.preventDefault();
      app.addFriend($(this).parent().find('.username').text());
      app.fetch();
    });

    $('#chats').on('click', '.remove', function(e) {
      e.preventDefault();
      app.removeFriend($(this).parent().find('.username').text());
      app.fetch();
    });

    $('.send').on('click', function(e) {
      e.preventDefault();

      var message = {};
        message.text = $('input').val();
        message.username = document.URL.replace(/.+username=(.+)/, '$1');
        message.roomname = 'lobby';

      app.send(message);
      setTimeout(function(){app.fetch()}, 1000);
      $('input').val("");
    });

    $('.room-selector').on('change', function(e){
      e.preventDefault();
      app.fetch();
    })
  },

  send: function(data){
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(d) {
        console.log("POST successful");},
      error: function(jqXHR, status, error) {
        console.log(error);
      }
    })
  },

  fetch: function(){
    var where = {
      updatedAt:{
        $gte: {
          __type: 'Date',
          iso: app.lastHour()
        }
      }
    };
    var room = $('.room-selector').val();
    if (!(room === 'all' || room === undefined || room === '')){
      where.roomname = room;
    }
    $.ajax({
      url: this.server,
      type: 'GET',
      data: 'where=' + JSON.stringify(where) + '&order=-createdAt',
      contentType: 'application/json',
      success: app.update,
      error: function(jqXHR, status, error) {
        console.log(error);
      }
    })
  },

  server: 'https://api.parse.com/1/classes/chatterbox',

  clean: function(message) {
    //cleans one message
    if(message.hasOwnProperty('room') && !message.hasOwnProperty('roomname')){
      message.roomname = message.room;
      delete message.room;
    }
    if(message.hasOwnProperty('text') && message.hasOwnProperty('roomname') && message.hasOwnProperty('username') &&
       message.text     !== undefined && message.text     !== 'undefined' && $.trim(message.text)     !== '' &&
       message.roomname !== undefined && message.roomname !== 'undefined' && $.trim(message.roomname) !== '' &&
       message.username !== undefined && message.username !== 'undefined' && $.trim(message.username) !== ''){
      var cleaned = {};
      // start with dirty text, e.g., message.text
      cleaned.text = $('<span></span>').text($.trim(_.escape(message.text))).html();
      cleaned.roomname = $('<span></span>').text($.trim(_.escape(message.roomname))).html();
      cleaned.username = $('<span></span>').text($.trim(_.escape(message.username))).html();
      cleaned.createdAt = message.createdAt;
      cleaned.objectId = message.objectId;
      cleaned.updatedAt = message.updatedAt;
      cleaned.friend = app.hasFriend(cleaned.username);

      return cleaned;
    } else {
      return null;
    }
  },

  update: function(successData) {
    var data = successData.results;

    for(var i = 0; i < data.length; i++) {
      var clean = app.clean(data[i]);
      if(clean) {
        data[i] = clean;
      } else {
        data.splice(i, 1);
        i--;
      }
    }

    app.updateRoomSelector(data);

    app.svg.attr('height', data.length * app.messageHeight);

    // update
    var messages = app.svg.selectAll('.message').data(data, function(d) { return d.objectId;});
    //entering
    var enteringMessages = messages.enter()
      .append('g').attr('class', 'message')

    //message text
    enteringMessages
      .append('text').attr('class', 'text');

    //friend icon
    enteringMessages
      .append('image')
      .attr('width', '15')
      .attr('height', '15');

    //username
    enteringMessages
      .append('text').attr('class', 'username');

    //roomname
    enteringMessages
      .append('text').attr('class', 'roomname');

    //update + entering
    //message text
    messages
      .attr('transform', function(d,i){return 'translate(0,' + (app.messageHeight * (i + 1)) + ')';})
      .select('.text')
      .text(function(d){return "'" + d['text'] + "'"})
      .attr('transform', 'translate(50, 30)');

    //username
    messages.select('.username')
    .text(function(d){return d['username']})
    .attr('transform', 'translate(20, 12)')
    .attr('font-weight',
      function(d) {
        if(d.friend) {
          return "800";
        } else {
          return '400';
        }
      });

    //Room Name
    messages.select('.roomname')
    .text(function(d){
      return "Room Name: " + d['roomname'];
    })
    .attr('transform', function(d,i){return 'translate(300,60)';})
    .attr('fill', 'grey').attr('size', '8');

    // add/remove friend image
    messages.select('image')
      .attr('xlink:href', function(d) {
          if(d.friend) {
            return 'images/delete_profile-128.png'
          } else {
            return 'images/add_friend-128.png'
          }
        })
      .attr('class', function(d) {
        if(d.friend) {
          return 'remove';
        } else {
          return 'add';
        }
      });

    //remove
    messages
      .exit().remove();

  },

  clearMessages: function(){
    app.svg.selectAll('.message').data([]).exit().remove();
  },

  addMessage: function(input){
    app.send(input);
    app.update();
  },

  lastHour: function() {
    var now = new Date();
    now.setUTCHours(now.getUTCHours() - 1);
    return now.toISOString();
  },

  friends: {},

  addFriend: function(username) {
    app.friends[username] = true;
    return app.friends;
  },

  hasFriend: function(username) {
    return app.friends[username] ? true : false;
  },

  removeFriend: function(username) {
    delete app.friends[username];
    return app.friends;
  },

  updateRoomSelector: function(data){
    var el = $('.room-selector');
    var oldValue = el.val();
    el.find('option')
      .remove()
      .end()
      .append('<option value="all">All Rooms</option>')
    var rooms = {};
    app.roomNames = [];
    for (var i = 0; i < data.length; i++){
      if (data[i].roomname !== undefined && $.trim(data[i].roomname) !== '')
      rooms[$.trim(data[i].roomname)] = true;
    }
    for (var key in rooms){
      app.roomNames.push(key);
    }
    app.roomNames = app.roomNames.sort();
    for (i = 0; i < app.roomNames.length; i++){
      el.append('<option value="' + app.roomNames[i] + '">' + app.roomNames[i] + '</option>')
    }
    if (app.roomNames.indexOf(oldValue) >= 0){
      el.val(oldValue);
    } else {
      el.val('all');
    }
  }



};




(function($){
  $.fn.scrollFixed = function(params){
    params = $.extend( {appearAfterDiv: 0, hideBeforeDiv: 0}, params);
    var element = $(this);

    if(params.appearAfterDiv) {
      var distanceTop = element.offset().top + $(params.appearAfterDiv).outerHeight(true) + element.outerHeight(true);
    } else {
      var distanceTop = element.offset().top;
    }

    if(params.hideBeforeDiv) {
      var bottom = $(params.hideBeforeDiv).offset().top - element.outerHeight(true) - 10;
    } else {
      var bottom = 200000;
    }

    $(window).scroll(function(){
      if( $(window).scrollTop() > distanceTop && $(window).scrollTop() < bottom ) {
        element.css({'position':'fixed', 'top':'5px'});
      } else {
        element.css({'position':'static'});
      }
    });
  };
})(jQuery);





