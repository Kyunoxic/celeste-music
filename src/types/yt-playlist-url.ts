import {Argument, ArgumentType, CommandoClient, CommandoMessage} from 'discord.js-commando';
import ytpl from "ytpl";

export class YoutubePlaylistUrlArgumentType extends ArgumentType {
    constructor(client: CommandoClient) {
        super(client, 'yt-playlist-url');
    }

    validate(value: string, msg: CommandoMessage, arg: Argument): boolean {
        return ytpl.validateID(value);
    }

    parse(value: string): string {
        return value;
    }
}

module.exports = YoutubePlaylistUrlArgumentType;