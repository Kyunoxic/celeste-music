import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';

module.exports = class ResumeCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'resume',
            group: 'music',
            memberName: 'resume',
            description: 'Resume the current song',
            examples: ['resume'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            throttling: {
                usages: 4,
                duration: 30
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
        player.resume(msg);
        msg.say('Resumed the song!');
        return null;
    }
};