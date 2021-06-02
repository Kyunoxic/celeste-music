import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';
import {MusicEmbeds} from "../../components/musicEmbed";

module.exports = class PlayCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'play',
            aliases: ['youtube', 'start', 'add'],
            group: 'music',
            memberName: 'play',
            description: 'Queue up a YouTube video to play.',
            examples: ['play https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'play https://www.youtube.com/watch?v=Ag1o3koTLWM'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS'],
            throttling: {
                usages: 3,
                duration: 20
            },
            args: [{
                key: 'url',
                label: 'Video URL',
                prompt: 'What is the URL of the video you want to play?',
                error: 'Unrecognized URL, please try again.',
                type: 'youtube-url'
            }]
        });
    }

    async run(msg: CommandoMessage, args: {url: string}) {
        if(!msg.member?.voice.channel) return msg.say(`You're not in a voice channel!`);
        if(!msg.member?.voice.channel.joinable) return msg.say(`I can't join that voice channel!`);
        if(msg.guild.me?.voice.channel && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.say(`You're not in the same voice channel as me!`);

        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        await player.play(msg, args.url, true);

        if(msg.deletable) msg.delete();
        if(player.getQueue(msg).tracks.length > 1) {
            msg.say(MusicEmbeds.createQueueEmbed(player.getQueue(msg).tracks[player.getQueue(msg).tracks.length - 1]));
        }

        return null;
    }
};