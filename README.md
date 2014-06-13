node-user-match
===============

A timed response app for hashtag campaigns.  This version is specifically for matching users by interests.

How it works
------------
1. GNIP Historical Powertrack is used to retrieve all tweets that used a hashtag in a certain timeframe.
2. Tweets are processed.  The code run on this dataset is the piece that changes from project to project.
3. @mentions are sent to participants.

Install dependencies

    npm install
  
Run the app

    node app.js
