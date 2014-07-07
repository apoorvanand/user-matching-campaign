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
2. Check that users exist before sending out tweets
3. More appropriate responses for routes
4. Better way to import the corpus (i.e. don't use a timeout?)
5. Check that all requires are necessary
6. Add action to clear out database tables after matches are sent
7. If possible, add a function that checks status of previous action to make sure the current action can run

Gnip Dates
----------
Start - 201406120400
To Friday - 201406270401
Thru Sunday - 201406300401

Mashable Publicity
------------------
http://mashable.com/2014/06/13/1connection-social-media-day/
http://mashable.com/2014/07/02/1connection-social-media-day-recap/