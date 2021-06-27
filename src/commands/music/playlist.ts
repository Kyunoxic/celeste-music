import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';
import {MusicEmbeds} from "../../components/musicEmbed";
import {Track} from "discord-player";
import ytpl from "ytpl";
import {MessageEmbed, User} from "discord.js";

module.exports = class PlaylistCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'playlist',
            group: 'music',
            memberName: 'playlist',
            description: 'Queue up a YouTube Playlist to play.',
            examples: ['playlist https://www.youtube.com/playlist?list=PLK2o01EsuMU-q68P7AoRocM_3GcpCPRjD', 'playlist https://www.youtube.com/watch?v=NKzq05Cp1qQ&list=PLK2o01EsuMU-q68P7AoRocM_3GcpCPRjD&index=2'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],
            throttling: {
                usages: 3,
                duration: 20
            },
            args: [{
                key: 'url',
                label: 'Playlist URL',
                prompt: 'What is the URL of the playlist you want to play?',
                error: 'Unrecognized URL, please try again.',
                type: 'yt-playlist-url'
            }, {
                key: 'limit',
                label: 'Limit',
                prompt: 'How many videos should be played from the playlist?',
                error: 'Invalid number, please try again.',
                type: 'integer',
                max: 40,
                min: 1,
                default: 10
            }]
        });
    }

    async run(msg: CommandoMessage, args: {url: string, limit: number}) {
        if(!msg.member?.voice.channel) return msg.say(`You're not in a voice channel!`);
        if(!msg.member?.voice.channel.joinable) return msg.say(`I can't join that voice channel!`);
        if(msg.guild.me?.voice.channel && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.say(`You're not in the same voice channel as me!`);

        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');

        const response = await msg.say(new MessageEmbed()
            .setColor('green')
            .setTimestamp(Date.now())
            .setTitle(`Incoming transmission!`)
            .setDescription('Loading playlist data...'));

        const playlist = await ytpl(args.url, {
            gl: 'UK',
            limit: args.limit
        });

        for (const item of playlist.items) {
            await player.play(msg, item.title, true);
        }

        if(msg.deletable) msg.delete();
        const embed = this.getEmbedForPlay(playlist, msg.author, player.getQueue(msg).tracks);
        await response.edit(embed);

        return null;
    }

    getEmbedForPlay(playlist: ytpl.Result, requestUser: User, queue: Track[]) {
        if(queue.length == playlist.items.length) return MusicEmbeds.createListPlayEmbed(playlist, requestUser);
        return MusicEmbeds.createListQueueEmbed(playlist, requestUser);
    }
};