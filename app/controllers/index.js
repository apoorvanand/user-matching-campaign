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
		res.render('index');

/*
		var db = new sqlite.Database('mashable.db');
		db.all("SELECT * FROM valid_users WHERE top_category != '' AND top_category IS NOT NULL", printIt);
		db.close();

		function printIt(err, rows) {

			var categories = {};

			for (var i = rows.length - 1; i >= 0; i--) {
				console.log(rows[i].user_id+' '+rows[i].top_category);


					if (!categories[rows[i].top_category]) {
						categories[rows[i].top_category] = rows[i].user_id;
					} else {
						categories[rows[i].top_category] = categories[rows[i].top_category] + ',' + rows[i].user_id;
					}



			};

			console.log(categories);
		}
*/


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
			console.log('Start sending tweets...'.info);
			db_manager.getMatchesToSend(startSending);

			function startSending(err, matches) {
				tweetDelivery.sendTweets(matches, settings.tweet);
			}
		}

		res.render('ajax', { request: 'send' });
	});
};