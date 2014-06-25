node-user-match
===============

A timed response app for hashtag campaigns.  This version is specifically for matching users by interests.

How it works
------------
1. GNIP Historical Powertrack is used to retrieve all tweets that used a hashtag in a certain timeframe.
2. Tweets are processed.  The code run on this dataset is the piece that changes from project to project.
3. @mentions are sent to participants.

Install the Grunt CLI

	npm install -g grunt-cli

Install dependencies

    npm install
  
Run the app

    grunt

Todo
----
1. Send function for matches
2. How to handle ophans of categories
3. How to handle a final orphan
4. Make classify() a blocking function to avoid rate limiting
5. Pair down profanity list
6. Profanity check of username and tweet
7. Check that users exist before sending out tweets
8. More appropriate responses for routes
8. Change classify, match, and sending to POSTS after testing
9. Better way to import the corpus (i.e. don't use a timeout?)
