// YOUR CODE HERE:
var app = {
  init: function(){},
  send: function(data){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(d){ consol.el},
      error: function(jqXHR, status, error) {
        console.log(error);
      }
    })
  },
  fetch: function(){}
};
