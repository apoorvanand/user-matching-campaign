var express = require('express');
var fs      = require('fs');
var natural = require('natural');
var nlp     = require('./lib/nlp');

var app = express();

// Load controllers
fs.readdirSync('./app/controllers/').forEach(function(name) {
	require('./controllers/' + name.replace('.js', ''))(app);
});

// Train or load classifier
var classifier = new natural.BayesClassifier();
app.set('classifier', classifier);
nlp.loadClassifier(app, classifier);

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});