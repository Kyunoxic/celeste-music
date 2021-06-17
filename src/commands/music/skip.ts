import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';
import {MusicEmbeds} from "../../components/musicEmbed";

module.exports = class SkipCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'skip',
            aliases: ['next'],
            group: 'music',
            memberName: 'skip',
            description: 'Skips the current playing song, or multiple if provided.',
            details: 'Skips the current playing song, or multiple if provided.\nCannot be more than 10 at a time.',
            examples: ['skip', 'skip 3'],
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
            throttling: {
                usages: 3,
                duration: 20
            },
            args: [{
                key: 'amount',
                label: 'Amount to skip',
                prompt: 'How many videos do you want to skip?',
                error: 'Invalid number, please provide a nummber between 1 and 10.',
                type: 'integer',
                max: 10,
                min: 1,
                default: 1
            }]
        });
    }

    async run(msg: CommandoMessage, args: {amount: number}) {
        if(!msg.member?.voice.channel) return msg.say(`You're not in a voice channel!`);
        if(msg.guild.me?.voice.channel && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.say(`You're not in the same voice channel as me!`);

        const player = msg.client.player;
        if(player == null) return await msg.reply('This should never happen. Contact the bot owner.');
        if(!player.getQueue(msg)) return msg.say('There is nothing playing.');

        if(msg.deletable) msg.delete();
        if(msg.author.id === player.nowPlaying(msg).requestedBy.id || msg.member.hasPermission(['ADMINISTRATOR', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'MANAGE_GUILD'])) {
            const embed = MusicEmbeds.createSkipEmbed(msg.author, player.nowPlaying(msg));
            await player.skip(msg);

            return msg.say(embed);
        } else {
            return msg.say(MusicEmbeds.noPermissionsEmbed().setDescription('You cannot skip this song!'));
        }
    }
};