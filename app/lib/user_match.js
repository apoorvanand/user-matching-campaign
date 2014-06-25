var db_manager = require('./db_manager');

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
						console.log("match: "+user_list[j]+' '+user_list[j+1]);
						matches.push([user_list[i],user_list[i+1]]);
					// Otherwise, this user is an orphan
					} else {
						console.log("orphan: "+user_list[j]);
						orphans.push(user_list[j]);
					}
				}
			}

			// Insert matches into the database
			db_manager.insertMatches(matches);

			// TODO: how to handle orphans?
			console.log(orphans);
		}

	}
}