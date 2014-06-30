var bad_words = require('../config/profanity');

module.exports = {

	/*
	 * Returns false if there is profanity
	 */
	validScreenname: function(screenname) {
		var test_string = screenname
		// insert a space between lower and upper
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		// space before last upper in a sequence followed by lower
		.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
		// change underscores to delimiting spaces
		.replace(/_/g, ' ')
		// lowercase the string
		.toLowerCase()
		// trim the string
		.trim();

		// Create an array of terms to test based on the manipulation above
		var test_array = test_string.split(' ');
		for (var i = 0; i < test_array.length; i++) {
			// if a bad word is found, immediately return false
			if (bad_words.list.indexOf(test_array[i]) > -1) {
				return false;
			}
		}
		return true;
	},

	/*
	 * Returns false if there is profanity
	 */
	validTweet: function(tweet) {
		var test_string = tweet
		// insert a space between lower and upper
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		// space before last upper in a sequence followed by lower
		.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
		// change non-alphanumeric characters to delimiting spaces
		.replace(/[^A-Za-z0-9]+/g, ' ')
		// lowercase the string
		.toLowerCase()
		// trim the string
		.trim();

		// Create an array of terms to test based on the manipulation above
		var test_array = test_string.split(' ');
		for (var i = 0; i < test_array.length; i++) {
			// if a bad word is found, immediately return false
			if (bad_words.list.indexOf(test_array[i]) > -1) {
				return false;
			}
		}
		return true;
	}
}