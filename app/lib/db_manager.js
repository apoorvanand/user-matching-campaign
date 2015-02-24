var sqlite     = require("sqlite3");
var config     = require('../config/config');
var validator  = require('./validator');

// Define database names
var databases = {
	main: 'database.db'
};

module.exports = {

	setupDatabase: function() {

		var db = new sqlite.Database(databases.main);

		db.serialize(function() {

			// Create tables if they do not exist
			module.exports.createTable(db, 'tweets', "CREATE TABLE tweets (id INTEGER PRIMARY KEY NOT NULL, tweet_id VARCHAR(30) UNIQUE NOT NULL, tweet_body VARCHAR(200), user_id VARCHAR(30) NOT NULL, display_name VARCHAR(20), screenname VARCHAR(15) NOT NULL, valid_user TINYINT NOT NULL, valid_tweet TINYINT NOT NULL)");
			module.exports.createTable(db, 'valid_users', "CREATE TABLE valid_users (id INTEGER PRIMARY KEY NOT NULL, user_id VARCHAR(30) UNIQUE NOT NULL, screenname VARCHAR(15), top_category VARCHAR(100), categories TEXT, sent_tweet TINYINT NOT NULL DEFAULT 0)");
			module.exports.createTable(db, 'rejected_users', "CREATE TABLE rejected_users (id INTEGER PRIMARY KEY NOT NULL, user_id VARCHAR(30) UNIQUE NOT NULL, screenname VARCHAR(15))");
			module.exports.createTable(db, 'categories', "CREATE TABLE categories (id INTEGER PRIMARY KEY NOT NULL, category VARCHAR(255) NOT NULL, top_users TEXT)");
			module.exports.createTable(db, 'matches', "CREATE TABLE matches (id INTEGER PRIMARY KEY NOT NULL, user_id1 VARCHAR(30) NOT NULL, user_name1 VARCHAR(15), user_id2 VARCHAR(30) NOT NULL, user_name2 VARCHAR(15), category VARCHAR(255) NOT NULL, sent_match TINYINT NOT NULL DEFAULT 0)");
			module.exports.createTable(db, 'error_log', "CREATE TABLE error_log (id INTEGER PRIMARY KEY NOT NULL, error TEXT, timestamp NOT NULL)");

			// Create settings table and set up default values
			module.exports.createTable(db, 'settings', "CREATE TABLE settings (search VARCHAR(200), start_date CHAR(12), end_date CHAR(12), tweet VARCHAR(140), tweet_direct VARCHAR(140))", function() {
				// Calculate default times from yesterday to today
				var now = new Date();
				var yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1)
				today_str = now.getFullYear()+('0' + (now.getMonth()+1)).slice(-2)+('0' + now.getDate()).slice(-2)+'0000';
				yesterday_str = yesterday.getFullYear()+('0' + (yesterday.getMonth()+1)).slice(-2)+('0' + yesterday.getDate()).slice(-2)+'0000';

				// Insert default dates and default tweet templated from config file
				var stmt = db.prepare("INSERT INTO settings VALUES (?,?,?,?,?)");
				stmt.run([config.defaults.search,yesterday_str,today_str,config.defaults.tweet_template,config.defaults.tweet_direct_template]);
				stmt.finalize();
			});
		});
	},

	createTable: function(db, table_name, query, callback) {
		db.get("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='"+table_name+"'", function(err, row) {
			if (row.count == 0) {
				db.run(query, callback);
			}
		});
	},

	getSettings: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.get("SELECT * FROM settings", callback);
		db.close();
	},

	// Might be useful to page through tweets instead of gettings all depending on the data size
	getAllTweets: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.all("SELECT * FROM tweets", callback);
		db.close();
	},
	
	flushAllTweets: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.all("DELETE FROM tweets", callback);
		db.close();
	},

	getAllValidUsers: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.all("SELECT * FROM valid_users", callback);
		db.close();
	},

	getAllUncategorizedValidUsers: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.all("SELECT * FROM valid_users WHERE top_category = '' OR top_category IS NULL", callback);
		db.close();
	},

	getAllCategories: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.all("SELECT * FROM categories", callback);
		db.close();
	},

	getAllMatches: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.all("SELECT * FROM matches", callback);
		db.close();
	},

	getMatchesToSend: function(callback) {
		var db = new sqlite.Database(databases.main);
		db.all("SELECT * FROM matches WHERE user_id1 IS NOT NULL AND user_id2 IS NOT NULL AND user_id2 != 0 AND sent_match = 0", callback);
		db.close();
	},

	insertTweets: function(results) {

		var db = new sqlite.Database(databases.main);
		var tweet_smnt  = db.prepare("INSERT OR IGNORE INTO tweets (tweet_id, tweet_body, user_id, display_name, screenname, valid_user, valid_tweet) VALUES (?,?,?,?,?,?,?)");
		var user_smnt   = db.prepare("INSERT OR IGNORE INTO valid_users (user_id, screenname) VALUES (?,?)");
		var reject_smnt = db.prepare("INSERT OR IGNORE INTO rejected_users (user_id, screenname) VALUES (?,?)");

		for (var i = 0; results && i < results.length; i++) {
			console.log(results[i].actor.id.replace('id:twitter.com:','') + ' | ' + results[i].actor.displayName + ' | ' + results[i].actor.preferredUsername);
			var valid_user  = validator.validScreenname(results[i].actor.preferredUsername);
			var valid_tweet = validator.validTweet(results[i].body);
			var user_id     = results[i].actor.id.replace('id:twitter.com:','');

			tweet_smnt.run(
				results[i].id.substr(results[i].id.lastIndexOf(':')+1),
				results[i].body,
				user_id,
				results[i].actor.displayName,
				results[i].actor.preferredUsername,
				valid_user,
				valid_tweet
			);

			// remove
			if (!valid_tweet) {
				console.log(('REJECTED TWEET: '+results[i].body).warn);
			}

			if (valid_user) {
				user_smnt.run(user_id, results[i].actor.preferredUsername);
			} else {

				reject_smnt.run(user_id, results[i].actor.preferredUsername);
			}
		}

		tweet_smnt.finalize(function() {
			user_smnt.finalize(function() {
				reject_smnt.finalize(function() {
					db.close();
				});
			});
		});
	},

	insertCategoryLists: function(top_categories) {
		var db    = new sqlite.Database(databases.main);
		var smnt  = db.prepare("INSERT INTO categories (category, top_users) VALUES (?,?)");

		for (index in top_categories) {
			smnt.run(index, top_categories[index]);
		}

		smnt.finalize(function() {
			db.close();	
		});
	},

	insertMatches: function(matches) {
		var db    = new sqlite.Database(databases.main);
		var smnt  = db.prepare("INSERT INTO matches (user_id1, user_id2, category) VALUES (?,?,?)");

		for (var i = 0; i < matches.length; i++) {
			smnt.run(matches[i][0],matches[i][1],matches[i][2]);
		}

		smnt.finalize(function() {
			db.close();	
		});
	},

	updateUserCategories: function(user_id, top_category, weights) {
		var db = new sqlite.Database(databases.main);
		db.run("UPDATE valid_users SET top_category = ?, categories = ? WHERE user_id = ?", [top_category, weights, user_id], function(err) {
			if (err) {
				console.log(err.error);
				module.exports.log(err);
			}
			db.close();
		});
	},

	updateUserScreennames: function(screennames, callback) {
		var db    = new sqlite.Database(databases.main);
		var smnt1 = db.prepare("UPDATE valid_users SET screenname = ? WHERE user_id = ?");

		for (var i = 0; i < screennames.length; i++) {
			smnt1.run(screennames[i].screenname, screennames[i].user_id);
		}

		smnt1.finalize(function() {
			db.close();
			callback();
		});
	},

	updateMatchUserScreennames: function(screennames, callback) {
		var db    = new sqlite.Database(databases.main);
		var smnt1 = db.prepare("UPDATE matches SET user_name1 = ? WHERE user_id1 = ?");

		for (var i = 0; i < screennames.length; i++) {
			smnt1.run(screennames[i].screenname, screennames[i].user_id);
		}

		smnt1.finalize(function() {

			var smnt2 = db.prepare("UPDATE matches SET user_name2 = ? WHERE user_id2 = ?");

			for (var i = 0; i < screennames.length; i++) {
				smnt2.run(screennames[i].screenname, screennames[i].user_id);
			}

			smnt2.finalize(function() {
				db.close();
				callback();
			});
		});
	},

	updateDirectTemplate: function(template, callback) {
		var db = new sqlite.Database(databases.main);
		db.run("UPDATE settings SET tweet_direct = ?", [template], callback);
		db.close();
	},

	updateMatchTemplate: function(template, callback) {
		var db = new sqlite.Database(databases.main);
		db.run("UPDATE settings SET tweet = ?", [template], callback);
		db.close();
	},

	updateSettings: function(post, callback) {
		var db = new sqlite.Database(databases.main);
		db.run("UPDATE settings SET search = ?, start_date = ?, end_date = ?", [post.query, post.start_date, post.end_date], callback);
		db.close();
	},

	markSent: function(match_id, callback) {
		var db = new sqlite.Database(databases.main);
		db.run("UPDATE matches SET sent_match = 1 WHERE id = ?", [match_id], function(err) {
			if (err) {
				console.log(err.error);
				module.exports.log(err);
			}
			db.close();
			callback();
		});
	},

	log: function(error) {
		var db = new sqlite.Database(databases.main);
		var now = new Date();
		var stmt = db.prepare("INSERT INTO error_log (error,timestamp) VALUES (?,?)");
		stmt.run([error,now.toISOString()]);
		stmt.finalize();
		db.close();
	}
}