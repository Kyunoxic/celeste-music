import {Player} from "discord-player";

declare module "discord.js" {
    interface Client {
        player: Player | null;
    }
}