  // YOUR CODE HERE:
var app = {
  init: function(){
    //handlers
    app.fetch();

    $('.fetch').on('click', function() {
      app.fetch();
    });



    app.svg = d3.select('#canvas').append('svg')
      .attr('height', $(window).height() * 0.75)
      .attr('width', 500)
      .attr('id', 'chats');

    $('#chats').on('click', '.add', function(e) {
      e.preventDefault();
      app.addFriend($(this).parent().find('.username').text());
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
    $.ajax({
      url: this.server,
      type: 'GET',
      data: 'where={"updatedAt":{"$gte":{"__type":"Date","iso":"' + app.lastHour() +'"}}}&order=-createdAt',
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

    if(message.hasOwnProperty('text') && message.hasOwnProperty('roomname') && message.hasOwnProperty('username')) {
      var cleaned = {};
      // start with dirty text, e.g., message.text
      cleaned.text = $('<span></span>').text(message.text).html();
      cleaned.roomname = $('<span></span>').text(message.roomname).html();
      cleaned.username = $('<span></span>').text(message.username).html();
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
      }
    }
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
      .attr('transform', function(d,i){return 'translate(0,' + (102 * (i + 1)) + ')';})
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
    .text(function(d){return "Room Name: " + d['roomname'] })
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

  friends: [],

  addFriend: function(username) {
    app.friends.push(username);
    return app.friends;
  },

  hasFriend: function(target) {
    return app.friends.indexOf(target) > -1 ? true : false;
  },

  removeFriend: function(username) {
    app.friends.splice(app.friends.indexOf(username), 1);
    return app.friends;
  }
};
