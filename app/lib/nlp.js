var async   = require('async');
var fs      = require('fs');
var natural = require('natural');

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

	importCorpus: function(classifier) {
		var finder = require('findit')('corpus');
		var fs = require('fs');

		//This listens for files found
		finder.on('file', function (file) {

			// Read the contains of the files
			fs.readFile(file, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
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
			console.log('Training starting...');
			classifier.train();
			console.log('Training done.');

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