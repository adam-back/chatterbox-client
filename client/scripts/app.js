// YOUR CODE HERE:
var app = {

	server: 'https://api.parse.com/1/classes/chatterbox',

	init: function() {
		$(document).ready(function() {
	        $(".clear").click(function() {
	          app.clearMessages();
	        });
      
      	});

		$('.fetch').on('click', app.fetch());	
	},

	send: function(data) {
		$.ajax({
			url: 'https://api.parse.com/1/classes/chatterbox',
			data: JSON.stringify(data),
			type: 'POST',
			contentType: 'application/json',
			success: function() {
				console.log('Posted successfully');
			}
		});
	},

	fetch: function(data) {
		$.ajax({
			url: 'https://api.parse.com/1/classes/chatterbox',
			type: 'GET',
			contentType: 'application/json',
			data: data,
			success: function(data) {
				console.log('Fetched successfully:' + data);
				for(var i = 0; i < data.length; i++) {
					app.addMessage(data[i]);
				}
			},
			error: function(data) {
				console.log('Error on fetch!');
			}

		});
	},

	clearMessages: function() {
		console.log('cleared')
		//empty method clears all child nodes
		$('#chats').empty();
	},

	addMessage: function(message) {
		var user = $('<span></span>').text(message.username);
		var message = $('<span></span>').text(message.text);	
		var room = $('<span></span>').text(message.roomname);	
		$('#chats').append('<span>Username:' + user[0] +': ' + message[0] + ' ' + room[0] + '</span>');
	}

}
