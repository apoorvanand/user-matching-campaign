module.exports = function(app) {
	
	var fs = require('fs');
	var gnip = require(__dirname + '/../lib/gnip');

	app.get('/admin', function(req, res) {
		res.render('admin', { title: 'The index page!' })
	});

	app.get('/search', function(req, res) {

		// run Gnip search

		res.send({
			"result": "hello world"
		});
	});

	app.get('/savetweet', function(req, res) {

		// save tweet to data store

		res.send({
			"result": "hello world"
		});
	});

	app.get('/classifier.json', function(req, res) {

		fs.readFile(__dirname + '/../../classifier.json', 'utf8', function (err, data) {
		  if (err) {
		    console.log('Error: ' + err);
		    return;
		  }
		 
		  res.send(JSON.parse(data));
		});
	});

}