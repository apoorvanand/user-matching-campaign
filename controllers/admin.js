/*
app.get('/admin', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});

app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user === 'john' && post.password === 'johnspassword') {
    req.session.user_id = johns_user_id_here;
    res.redirect('/admin');
  } else {
    res.send('Bad user/pass');
  }
});

app.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});      

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}
*/