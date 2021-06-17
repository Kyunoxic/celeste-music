import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';

module.exports = class VolumeCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'volume',
            aliases: ['vl'],
            group: 'music',
            memberName: 'volume',
            description: 'Change the song volume',
            examples: ['volume 20'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            userPermissions: ['ADMINISTRATOR', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'MANAGE_GUILD'],
            throttling: {
                usages: 4,
                duration: 60
            },
            args: [{
                key: 'volume',
                label: 'Volume',
                prompt: 'What volume percentage do you want to set the bot to?',
                error: 'Invalid number, it must be between 1 and 100',
                type: 'integer',
                min: 1,
                max: 200,
                default: 30
            }]
        });
    }

    async run(msg: CommandoMessage, args: {volume: number}) {
        if(!msg.member?.voice.channel) return msg.say(`You're not in a voice channel!`);
        if(msg.guild.me?.voice.channel && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.say(`You're not in the same voice channel as me!`);

        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        if(!player.getQueue(msg)) return msg.say('There is nothing playing.');

        // if(msg.deletable) msg.delete();
        player.setVolume(msg, args.volume);
        msg.say(`${args.volume > 100 ? `**Warning! Volumes above 100% give major bass boosting artifacts. Use at your own risk.**\n` : ``}Set the volume to ${args.volume}%!`);
        return null;
    }
};