var config         = require('../config/config');
var gnip           = require('../lib/gnip');
var TwitterWrapper = require('../lib/twitter');
var db_manager     = require('../lib/db_manager');
var user_match     = require('../lib/user_match');

module.exports = function(app) {
	app.get('/', function(req, res){

		// Get settings to show on page
		db_manager.getSettings(search);

		// Get all tweets via the Gnip search API
		function search(err, row) {
			gnip.search(row.search, row.start_date, row.end_date);
		}

		res.render('index');
	});

	// TODO: Change to POST
	app.get('/classify', function(req, res) {

		// Get all valid users that do not have classification defined
		db_manager.getAllValidUsers(classify);

		function classify(err, rows) {

			// Array to keep track of where users belong
			var category_matches = new Array();

			// TODO: make this is blocking function to avoid rate limiting issues
			for (var i = 0; i < 1 /*rows.length*/; i++) {
				// Classify a user into a top category, also saving their weighted counts
				var top_category = TwitterWrapper.classifyUser(rows[i].user_id, app.get('classifier'), 20); // TODO: remove to get 100 by default
				console.log("cat:"+top_category);

				if (!category_matches[top_category]) {
					category_matches[top_category] = rows[i].user_id;
				} else {
					category_matches[top_category] += ','+rows[i].user_id;
				}
			}

			console.log(category_matches);

			// Add these lists to the database
			for (index in category_matches) {

			}
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