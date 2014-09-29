// YOUR CODE HERE:
var app = {
	init: function() {

	},

	send: function(data) {
		$.ajax({
			url: 'https://api.parse.com/1/classes/chatterbox',
			data: JSON.stringify(data),
			type: 'POST',
			success: function() {
				console.log('Posted successfully');
			}
		});
	}
}
