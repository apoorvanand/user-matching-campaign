var db_manager     = require('./db_manager');
var TwitterWrapper = require('./twitter');

module.exports = {

	sendTweets: function(matches, template, cursor) {
		var this_ = this;
		cursor = cursor || 0;

		// Hardcoding for testing the sending of tweets
		// TODO: make this a switch/flag
		// matches = new Array();
		// matches.push({ id: 1525,
		// 	user_id1: '987121',
		// 	user_name1: 'jbulava',
		// 	user_id2: '158412624',
		// 	user_name2: 'nlgrenfell',
		// 	category: '',
		// 	sent_match: 0 });

		if (cursor < matches.length) {
			// Fill in the template
			var tweet = template.replace('{{user1}}', matches[cursor].user_name1).replace('{{user2}}', matches[cursor].user_name2);

			// Send the tweet
			TwitterWrapper.postTweet(tweet, confirmTweet);
			//confirmTweet();
			console.log('Tweet to send: '+tweet);
		} else {
			console.log('Done sending tweets.'.info);
		}

		function confirmTweet() {
			console.log('confirming tweet'.info);
			db_manager.markSent(matches[cursor].id, function(){
				// Continue sending
				this_.sendTweets(matches, template, ++cursor);
			});
		}
	}
}