# Convention Countdown Bot
This bot will count down the days every day with a picture for a convention.

# Language
The bot was coded in Node.js

# Where to find my bot?
The bot that I am running with the code base is here,

https://telegram.me/FurFestBot

# How to run?

If you want to run it for a different convention, or whatever else. Download the repository, and run
```
npm install
sudo apt install graphicsmagick
sudo apt install mongodb
```

Make a folder in the main directory with the short abbriviation of the con. Make a folder in there called pics, and countdown.

Download a font you want to use for the bot and put it in the same folder.

And finally copy convention.example.js into the folder and rename it to convention.js

Edit convention.js with all your custom options.

Run your bot behind a https nginx reverse proxy with a path of /bot(token). If you don't know what this is [read this](https://www.nginx.com/resources/admin-guide/reverse-proxy/)

ex: /bot123abc58347589

Finally add cron.js to the crontab to send the daily picture.

If you want to run this bot on windows then you need to add graphicsmagick to your path and install mongodb.

## Environment Variables

TYPE: "production" or "test"

* production: Runs the bot in normal mode.

* test: Runs the bot in testing mode, when in this mode pass an api key from another bot. And make sure you use a diffirent database for testing.

TOKEN: Telegram bot API key for normal bot.

CON: Name for the convention ex: "MFF". Make sure this matches the folder name exactly

HOST: IP for the mongodb database. (Default: localhost)

PORT: Port for the mongodb database. (Default: 27017)

DBNAME: Name for the mongodb database.

WEBHOOK: URL for the webhook to your server. ex: example.com


## Admin Commands:

/logs: Shows log file.

/users: Shows how many users are on the bot.

## Upload Script

--zip: The name of the zip file you want to upload. (Required)

--credit url for the credit. (Required)

--dbname Database Name (Required)

--host hostname for mongodb

--port port for mongodb

--con convention name


# Example Picture

![img](https://image.ibb.co/gUan7R/photo_2018_01_09_15_58_11.jpg)
