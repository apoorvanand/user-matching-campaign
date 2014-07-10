var config         = require('../config/config');
var db_manager     = require('../lib/db_manager');
var qs = require('querystring');

module.exports = function(app) {

	app.post('/settings/search', function(req, res) {
		//request.body.query
		//request.body.start_date
		//request.body.end_date

		if (req.method == 'POST') {
			var body = '';
			req.on('data', function (data) {
				body += data;

				// Too much POST data, kill the connection
				if (body.length > 1e6) {
					req.connection.destroy();
				}
			});
			req.on('end', function () {
				var post = qs.parse(body);

				// Save the template
				if (post.query != undefined && post.start_date != undefined && post.end_date != undefined) {
					 db_manager.updateSettings(post, function(err) {
					 	if (err) {
					 		res.render('ajax', { request: 'template update failed, '+err.message });
					 	} else {
					 		res.render('ajax', { request: 'template update successful' });
					 	}
					 });
				} else {
					res.render('ajax', { request: 'settings update failed.' });
				}
			});
		} else {
			res.render('ajax', { request: 'no post' });
		}
	});

	app.post('/settings/template', function(req, res) {

		if (req.method == 'POST') {
			var body = '';
			req.on('data', function (data) {
				body += data;

				// Too much POST data, kill the connection
				if (body.length > 1e6) {
					req.connection.destroy();
				}
			});
			req.on('end', function () {
				var post = qs.parse(body);

				// Save the template
				if (post.template != undefined) {
					db_manager.updateTemplate(post.template, function(err) {
						if (err) {
							res.render('ajax', { request: 'template update failed, '+err.message });
						} else {
							res.render('ajax', { request: 'template update successful' });
						}
					});
				} else {
					res.render('ajax', { request: 'template update failed, undefined' });
				}
			});
		} else {
			res.render('ajax', { request: 'no post' });
		}
	});
};