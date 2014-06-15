var express = require('express');
var natural = require('natural');
var Twit    = require('twit');
var config  = require('./config');

var app = express();
var classifier = new natural.BayesClassifier();

app.get('/', function(req, res){
	res.send('index');

	if (classifier.docs.length == 0) {
		console.log('training');
		importCorpus();
		return;
	}

	classifier.train();

	// Move this to custom Twitter library, twitter.js
	var T = new Twit({
		consumer_key:         config.twitter.consumer_key,
		consumer_secret:      config.twitter.consumer_secret,
		access_token:         config.twitter.access_token,
		access_token_secret:  config.twitter.access_token_secret
	});

	T.get('statuses/user_timeline', { user_id: '987121', count: 10, trim_user: true }, function(err, data, response) {
		for (i = 0; i < data.length; ++i) {
	  		console.log(classifier.classify(data[i].text)+': '+data[i].text);
	  	}
	});
});

// Move to NLP specfic library
var importCorpus = function(){
	var finder = require('findit')('keywords');
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

	// Train the classifier once we have the documents
	finder.on('end', function () {
		classifier.train();
	});
};

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});