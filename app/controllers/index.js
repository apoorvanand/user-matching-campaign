var config  = require('../config/config');
var gnip    = require('../lib/gnip');
var TwitterWrapper = require('../lib/twitter');

module.exports = function(app) {
	app.get('/', function(req, res){
		res.send('index');

		TwitterWrapper.classifyUser('987121', app.get('classifier'), true, 10);

		gnip.monitorJobStatus();
	});
};