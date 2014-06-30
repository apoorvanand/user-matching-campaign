var async          = require('async');
var fs             = require('fs');
var natural        = require('natural');
var TwitterWrapper = require('./twitter');
var config         = require('../config/config')
var db_manager     = require('./db_manager');

module.exports = {

	loadClassifier: function(app, classifier) {
		if (classifier.docs.length == 0) {

			// Look for existing classifier on disk
			if (fs.existsSync('./classifier.json')) {
				console.log('Loading classifier from file');
				natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
				    app.set('classifier', classifier);
				});

			} else {
				this.importCorpus(classifier);
			}
		}
	},

	classifyUsers: function(app, rows, cursor) {
		var this_ = this;

		cursor = cursor || 0;
		if (cursor == 0) {
			category_matches = new Array();
		}
		
		if (cursor < rows.length) {
			TwitterWrapper.getTimeline(rows[cursor].user_id, classifyUser);
		} else {
			console.log('Done classifying users.'.info);

			if (config.verbose) {
				for (index in category_matches) {
					console.log(index+' ('+((category_matches[index].match(/,/g)||[]).length+1)+')');
				}
			}

			module.exports.saveCategoryUsers(category_matches);
		}

		function classifyUser(user_id, tweets) {
			var category_weights = {};

			for (i = 0; i < tweets.length; ++i) {

				// Classify the tweet
				classification = app.get('classifier').classify(tweets[i].text);

				// Add the classification to the frequency array
				if (!category_weights[classification]) {
					category_weights[classification] = 1;
				} else {
					category_weights[classification] += 1;
				}

				// Print out classification and tweet
				if (config.verbose) {
	  				//console.log('['+classification+'] '+tweets[i].text);
	  			}
	  		}

			// Find the highest engaging category as long as there were tweets
			if (tweets.length > 0) {

				var top_category = '';
				var count = 0;
				for(var index in category_weights) {
					if (category_weights[index] > count) {
						top_category = index;
						count = category_weights[index];
					}
				}

				if (config.verbose) {
					console.log('Top category for '+user_id+': '+top_category+'('+count+')');
				}

				// Add the category values to the database
	   			db_manager.updateUserCategories(user_id, top_category, JSON.stringify(category_weights));

	   			//console.log(category_weights);

	   			// Add user to category indexes
				if (!category_matches[top_category]) {
					category_matches[top_category] = user_id;
				} else {
					category_matches[top_category] += ','+user_id;
				}
			} else {
				if (config.verbose) {
					console.log((user_id+' had no tweets! May only have replies.').warn);
				}
			}

			// Continue classifying
			this_.classifyUsers(app, rows, ++cursor);
		}
	},

	saveCategoryUsers: function(top_categories) {
		db_manager.insertCategoryLists(top_categories);
	},

	importCorpus: function(classifier) {
		var finder = require('findit')('corpus');
		var fs = require('fs');

		//This listens for files found
		finder.on('file', function (file) {

			// Read the contains of the files
			fs.readFile(file, 'utf8', function (err,data) {
				if (err) {
					return console.log(err.error);
				}

				// Creat category index from file name
				last_slash     = file.lastIndexOf('/')+1;
				end_of_keyword = (file.lastIndexOf('.') > last_slash) ? file.lastIndexOf('.') : file.length-1;
				category       = file.slice(last_slash, end_of_keyword);

				// Add all documents to the classifier (except hidden files)
				if (category.length > 0 && category.charAt(0) != '.') {
					console.log("Adding document for "+category);
					classifier.addDocument(data, category);
				}
			});
		});

		// TODO: How can this be triggered after adding docs above?
		setTimeout(function() {
			console.log('Training starting...'.info);
			classifier.train();
			console.log('Training done.'.info);

			console.log('Saving classifier to file...');
			classifier.save('classifier.json', function(err, classifier) {
				if (err) {
					return console.log(err);
				}

				console.log('Classifier saved.');
			});

		}, 2000);
	}
};