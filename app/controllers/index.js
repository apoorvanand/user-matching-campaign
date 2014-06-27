var config         = require('../config/config');
var gnip           = require('../lib/gnip');
var TwitterWrapper = require('../lib/twitter');
var nlp            = require('../lib/nlp');
var db_manager     = require('../lib/db_manager');
var user_match     = require('../lib/user_match');

module.exports = function(app) {
	app.get('/', function(req, res){

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

		res.render('index');
	});

	// TODO: Change to POST
	app.get('/classify', function(req, res) {

		// Get all valid users that do not have classification defined
		db_manager.getAllUncategorizedValidUsers(classify);

		function classify(err, rows) {
			console.log("row size:"+rows.length);
			if (err) {
				db_manager.log(err);
				return;
			}
			nlp.classifyUsers(app, rows);
		}

		res.render('index');
	});

	// TODO: Change to POST
	app.get('/match', function(req, res) {
		user_match.matchUsers();
		res.render('index');
	});

	//
	app.get('/send', function(req, res) {
		// Check if all users exist and get their latest screennames
		db_manager.getAllValidUsers(confirm);

		function confirm(err, rows) {
			

			// Add callback and mark any users as invalid if they no longer exist
			// Continue with user dataset to start sending

			TwitterWrapper.sendMatch(user1, user2, template);
		}
		
		res.render('index');
	});
};