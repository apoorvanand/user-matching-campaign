var Twit = require('twit');
var config  = require('../config/config');

var T = new Twit({
	consumer_key:         config.twitter.consumer_key,
	consumer_secret:      config.twitter.consumer_secret,
	access_token:         config.twitter.access_token,
	access_token_secret:  config.twitter.access_token_secret
});

module.exports = {

	classifyUser: function(user_id, classifier, debug, count) {
		debug = debug || false;
		count = count || 10;

		// Get the users tweets
		if (debug) { console.log('Getting tweets for '+user_id) };
		T.get('statuses/user_timeline', { user_id: user_id, count: count, trim_user: true, exclude_replies: true }, function(err, data, response) {

			for (i = 0; i < data.length; ++i) {

				// Classify the tweet
				classification = classifier.classify(data[i].text);

				// Print out classification and tweet
				if (debug) {
	  				console.log('['+classification+'] '+data[i].text);
	  			}
	  		}
		});
	}
};