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
5. Make classify() a blocking function to avoid rate limiting
6. Pair down profanity list
7. Profanity check of username and tweet
8. Check that users exist before sending out tweets
9. More appropriate responses for routes
10. Change classify, match, and sending to POSTS after testing
11. Better way to import the corpus (i.e. don't use a timeout?)
12. Check that all requires are necessary
13. Clear out database tables after matches are sent
