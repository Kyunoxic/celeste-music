import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';
import {MusicEmbeds} from "../../components/musicEmbed";

module.exports = class NowPlayingCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'nowplaying',
            aliases: ['np', 'playing'],
            group: 'music',
            memberName: 'nowplaying',
            description: 'Shows the currently playing song',
            examples: ['nowplaying', 'np'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            throttling: {
                usages: 2,
                duration: 60
            }
        });
    }

    async run(msg: CommandoMessage) {
        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        if(!player.getQueue(msg)) return msg.say('There is nothing playing.');

        if(msg.deletable) msg.delete();
        const embed = MusicEmbeds.createLiveEmbed(msg, player);
        return msg.say(embed);
    }
};