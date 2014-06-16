var config  = require('../config/config');
var http    = require('http');

module.exports = {

	acceptRejectHistoricalJob: function(choice) {

		var payload = '{"status":"'+choice+'"}';

		// May not need if "auth" works below and header doesn't need to be set
		//var auth = 'Basic ' + new Buffer(config.gnip.user + ':' + config.gnip.pass).toString('base64');

		var options = {
			'host'          : 'historical.gnip.com',
			'path'          : '',
			'auth'          : config.gnip.user+':'+config.gnip.pass,
			'method'        : 'PUT',
			'headers'       : {
				'content-type': 'application/json'
			}
		};

		callback = function(res) {
			console.log('STATUS: ' + res.statusCode);
		 	console.log('HEADERS: ' + JSON.stringify(res.headers));

			var str = '';

			//another chunk of data has been recieved, so append it to `str`
			res.on('data', function (chunk) {
				str += chunk;
			});

			//the whole response has been recieved, so we just print it out here
			res.on('end', function () {
				console.log("response: "+str);
			});
		}

		http.request(options, callback).end();
	},

	createHistoricalJob: function(title) {

		var url = 'https://historical.gnip.com/accounts/' + cofig.gnip.account + '/jobs.json';

		var stream_type = "track";
		var data_format = "activity-streams";
		var from_date = "201301010000"; // This time is inclusive
		var to_date = "201301010001"; // This time is exclusive
		var rules = '[{"value":"rule 1","tag":"ruleTag"},{"value":"rule 2","tag":"ruleTag"}]'
		var post_data = '{"publisher":"twitter","streamType":"' + stream_type + '","dataFormat":"' + data_format + '","fromDate":"' + from_date + '","toDate":"' + to_date + '","title":"' + title + '","serviceUsername":"' + config.gnip.service_username + '","rules":' + rules + '}'

		var options = {
			'host'          : 'https://historical.gnip.com',
			'path'          : '/accounts/'+config.gnip.account+'/jobs.json',
			'auth'          : config.gnip.user+':'+config.gnip.pass,
			'method'        : 'POST',
			'headers'       : {
				'Content-Type': 'application/x-www-form-urlencoded',
		  		'Content-Length': post_data.length
			}
		};

		// Set up the request
		var post_req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
			  console.log('Response: ' + chunk);
			});
		});

		// post the data
		post_req.write(post_data);
		post_req.end();
	},

	// https://historical.gnip.com/accounts/<account_name>/jobs.json
	monitorJobStatus: function() {

		var options = {
			'host'          : 'historical.gnip.com',
			'path'          : '/accounts/'+config.gnip.account+'/jobs.json',
			'auth'          : config.gnip.user+':'+config.gnip.pass,
			'headers'       : {
				'content-type': 'application/json'
			}
		};

		callback = function(res) {
			console.log('STATUS: ' + res.statusCode);
		 	console.log('HEADERS: ' + JSON.stringify(res.headers));

			var str = '';

			//another chunk of data has been recieved, so append it to `str`
			res.on('data', function (chunk) {
				str += chunk;
			});

			//the whole response has been recieved, so we just print it out here
			res.on('end', function () {
				console.log("response: "+str);
			});
		}

		http.request(options, callback).end();
	}
}