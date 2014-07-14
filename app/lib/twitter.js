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
				console.log(err.message.error);
				db_manager.log(err.message);

				// Check for rate limit error
				if (err.statusCode == 429) {
					console.log(('Retry in 1 min: getTimeline ('+user_id+')').warn);
					setTimeout(function() { this_.getTimeline(user_id, callback, count) }, 60000);
					return;
				}
			}

			// Callback with data
			callback(user_id, data);
		});
	},

	// TODO: make this recursive or do it outside the function
	usersLookup: function(lookup_array, cursor, callback) {
		var this_ = this;

		if (config.verbose) { console.log(('Looking up users ('+cursor+')...').info) };


		// TODO Loop this over multiple calls
		T.get('users/lookup', { user_id: lookup_array.join(','), include_entities: false }, function(err, data, response) {

			// Check for error
			if (err) {
				db_manager.log(err);

				// Check for rate limit error
				if (err.statusCode == 429) {
					console.log(('Retry in 1 min: users/lookup').warn);
					setTimeout(function() { this_.usersLookup(lookup_array, cursor, callback) }, 60000);
				}
			}

			var screennames_array = new Array();
			for (var i = 0; i < data.length; i++) {
				screennames_array.push({ user_id: data[i].id_str, screenname: data[i].screen_name});
			}

			callback(++cursor, screennames_array);
		});
	},

	postTweet: function(tweet, callback) {
		var this_ = this;
		var rate_limit = config.rate_limits.statuses_update || 6000;
		var timeout    = (900000/rate_limit)+1;

		T.post('statuses/update', { status: tweet }, function(err, data, response) {

			// Check for error
			if (err) {
				console.log(err.error);
				db_manager.log(err.message);

				// Check for rate limit error
				if (err.statusCode == 429) {
					console.log(('Retry in 1 min: statuses/update ('+tweet+')').warn);
					setTimeout(function() { this_.postTweet(tweet, callback) }, 60000);
				}

				// Check for duplicate attempt
				if (err.statusCode == 187) {
					console.log('Duplicate tweet. Not sending.'.warn);
				}
				return;
			}

			// Make callback after rate limit protection delay
			setTimeout(function(){ callback(data) }, timeout);
		});
	}
};