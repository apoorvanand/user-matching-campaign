module.exports = {

	// Use console logs
	verbose: true, 
	
	// User 'dev' or 'prod'; only uses live data in 'prod'
	mode: 'dev',
	
	// By default, system does not send tweets; just simulates it
	send_tweets: false,

	// Credentials to log into local server
	basic_auth: {
		user:     'admin',
		password: 'password'
	},

	// Credentials to query tweets from Gnip
	// Go to http://gnip.com/ to get an account
	gnip: {
		user: '',
		pass: '',
		account: '',
		service_username: ''
	},

	// Credentials to interact with Twitter 
	twitter: {
		consumer_key:         '',
		consumer_secret:      '',
		access_token:         '',
		access_token_secret:  ''
	},

	// Any rate limits that the application should consider
	rate_limits: {
		statuses_update: 15
	}

	// Default form values, helpful in development
	// Managed with a database once the app is created
	defaults: {
		search:         '',
		tweet_template: '',
		tweet_direct_template: ''
	}
};