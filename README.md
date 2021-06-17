[![Downloads](https://img.shields.io/github/downloads/Kyunoxic/celeste-music/total.svg)](https://github.com/Kyunoxic/celeste-music/latest)
[![License](https://img.shields.io/github/license/Kyunoxic/celeste-music)](https://github.com/Kyunoxic/celeste-music/blob/master/LICENSE)

# celeste-music

A cross-platform simple bot to play music in Discord.

* Easy to run, install NPM & nodeJS, and run!
* No external APIs needed
* Clean command  channels
* Playlist support


## Configuration

After cloning the repository run `npm install`.\
Create a new file in the root folder named `.env`. See the snippet below for layout.
This file has been added to the .gitignore to prevent tokens being leaked.\
The `OWNER_SNOWFLAKE` allows the owner to bypass permission requirements.

```txt
BOT_SECRET=MYTOKEN
OWNER_SNOWFLAKE=MYDISCORDACCOUNTID
```


## Running and Building the project

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `npm run start`  | Run the bot.                           |
| `npm run build`  | Build the typescript code.             |