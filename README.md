node-talkback
===============

A timed response app for hashtag campaigns. Originally designed for Mashable's #1Connection campaign.

Requirements
------------

This codebase has been tested with Node.js version v0.10.28

How it works
------------

1. The Gnip Search API is used to retrieve all tweets that use a hashtag in a certain timeframe.
2. Tweets are processed.  The user matching portion of this project is what may differ from project to project.
3. @mentions are sent to participants.

Installation
------------
If you do not have Node.js installed, you can download the download the latest from <http://nodejs.org/>
<br /><br />
Note: only preface these commands with 'sudo' if your Node.js was installed with root privileges.

Install the Grunt CLI

	npm install -g grunt-cli

Install dependencies

	npm install
  
Run the app

	grunt
  
Open the application in a browser: http://localhost:3000/

Todo
----
1. Check that users exist before sending out tweets
2. Better way to import the corpus (i.e. don't use a timeout?)
3. Check that all requires are necessary
4. Add action to clear out database tables after matches are sent
5. If possible, add a function that checks status of previous action to make sure the current action can run
6. Check for unfilled template variables before sending tweet

Gnip Dates
----------
Start - 201406120400<br />
To Friday - 201406270401<br />
Thru Sunday - 201406300401

Mashable Publicity
------------------
<http://mashable.com/2014/06/13/1connection-social-media-day/><br />
<http://mashable.com/2014/07/02/1connection-social-media-day-recap/>
