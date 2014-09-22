// YOUR CODE HERE:
var app = {
  init: function(){
    //handlers
    $('.fetch').on('click', function() {
      app.fetch();
    });
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
      success: function(d){
        for(var i = 0; i < 20; i++) {
          app.clean(d.results[i]);
        }
      },
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

      console.log('dirty', message);
      console.log('clean', cleaned);

      return cleaned;
    } else {
      return null;
    }
  }

};
