var config         = require('../config/config');
var db_manager     = require('./db_manager');
var TwitterWrapper = require('./twitter');

module.exports = {

	sendTweets: function(matches, template, cursor) {
		var this_ = this;
		cursor = cursor || 0;

    // Non-productiom mode; use test data
    if (config.mode != 'prod'){
      matches = new Array();
      matches.push({ 
        id: 1525,
        user_id1: '987121',
        user_name1: 'jbulava',
        user_id2: '54256387',
        user_name2: 'rchoi',
        category: '',
        sent_match: 0 
      });
    }

		if (cursor < matches.length) {
			// Fill in the template
			var tweet = template.replace('{{user1}}', matches[cursor].user_name1).replace('{{user2}}', matches[cursor].user_name2);

			// Send the tweet
      if (config.send_tweets){
        TwitterWrapper.postTweet(tweet, confirmTweet);
      } else {
        console.log('MOCK: Suppressed tweet (Update config.sent_tweets to really send)'.info);
      }

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