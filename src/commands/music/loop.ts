import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';

module.exports = class LoopCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'loop',
            aliases: ['lp', 'repeat'],
            group: 'music',
            memberName: 'loop',
            description: 'Loop the entire queue or a single song',
            examples: ['loop', 'loop song'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            throttling: {
                usages: 4,
                duration: 30
            },
            args: [{
                key: 'repeatSong',
                label: 'Loop single song',
                prompt: 'Do you want to loop a single song?',
                error: 'Invalid answer, can be `song` or nothing',
                type: 'string',
                default: '',
                oneOf: ['', 'song']
            }]
        });
    }

    async run(msg: CommandoMessage, args: {repeatSong: string}) {
        if(!msg.member?.voice.channel) return msg.say(`You're not in a voice channel!`);
        if(msg.guild.me?.voice.channel && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.say(`You're not in the same voice channel as me!`);

        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        if(!player.getQueue(msg)) return msg.say('There is nothing playing.');

        // if(msg.deletable) msg.delete();
        if(args.repeatSong === 'song') {
            if(player.getQueue(msg).repeatMode) {
                player.setRepeatMode(msg, false);
                msg.say('Repeating **disabled**!')
            } else {
                player.setRepeatMode(msg, true);
                msg.say('Repeating **enabled**, this one song will be repeated!')
            }
        } else {
            if(player.getQueue(msg).loopMode) {
                player.setLoopMode(msg, false);
                msg.say('Looping **disabled**!')
            } else {
                player.setLoopMode(msg, true);
                msg.say('Looping **enabled**, the whole queue will be repeated!')
            }
        }
        return null;
    }
};