import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';
import {MusicEmbeds} from "../../components/musicEmbed";

module.exports = class QueueCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'queue',
            aliases: ['list'],
            group: 'music',
            memberName: 'queue',
            description: 'Shows the currently queued songs',
            examples: ['queue'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            throttling: {
                usages: 1,
                duration: 60
            },
            args: [{
                key: 'start',
                label: 'Page Number',
                prompt: 'What page of the queue list do you want to see?',
                error: 'Invalid number, it must be 1 or higher.',
                type: 'integer',
                min: 1,
                default: 1
            }]
        });
    }

    async run(msg: CommandoMessage, args: {start: number}) {
        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        if(!player.getQueue(msg)) return msg.say('There is nothing playing.');

        // if(msg.deletable) msg.delete();
        const embed = MusicEmbeds.createQueueListEmbed(player.getQueue(msg), (5*(args.start - 1)));
        msg.say(embed);

        return null;
    }
};