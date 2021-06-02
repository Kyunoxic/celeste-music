import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';
import {MusicEmbeds} from "../../components/musicEmbed";

module.exports = class StopCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'stop',
            aliases: ['exit'],
            group: 'music',
            memberName: 'stop',
            description: 'Stop playing and leave the voice channel.',
            examples: ['stop'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            throttling: {
                usages: 1,
                duration: 20
            }
        });
    }

    async run(msg: CommandoMessage, args: {url: string}) {
        if(!msg.member?.voice.channel) return msg.say(`You're not in a voice channel!`);
        if(msg.guild.me?.voice.channel && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.say(`You're not in the same voice channel as me!`);

        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        player.stop(msg);

        if(msg.deletable) msg.delete();
        return msg.say(MusicEmbeds.createStopEmbed(msg.author));
    }
};