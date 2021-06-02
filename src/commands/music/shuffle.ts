import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';

module.exports = class ShuffleCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'shuffle',
            group: 'music',
            memberName: 'shuffle',
            description: 'Shuffles the entire queue',
            examples: ['shuffle'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            throttling: {
                usages: 4,
                duration: 60
            }
        });
    }

    async run(msg: CommandoMessage) {
        if(!msg.member?.voice.channel) return msg.say(`You're not in a voice channel!`);
        if(msg.guild.me?.voice.channel && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.say(`You're not in the same voice channel as me!`);

        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        if(!player.getQueue(msg)) return msg.say('There is nothing playing.');

        // if(msg.deletable) msg.delete();
        player.shuffle(msg);
        msg.say('Shuffled the entire queue!');
        return null;
    }
};