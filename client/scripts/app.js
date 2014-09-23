  // YOUR CODE HERE:
var app = {
  init: function(){
    //handlers

    $('.fetch').on('click', function() {
      app.fetch();
    });

    $('text').on('click', '.username', function(e) {
      e.preventDefault();

    });

    app.svg = d3.select('#canvas').append('svg')
      .attr('height', $(window).height() * 0.75)
      .attr('width', 500)
      .attr('id', 'chats');

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

    var messages = app.svg.selectAll('.message').data(data, function(d) { return d.objectId;});
    var enteringMessages = messages.enter()
      .append('g').attr('class', 'message')
    enteringMessages
      .append('text').attr('class', 'text');
    enteringMessages
      .append('text').attr('class', 'username');
    enteringMessages
      .append('text').attr('class', 'roomname');

    messages
      .attr('transform', function(d,i){return 'translate(0,' + (70 * (i + 1)) + ')';})
      .select('.text').text(function(d){return "'" + d['text'] + "'"}).attr('transform', 'translate(100, 20)');
      messages.select('.username').text(function(d){return d['username']}).attr('font-weight', '800');
      messages.select('.roomname').text(function(d){return "Room Name: " + d['roomname'] }).attr('transform', function(d,i){return 'translate(0,40)';}).attr('fill', 'grey').attr('size', '8');

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
