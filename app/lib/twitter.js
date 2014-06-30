var Twit       = require('twit');
var config     = require('../config/config');
var db_manager = require('./db_manager');

var T = new Twit({
	consumer_key:         config.twitter.consumer_key,
	consumer_secret:      config.twitter.consumer_secret,
	access_token:         config.twitter.access_token,
	access_token_secret:  config.twitter.access_token_secret
});

module.exports = {

	getTimeline: function(user_id, callback, count) {
		var this_ = this;
		var count = count || 100;

		if (config.verbose) { console.log('Getting timeline for '+user_id) };
		T.get('statuses/user_timeline', { user_id: user_id, count: count, trim_user: true, exclude_replies: true }, function(err, data, response) {

			// Check for error
			if (err) {
				db_manager.log(err);
			}

			// Check for rate limiting
			if (response.headers.status == '429 Too Many Requests') {
				if (config.verbose) { console.log(('Rate limit retry in 1 min: getTimeline ('+user_id+')').warn) };
				setTimeout(this_.classifyUser(user_id, classifier, count), 60000);
				return;
			}

			// Callback with data
			callback(user_id, data);
		});
	},

	// TODO: make this recursive or do it outside the function
	usersLookup: function(lookup_array, callback, cursor) {
		var this_ = this;

		if (config.verbose) { console.log('Looking up users.'.info) };

		cursor = cursor || 0;
		if (cursor == 0) {
			category_matches = new Array();
		}

		if (cursor < lookup_array.length) {

		}

		T.get('users/lookup', { user_id: lookup_array[0].join(','), include_entities: false }, function(err, data, response) {

			// Check for error
			if (err) {
				db_manager.log(err);
			}

			var screennames_array = new Array();
			for (var i = 0; i < data.length; i++) {
				console.log(data[i].id_str+" "+data[i].screen_name);
				screennames_array.push({ user_id: data[i].id_str, screenname: data[i].screen_name});
			}

			callback(screennames_array);
		});
	},

	deletedAccounts: function(users) {
		//provide a list of deleted accounts
	},

	// TODO
	sendMatch: function(user_id1, user_id2, template) {

		var tweet = template.replace('{{user1}}', screenname1).replace('{{user2}}', screenname2);
		T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
		  console.log(data);
		});
	}
};