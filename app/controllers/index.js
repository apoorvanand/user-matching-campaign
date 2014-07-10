var config         = require('../config/config');
var gnip           = require('../lib/gnip');
var TwitterWrapper = require('../lib/twitter');
var nlp            = require('../lib/nlp');
var db_manager     = require('../lib/db_manager');
var user_match     = require('../lib/user_match');
var tweetDelivery  = require('../lib/tweet_delivery');

var profanity = require('../lib/validator');

module.exports = function(app) {

	app.get('/', function(req, res){

		// Get public settings to show on page
		db_manager.getSettings(render);

		function render(err, row) {
			res.render('index', { settings: row });
		}
	});

	app.get('/search', function(req, res){

		// Get settings to show on page
		db_manager.getSettings(search);

		// Get all tweets via the Gnip search API
		function search(err, row) {
			if (err) {
				db_manager.log(err);
				return;
			}
			gnip.search(row.search, row.start_date, row.end_date);
		}

		res.render('ajax', { request: 'search' });
	});

	app.get('/export', function(req, res) {
		// Get date for filename
		var d = new Date();

		// Set CSV headers
		res.header('content-type','text/csv'); 
		res.header('content-disposition', 'attachment; filename=Tweets - '+d.toString()+'.csv');

		// Get tweets
		db_manager.getAllTweets(function(err, rows) {
			var body = '';

			for (var i = 0; i < rows.length; i++) {
				// Always quote tweet and display name
				rows[i].tweet_body   = '"'+rows[i].tweet_body.replace(/"/g, '""')+'"';
				rows[i].display_name = '"'+rows[i].display_name.replace(/"/g, '""')+'"';

				// Add to the response
				body += rows[i].id+','+rows[i].tweet_id+','+rows[i].tweet_body+','+rows[i].user_id+','+rows[i].display_name+','+rows[i].screenname+','+rows[i].valid_user+','+rows[i].valid_tweet+"\n";
			};
			res.send(body);
		});
	});

	// TODO: Change to POST
	app.get('/classify', function(req, res) {

		// Get all valid users that do not have classification defined
		db_manager.getAllUncategorizedValidUsers(classify);

		function classify(err, rows) {
			if (err) {
				db_manager.log(err);
				return;
			}
			console.log('Begin classifying users...'.info);
			nlp.classifyUsers(app, rows);
		}

		res.render('ajax', { request: 'classify' });
	});

	// TODO: Change to POST
	app.get('/match', function(req, res) {
		user_match.matchUsers();
		res.render('ajax', { request: 'match' });
	});

	// Send the tweets
	app.get('/send', function(req, res) {
		console.log('Get all valid users to send tweets...'.info);
		
		// Get all valid users for existance check
		db_manager.getAllValidUsers(checkUsers);

		function checkUsers(err, rows) {
			console.log('Lookup users to confirm existance...'.info);

			// Separate the user IDs into arrays of 100 to make a minimal amount of users/lookup calls
			var lookup_array = new Array();
			for (var i = 0; i < rows.length; i++) {
				if (i % 100 == 0) {
					lookup_array.push(new Array());
				}
				lookup_array[lookup_array.length-1].push(rows[i].user_id);
			}

			var screennames = new Array();
			function lookup(cursor, data) {
				cursor = cursor || 0;

				if (data) {
					screennames.push.apply(screennames, data);
				}

				if (cursor < 0 /*lookup_array.length */) {
					TwitterWrapper.usersLookup(lookup_array[cursor], cursor, lookup);
				} else {
					setScreennames(screennames);
				}
			}

			lookup();
		}

		function setScreennames(screennames) {
			console.log('Set latest screennames...'.info);
			db_manager.updateUserScreennames(screennames, getSettings);
		}

		function getSettings() {
			console.log('Get tweet template...'.info);

			// Get tweet template
			db_manager.getSettings(getMatches);
		}

		function getMatches(err, settings) {
		
			// GET matches not sent where usernames are both not null
			db_manager.getMatchesToSend(startSending);

			function startSending(err, matches) {
		    console.log('Start sending tweets...'.info);
				tweetDelivery.sendTweets(matches, settings.tweet);
			}
		}

		res.render('ajax', { request: 'send' });
	});
};