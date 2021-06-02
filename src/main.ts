//Imports
import {Command, CommandGroup, CommandoGuild, CommandoMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {Player, Track} from "discord-player";
import {Database, open} from "sqlite";
import {config} from "dotenv";
import {oneLine} from "common-tags";
import path from "path";
import sqlite3 from "sqlite3";
import commando from 'discord.js-commando';
import {MusicEmbeds} from "./components/musicEmbed";

const env = config();
const client = new commando.Client({
    commandPrefix: '>',
    owner: process.env.OWNER_SNOWFLAKE,
    invite: 'https://discord.gg/BmaGac8'
});

if(client == null) {
    console.error('Client failed to initialize.');
    process.exit(1);
}

client?.on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client?.user?.username}#${client?.user?.discriminator} (${client?.user?.id})`);
        client.user?.setPresence({
            status: 'idle',
            activity: {
                type: 'LISTENING',
                name: 'to nature'
            }
        });
    })
    .on('disconnect', () => { console.warn('Disconnected!'); })
    .on('commandError', (cmd: Command, err: Error, msg: CommandoMessage, args: any, pattern: boolean) => {
        if(err instanceof commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    // eslint-disable-next-line
    // @ts-ignore
    .on('commandBlock', (msg: CommandoMessage, reason: string) => {
        console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
    })
    .on('commandPrefixChange', (guild: CommandoGuild, prefix: string) => {
        console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('commandStatusChange', (guild: CommandoGuild, command: Command, enabled: boolean) => {
        console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('groupStatusChange', (guild: CommandoGuild, group: CommandGroup, enabled: boolean) => {
        console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    });

client.player = new Player(client, {
    ytdlDownloadOptions: {
        quality: 'highestaudio'
    },
    leaveOnEnd: true,
    leaveOnEndCooldown: 30000,
    leaveOnStop: true,
    leaveOnEmpty: true,
    autoSelfDeaf: true
});

client.player
    .on('error', (err: string, msg: Message) => {
        console.error(oneLine`
                    Playback Error: ${err} // Trigger: ${msg.content}
                `);
    })
    .on('trackStart', (msg: CommandoMessage, track: Track) => {
        msg.say(MusicEmbeds.createPlayEmbed(track));
    });

client?.setProvider(
    open({
        filename: 'database.db',
        driver: sqlite3.Database
    }).then((db: Database)  => new commando.SQLiteProvider(db))
).catch(console.error);

client?.registry
    .registerGroups([
        ['admin', 'Administration Commands'],
        ['music', 'Music Commands'],
        ['dev', 'Developer Commands']
    ])
    .registerDefaults()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

client?.login(process.env.BOT_SECRET);

// Useful for automatic breakpoints on console logs
// var _log = console.log.bind(console);
//
// // es6
// console.log = (...args) => {
//     _log(...args);
//     debugger;
// }
