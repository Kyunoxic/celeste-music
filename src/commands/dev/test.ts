import {CommandoClient, Command, CommandoMessage} from 'discord.js-commando';

module.exports = class TestCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'test',
            aliases: ['tst'],
            group: 'dev',
            memberName: 'test',
            description: 'A generic command to test if the bot is responding.',
            examples: ['test'],
            ownerOnly: true,
            clientPermissions: ['SEND_MESSAGES']
        });
    }

    async run(msg: CommandoMessage) {
        return msg.reply(`I'm working fine! Ran this command in <#${msg.channel.id}>`);
    }
};