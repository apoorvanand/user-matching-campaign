var express = require('express');
var fs      = require('fs');
var natural = require('natural');
var nlp     = require('./lib/nlp');

var app = express();

app.use(express.basicAuth('testUser', 'testPass'));
app.use(express.static(__dirname + '/public'));

app.engine('ejs', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



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