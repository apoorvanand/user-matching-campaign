var db_manager = require('./db_manager');
var config     = require('../config/config');

module.exports = {

	matchUsers: function() {

		// Get categories in database
		db_manager.getAllCategories(match);

		function match(err, rows) {
			if (err) {
				console.log(err);
				db_manager.log(err);
				return;
			}

			var matches = new Array();
			var orphans = new Array();

			// For each category's user list
			for (var i = 0; i < rows.length; i++) {
				var user_list = rows[i].top_users.split(',');

				// For each user in the list
				for (var j = 0; j < user_list.length; j += 2) {
					// If we still have at least two left, we can match
					if (user_list[j+1]) {
						if (config.verbose) {
							console.log("match: "+user_list[j]+' '+user_list[j+1]);
						}
						matches.push([user_list[j], user_list[j+1], rows[i].category]);
					// Otherwise, this user is an orphan
					} else {
						if (config.verbose) {
							console.log("orphan: "+user_list[j]);
						}
						orphans.push(user_list[j]);
					}
				}
			}

			// Match the remaining orphans
			for (var i = 0; i < orphans.length; i += 2) {
				if (orphans[i+1]) {
					if (config.verbose) {
						console.log("orphan match: "+orphans[i]+' '+orphans[i+1]);
					}
					// Add orphan match with a blank category, test existance of category for messaging
					matches.push([orphans[i], orphans[i+1], '']);
				} else {
					if (config.verbose) {
						console.log("FINAL ORPHAN: "+orphans[i]);
					}
					// Add ID of 0 for the final orphan and use this value to find the identity of a final orphan.
					// Message orphan manually. DO NOT duplicate match with another participant.
					matches.push([orphans[i], 0, '']);
				}
			}

			// Insert matches into the database
			db_manager.insertMatches(matches);
		}
	}
}