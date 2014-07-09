module.exports = {

  // Use console logs
	verbose: true, 
	
	// by default, system does not send tweets; just simulates it
	send_tweets: false,

  // credentials to log into local server
	basic_auth: {
		user:     'admin',
		password: 'password'
	},

  // credentials to query tweets from gnip
  // go to http://gnip.com/ to get an account. 
	gnip: {
		user: '',
		pass: '',
		account: '',
		service_username: ''
	},

  // credentials to post to twitter 
  twitter: {
    consumer_key:         '',
    consumer_secret:      '',
    access_token:         '',
    access_token_secret:  ''
  },

	rate_limits: {
		statuses_update: 15
	}

	// Managed with SQLite once the app is created
	defaults: {
		search:         '',
		tweet_template: ''
	}

};