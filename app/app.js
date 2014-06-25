var express = require('express');
var fs      = require('fs');
var natural = require('natural');
var nlp     = require('./lib/nlp');
var config  = require('./config/config');
var db_manager = require('./lib/db_manager');

var app = express();

// Add basic authentication to access the application
app.use(express.basicAuth(config.basic_auth.user, config.basic_auth.password));
app.use(express.static(__dirname + '/public'));

// Load views
app.engine('ejs', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Load controllers
fs.readdirSync(__dirname+'/controllers/').forEach(function(name) {
	require(__dirname+'/controllers/' + name.replace('.js', ''))(app);
});

// Train or load classifier
var classifier = new natural.BayesClassifier();
app.set('classifier', classifier);
nlp.loadClassifier(app, classifier);

// Setup database
db_manager.setupDatabase();

// Start the server
var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});