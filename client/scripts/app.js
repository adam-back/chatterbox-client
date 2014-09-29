// YOUR CODE HERE:
var app = {

	server: 'https://api.parse.com/1/classes/chatterbox',
	
	init: function() {

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
			}
		});
	},

}
