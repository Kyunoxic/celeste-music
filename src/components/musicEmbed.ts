import {MessageEmbed, User} from "discord.js";
import {Player, Queue, Track} from "discord-player";
import {CommandoMessage} from "discord.js-commando";
import ytpl from "ytpl";
import {VideoUtilities} from "../entities/video";

export class MusicEmbeds {

    static createPlayEmbed(track: Track): MessageEmbed {
        return new MessageEmbed()
            .setColor('green')
            .setTimestamp(Date.now())
            .setTitle(`Now Playing: ${track.title}`)
            .setDescription(`Author: ${track.author}\nDuration: ${track.duration}`)
            .setFooter(`Requested by ${track.requestedBy.username}`, track.requestedBy.displayAvatarURL())
            .setThumbnail(track.thumbnail);
    }

    static createLiveEmbed(msg: CommandoMessage, player: Player): MessageEmbed {
        const track = player.nowPlaying(msg);
        return this.createPlayEmbed(track)
            .setTitle(track.title)
            .setDescription(`Author: ${track.author}`)
            .addField('Now Playing...', `${player.createProgressBar(msg, {
                timecodes: true,
                queue: true,
                length: 18
            })}`);
    }

    static createQueueEmbed(track: Track): MessageEmbed {
        return this.createPlayEmbed(track)
            .setTitle(`Added to the Queue: ${track.title}`);
    }

    static createListPlayEmbed(playlist: ytpl.Result, requestUser: User): MessageEmbed {
        let songList = '';
        let totalDuration = 0;

        //Never exceed 2048 bytes in description
        //Cap to 1536 here
        for (const item of playlist.items) {
            songList += `\n- ${item.title} by ${item.author.name}`;
            if(item.durationSec) totalDuration += item.durationSec;
            if((new TextEncoder().encode(songList)).length >= 1536) break;
        }

        const embed = new MessageEmbed()
            .setColor('green')
            .setTimestamp(Date.now())
            .setTitle(`Now Playing: ${playlist.title}`)
            .setDescription(`Author: ${playlist.author.name}\nDuration: ${VideoUtilities.convertToHumanReadbleTime(totalDuration)}\n\nSongs:${songList}`)
            .setFooter(`Requested by ${requestUser.username}`, requestUser.displayAvatarURL());

        if(playlist.bestThumbnail.url) embed.setThumbnail(playlist.bestThumbnail.url);
        return embed;
    }

    static createListQueueEmbed(playlist: ytpl.Result, requestUser: User): MessageEmbed {
        return this.createListPlayEmbed(playlist, requestUser)
            .setTitle(`Added to the Queue: ${playlist.title}`);
    }

    static createSkipEmbed(requestedBy: User, track: Track): MessageEmbed {
        return this.createPlayEmbed(track)
            .setTitle(`Skipped: ${track.title}`)
            .setDescription(`Queued by ${track.requestedBy.username}`)
            .setFooter(`Requested by ${requestedBy.username}`, requestedBy.displayAvatarURL())
    }

    static createMultiSkipEmbed(requestUser: User, skippedSongs: Track[]): MessageEmbed {
        const embed = new MessageEmbed()
            .setColor('green')
            .setTimestamp(Date.now())
            .setTitle(`Skipped ${skippedSongs.length} songs`)
            .setFooter(`Requested by ${requestUser.username}`, requestUser.displayAvatarURL());

        let description = '';
        skippedSongs.forEach(track => {
            description += `* ${track.title} (Requested by ${track.requestedBy.username})`
        });

        return embed;
    }

    static createStopEmbed(requestUser?: User): MessageEmbed {
        const embed = new MessageEmbed()
            .setColor('red')
            .setTimestamp(Date.now())
            .setTitle('Stopped playing')

        if(requestUser) {
            embed.setFooter(`Requested by ${requestUser.username}`, requestUser.displayAvatarURL());
        }

        return embed;
    }

    static createQueueListEmbed(queue: Queue, start: number): MessageEmbed {
        if(start >= queue.tracks.length) start = queue.tracks.length > 5 ? queue.tracks.length-5 : 0;
        let stop = start+5;
        if(stop > queue.tracks.length) stop = queue.tracks.length;

        const trackList = queue.tracks.map((track, i) => {
            return `**#${i + 1}** - ${track.title} by ${track.author}`
        }).slice(start, stop).join('\n')

        return new MessageEmbed()
            .setColor('green')
            .setTimestamp(Date.now())
            .setTitle(`Currently queued`)
            .setDescription(`${queue.loopMode ? '(Looping enabled)\n\n' : ''}`
                + `Current playing: ${queue.playing.title} by ${queue.playing.author}\n\n`
                + `${trackList}\n\n`
                + `${queue.tracks.length > 5 ? `And **${queue.tracks.length - 5}** other songs...` : ``}`)
    }

    static noPermissionsEmbed() : MessageEmbed {
        return new MessageEmbed()
            .setColor('red')
            .setTimestamp(Date.now())
            .setTitle(`Missing permissions!`)
    }
}