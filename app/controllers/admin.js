module.exports = function(app) {

	checkAuth = function(req, res, next) {
		if(typeof(req.session.user) === 'undefined') {
			req.session.user = { name: '', pass: '', loggedIn: false }
		}

		if (!req.session.user.loggedIn) {
			// req.session.user.loggedIn = true should be set in the 'login' route, in $R.user.validateLogin
			res.redirect('/login');
		} else {
			// if we already have a req.session.user and they are logged in, keep going
			next();
		}
	},

	app.get('/admin', checkAuth, function(req, res) {
		res.send('You are logged in!');
	}),

	app.post('/login', function (req, res) {
		var post = req.body;
		if (post.user === 'john' && post.password === 'johnspassword') {
			req.session.user_id = johns_user_id_here;
			res.redirect('/admin');
		} else {
			res.send('Bad user/pass');
		}
	}),

	app.get('/logout', function (req, res) {
		delete req.session.user_id;
		res.redirect('/login');
	})
}