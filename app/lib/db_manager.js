var sqlite     = require("sqlite3");
var config     = require('../config/config');
var validator  = require('./validator');

module.exports = {

	setupDatabase: function() {

		var db = new sqlite.Database('mashable.db');

		db.serialize(function() {

			// Create 'tweets' if table doesn't exist
			db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='tweets'", function(err, row) {
				if (row.count == 0) {
					db.run("CREATE TABLE tweets (id INTEGER PRIMARY KEY NOT NULL, tweet_id VARCHAR(30) NOT NULL, tweet_body VARCHAR(200), user_id VARCHAR(30) NOT NULL, display_name VARCHAR(20), screenname VARCHAR(15) NOT NULL, valid_user TINYINT NOT NULL, valid_tweet TINYINT NOT NULL)");
				}
			});

			// Create 'valid_users' if table doesn't exist
			db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='valid_users'", function(err, row) {
				if (row.count == 0) {
					db.run("CREATE TABLE valid_users (id INTEGER PRIMARY KEY NOT NULL, user_id VARCHAR(30) NOT NULL, top_category VARCHAR(100), categories TEXT)");
				}
			});

			// Create 'categories' if table doesn't exist
			db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='categories'", function(err, row) {
				if (row.count == 0) {
					db.run("CREATE TABLE categories (id INTEGER PRIMARY KEY NOT NULL, category VARCHAR(255) NOT NULL, top_users TEXT)");
				}
			});

			// Create 'matches' if table doesn't exist
			db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='matches'", function(err, row) {
				if (row.count == 0) {
					db.run("CREATE TABLE matches (id INTEGER PRIMARY KEY NOT NULL, user_id1 VARCHAR(30) NOT NULL, user_id2 VARCHAR(30) NOT NULL, sent_match TINYINT NOT NULL DEFAULT 0)");
				}
			});

			// Create 'error_log' if table doesn't exist
			db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='error_log'", function(err, row) {
				if (row.count == 0) {
					db.run("CREATE TABLE error_log (id INTEGER PRIMARY KEY NOT NULL, error TEXT, timestamp NOT NULL)");
				}
			});

			// Create 'settings' if table doesn't exist
			db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='settings'", function(err, row) {
				if (row.count == 0) {
					db.run("CREATE TABLE settings (search VARCHAR(200), start_date CHAR(12), end_date CHAR(12), tweet VARCHAR(140))", createSettings);

					// Insert a default settings row
					function createSettings() {

						// Calculate default times from yesterday to today
					    var now = new Date();
						var yesterday = new Date();
						yesterday.setDate(yesterday.getDate() - 1)
						today_str = now.getFullYear()+('0' + (now.getMonth()+1)).slice(-2)+('0' + now.getDate()).slice(-2)+'0000';
						yesterday_str = yesterday.getFullYear()+('0' + (yesterday.getMonth()+1)).slice(-2)+('0' + yesterday.getDate()).slice(-2)+'0000';

						// Insert default dates and default tweet templated from config file
						var stmt = db.prepare("INSERT INTO settings VALUES (?,?,?,?)");
						stmt.run([config.defaults.search,yesterday_str,today_str,config.defaults.tweet_template]);
						stmt.finalize();

						db.close();
					}
				} else {
					db.close();
				}
			});
		});
	},

	getSettings: function(callback) {
		var db = new sqlite.Database('mashable.db');
		db.get("SELECT * FROM settings", callback);
		db.close();
	},

	// Might be useful to page through tweets instead of gettings all depending on the data size
	getAllTweets: function(callback) {
		var db = new sqlite.Database('mashable.db');
		db.all("SELECT * FROM tweets", callback);
		db.close();
	},

	getAllValidUsers: function(callback) {
		var db = new sqlite.Database('mashable.db');
		db.all("SELECT * FROM valid_users", callback);
		db.close();
	},

	getAllCategories: function(callback) {
		var db = new sqlite.Database('mashable.db');
		db.all("SELECT * FROM categories", callback);
		db.close();
	},

	getAllMatches: function(callback) {
		var db = new sqlite.Database('mashable.db');
		db.all("SELECT * FROM matches", callback);
		db.close();
	},

	insertTweets: function(results) {

		var db = new sqlite.Database('mashable.db');
		var tweet_smnt = db.prepare("INSERT INTO tweets (tweet_id, tweet_body, user_id, display_name, screenname, valid_user, valid_tweet) VALUES (?,?,?,?,?,?,?)");
		var user_smnt  = db.prepare("INSERT INTO valid_users (user_id) VALUES (?)");

		for (var i = 0; i < results.length; i++) {
			console.log(results[i].actor.id.replace('id:twitter.com:','') + '|' + results[i].actor.displayName + '|' + results[i].actor.preferredUsername);
			var valid_user  = validator.validScreenname(results[i].actor.preferredUsername);
			var valid_tweet = validator.validTweet(results[i].body);
			var user_id     = results[i].actor.id.replace('id:twitter.com:','')

			tweet_smnt.run(
				results[i].id.substr(results[i].id.lastIndexOf(':')+1),
				results[i].body,
				user_id,
				results[i].actor.displayName,
				results[i].actor.preferredUsername,
				valid_user,
				valid_tweet
			);

			if (valid_user) {
				user_smnt.run(user_id);
			}
		}

		tweet_smnt.finalize(function() {
			user_smnt.finalize(function() {
				db.close();	
			});
		});
	},

	insertMatches: function(matches) {
		var db    = new sqlite.Database('mashable.db');
		var smnt  = db.prepare("INSERT INTO matches (user_id1, user_id2) VALUES (?,?)");

		for (var i = 0; i < matches.length; i++) {
			smnt.run(matches[i][0],matches[i][1]);
		}

		smnt.finalize(function() {
			db.close();	
		});
	},

	updateUserCategories: function(user_id, top_category, weights) {
		var db = new sqlite.Database('mashable.db');
		db.run("UPDATE valid_users SET top_category = ?, categories = ? WHERE user_id = ?", [top_category, weights, user_id], function(err) {
			if (err) {
				console.log(err);
				this.log(err);

			}
			db.close();
		});
	},

	log: function(error) {
		var db = new sqlite.Database('mashable.db');
		var now = new Date();
		var stmt = db.prepare("INSERT INTO error_log (error,timestamp) VALUES (?,?)");
		stmt.run([error,now.toISOString()]);
		stmt.finalize();
		db.close();
	}
}