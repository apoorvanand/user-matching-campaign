model.exports = function() {

	/*
	 * choice: 'accept' or 'reject' the job
	 */
	function acceptRejectHistoricalJob(choice) {

		put_data = '{"status":"'+choice+'"}';

/* CURL FROM PHP EXAMPLE
		$ch   = curl_init($url);
		curl_setopt_array($ch, array(
		  CURLOPT_URL => $url,
		  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
		  CURLOPT_USERPWD => $user.":".$pass,
		  CURLOPT_POST    => 1,
		//  CURLOPT_VERBOSE => true  // Uncomment for curl verbosity
		));

		curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-HTTP-Method-Override: PUT'));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $putData);

		$content = curl_exec( $ch );
		$err     = curl_errno( $ch );
		$errmsg  = curl_error( $ch );
		$header  = curl_getinfo( $ch );
		curl_close( $ch );

		$header['errno']   = $err;
		$header['errmsg']  = $errmsg;
		$header['content'] = $content;
		return $header;
*/

		console.log(content);
	}

	function createHistoricalJob() {

		url              = 'https://historical.gnip.com/accounts/'+config.account_name+'/jobs.json';
		publisher        = 'twitter';
		stream_type      = 'track';
		data_format      = 'activity-streams';
		from_date        = '201301010000'; // This time is inclusive -- meaning the minute specified will be included in the data returned
		to_date          = '201301010001'; // This time is exclusive -- meaning the data returned will not contain the minute specified, but will contain the minute immediately preceding it
		job_title        = "my historical job php";
		service_username = "your_twitter_handle"; // This is the Twitter username your company white listed with Gnip for access.
		rules            = "[{\"value\":\"rule 1\",\"tag\":\"ruleTag\"},{\"value\":\"rule 2\",\"tag\":\"ruleTag\"}]";

		job_string       = "{\"publisher\":\"$publisher\",\"streamType\":\"$streamType\",\"dataFormat\":\"$dataFormat\",\"fromDate\":\"$fromDate\",\"toDate\":\"$toDate\",\"title\":\"$jobTitle\",\"serviceUsername\":\"$serviceUsername\",\"rules\":$rules}";

/* CURL FROM PHP EXAMPLE
		$ch   = curl_init($url);
		curl_setopt_array($ch, array(
		  CURLOPT_URL => $url,
		  CURLOPT_ENCODING => "gzip",
		  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
		  CURLOPT_USERPWD => $user.":".$pass,
		  CURLOPT_POST    => 1,
		  CURLOPT_POSTFIELDS => $jobString,
		//  CURLOPT_VERBOSE => true  // Uncomment for curl verbosity
		));

	    $content = curl_exec( $ch );
	    $err     = curl_errno( $ch );
	    $errmsg  = curl_error( $ch );
	    $header  = curl_getinfo( $ch );
	    curl_close( $ch );

	    $header['errno']   = $err;
	    $header['errmsg']  = $errmsg;
	    $header['content'] = $content;
	    return $header;
*/
		console.log(content);
	}

	function monitorJobStatus() {

/* CURL FROM PHP EXAMPLE
		$ch   = curl_init($url);
		curl_setopt_array($ch, array(
		  CURLOPT_URL => $url,
		  CURLOPT_ENCODING => "gzip",
		  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
		  CURLOPT_USERPWD => $user.":".$pass,
		//  CURLOPT_VERBOSE => true

		));

	    $content = curl_exec( $ch );
	    $err     = curl_errno( $ch );
	    $errmsg  = curl_error( $ch );
	    $header  = curl_getinfo( $ch );
	    curl_close( $ch );

	    $header['errno']   = $err;
	    $header['errmsg']  = $errmsg;
	    $header['content'] = $content;
	    return $header;
*/
		console.log(content);
	}
}