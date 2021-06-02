import {Argument, ArgumentType, CommandoClient, CommandoMessage} from 'discord.js-commando';
import urlParser from 'js-video-url-parser';

export class YoutubeUrlArgumentType extends ArgumentType {
    constructor(client: CommandoClient) {
        super(client, 'youtube-url');
    }

    validate(value: string, msg: CommandoMessage, arg: Argument): boolean {
        const parsedValue = urlParser.parse(value);
        return Boolean(parsedValue) && parsedValue?.provider === 'youtube';
    }

    parse(value: string): string {
        return value;
    }
}

module.exports = YoutubeUrlArgumentType;