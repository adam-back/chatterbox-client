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
      data: 'where={"updatedAt":{"$gte": "2014-09-22T00:00:00.000Z"}}',
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
      .attr('transform', function(d,i){return 'translate(0,' + (20 * (i + 1)) + ')';})
      .append('text').text(function(d){return JSON.stringify(d);});
  },

  clearMessages: function(){
    app.svg.selectAll('.message').data([]).exit().remove();
  },

  addMessage: function(input){
    app.send(input);
    app.update();
  }





};
