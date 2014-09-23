// YOUR CODE HERE:
var app = {
  init: function(){
    //handlers

    $('.fetch').on('click', function() {
      app.fetch();
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
        message.room = 'lobby';

      app.send(message);
      setTimeout(function(){app.fetch()}, 1000);
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
    messages.enter()
      .append('g').attr('class', 'message')
      .append('text');
    messages
      .attr('transform', function(d,i){return 'translate(0,' + (20 * (i + 1)) + ')';})
      .select('text').text(function(d){return JSON.stringify(d);});
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
  }





};
