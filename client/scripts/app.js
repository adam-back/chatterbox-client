// YOUR CODE HERE:
var app = {
  init: function(){},
  send: function(data){
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(d){ consol.el},
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
        // do stuff
        console.log},
      error: function(jqXHR, status, error) {
        console.log(error);
      }
    })
  },
  server: 'https://api.parse.com/1/classes/chatterbox'

};
