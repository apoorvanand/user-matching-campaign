node-mashable-usermatch
===============

A timed response app for hashtag campaigns.  This version is specifically for matching users by interests for Mashable.

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
1. Check that users exist before sending out tweets
2. Better way to import the corpus (i.e. don't use a timeout?)
3. Check that all requires are necessary
4. Add action to clear out database tables after matches are sent
5. If possible, add a function that checks status of previous action to make sure the current action can run

Gnip Dates
----------
Start - 201406120400<br />
To Friday - 201406270401<br />
Thru Sunday - 201406300401

Mashable Publicity
------------------
<http://mashable.com/2014/06/13/1connection-social-media-day/><br />
<http://mashable.com/2014/07/02/1connection-social-media-day-recap/>
