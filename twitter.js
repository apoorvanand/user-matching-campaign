var Twit = require('twit');

module.exports = function(app) {

	var T = new Twit({
		consumer_key:         config.twitter.consumer_key,
		consumer_secret:      config.twitter.consumer_secret,
		access_token:         config.twitter.access_token,
		access_token_secret:  config.twitter.access_token_secret
	});

	function getTimeline() {
		T.get('statuses/user_timeline', { user_id: '987121', count: 1 }, function(err, data, response) {
		  console.log(data);
		}
	};
};

