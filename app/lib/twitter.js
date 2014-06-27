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
				if (config.verbose) { console.log('Rate limit retry in 1 min: getTimeline ('+user_id+')') };
				setTimeout(this_.classifyUser(user_id, classifier, count), 60000);
				return;
			}

			// Callback with data
			callback(user_id, data);
		});
	},
/*
	classifyUser: function(user_id, classifier, count) {
		count = count || 100;

		// Get the users tweets
		if (config.verbose) { console.log('Getting tweets for '+user_id) };
		T.get('statuses/user_timeline', { user_id: user_id, count: count, trim_user: true, exclude_replies: true }, function(err, data, response) {

			// Check for rate limiting
			if (response.headers.status == '429 Too Many Requests') {
				if (config.verbose) { console.log('Rate limit retry in 1 min: classifyUser ('+user_id+')') };
				setTimeout(this_.classifyUser(user_id, classifier, count), 60000);
				return;
			}

			if (err) {
				console.log(err);
				db_manager.log(err);
			}

			// Array of classifications and their weights
			var category_weights = {};

			for (i = 0; i < data.length; ++i) {

				// Classify the tweet
				classification = classifier.classify(data[i].text);

				// Create an array of interests
				if (!category_weights[classification]) {
					category_weights[classification] = 1;
				} else {
					category_weights[classification] += 1;
				}

				// Print out classification and tweet
				if (config.verbose) {
	  				//console.log('['+classification+'] '+data[i].text);
	  			}
	  		}

	  		// Find the highest engaging category
	  		if (category_weights != {}) {

	  			var top_category = '';
	  			var count = 0;
	  			for(var index in category_weights) {
	  				if (category_weights[index] > count) {
	  					top_category = index;
	  					count = category_weights[index];
	  				}
	  			}

	  			console.log('top category: '+top_category+'('+count+')');
	  		}

	  		// Add the category values to the database
	  		db_manager.updateUserCategories(user_id, top_category, JSON.stringify(category_weights));

	  		// return the top category so it can be added to a category index
	  		return top_category;
		});
	},
*/

	deletedAccounts: function(users) {
		//provide a list of deleted accounts
	},

	// TODO
	sendMatch: function(user_id1, user_id2, template) {

		var tweet = template.replace('{{user1}}', screenname1).replace('{{user2}}', screenname2);
		T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
		  console.log(data);
		})
	}
};