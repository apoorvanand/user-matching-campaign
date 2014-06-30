var config         = require('../config/config');
var gnip           = require('../lib/gnip');
var TwitterWrapper = require('../lib/twitter');
var nlp            = require('../lib/nlp');
var db_manager     = require('../lib/db_manager');
var user_match     = require('../lib/user_match');

var profanity = require('../lib/validator');

module.exports = function(app) {

	app.get('/', function(req, res){
		res.render('index');
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

	//
	app.get('/send', function(req, res) {
		
		// Get all valid users for existance check
		db_manager.getAllValidUsers(lookup);

		function lookup(err, rows) {

			// Separate the user IDs into arrays of 100 to make a minimal amount of users/lookup calls
			var lookup_array = new Array();
			for (var i = 0; i < rows.length; i++) {
				if (i % 100 == 0) {
					lookup_array.push(new Array());
				}
				lookup_array[lookup_array.length-1].push(rows[i].user_id);
			}

			TwitterWrapper.usersLookup(lookup_array, setScreennames);

			//console.log(lookup_array);
			
			// Check if all users exist and get their latest screennames

			// Add callback and mark any users as invalid if they no longer exist
			// Continue with user dataset to start sending

			//TwitterWrapper.sendMatch(user1, user2, template);
		}

		function setScreennames(screennames) {
			db_manager.updateUserScreennames(screennames, queueSend);

			function queueSend() {
				console.log('queue send'.info);
			}
		}
		
		res.render('ajax', { request: 'send' });
	});
};