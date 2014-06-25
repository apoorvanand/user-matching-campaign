var config     = require('../config/config'); // Holds configuration data
var request    = require('request');          // Used for HTTP requests
var db_manager = require('./db_manager');

module.exports = {

	/*
	 * search        - A recursive search to the Gnip API
	 *   query       - The search string (#twitter)
	 *   from_date   - Starting date in the format YYYYMMDDHHMM (201401010001)
	 *   to_date     - Ending date in the format YYYYMMDDHHMM (201406170001)
	 *   max_results - The number of tweets per call (Max of 500)
	 *   next_id     - Used for subsequent calls, i.e. paging
	 * 
	*/
	search: function(query, from_date, to_date, max_results, next_id) {
		var this_ = this;

		var max_results = max_results || 500;
		var next_id     = next_id || 0;

		var url = 'https://search.gnip.com/accounts/' + config.gnip.account + '/search/prod.json';

		var query_string = {
			'publisher' : 'twitter',
			'query'     : query,
			'maxResults': max_results,
			'fromDate'  : from_date,
			'toDate'    : to_date
		};

		if (next_id != 0) {
			query_string.next = next_id;
		}  

		// Make the search HTTP request
		console.log('Making gnip search...');
		request.get(url, { 'qs': query_string }, function (error, response, body) {
			console.log('gnip search done.');

			// Log any error
			if (error) {
				db_manager.log(error);
			}

			// Parse the result and pass the tweets to the DB manager to save
			var result = JSON.parse(body);
			db_manager.insertTweets(result.results);

			// Search again if we have a next id
			if (result.next) {
				this_.search(query, from_date, to_date, max_results, result.next);
			}
		}).auth(config.gnip.user, config.gnip.pass, true);
	}
}