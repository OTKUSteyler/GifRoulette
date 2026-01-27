import { definePluginSettings } from "@lib/api/settings";
import { definePlugin, OptionType } from "@lib/plugins";
import { findByProps } from "@metro";
import { ApplicationCommandInputType, ApplicationCommandType } from "@lib/api/commands/types";

const UserSettingsActionCreators = findByProps("FrecencyUserSettingsActionCreators");

function getMessage(ctx: any) {
    const frecencyStore = UserSettingsActionCreators?.FrecencyUserSettingsActionCreators?.getCurrentValue?.();
    
    if (!frecencyStore?.favoriteGifs?.gifs) {
        return "You don't have any favorite GIFs! Add some by favoriting GIFs in Discord first.";
    }

    const gifsArray = Object.keys(frecencyStore.favoriteGifs.gifs);
    
    if (gifsArray.length === 0) {
        return "You don't have any favorite GIFs! Add some by favoriting GIFs in Discord first.";
    }

    const chosenGifUrl = gifsArray[Math.floor(Math.random() * gifsArray.length)];
    let ownerPing = "";

    // Check if we're in a guild and should ping the owner
    if (ctx?.channel?.guild_id) {
        const guild = ctx.guild;
        if (guild?.ownerId && settings.pingOwnerChance && Math.random() <= 0.1) {
            ownerPing = ` <@${guild.ownerId}>`;
        }
    }

    return `${chosenGifUrl}${ownerPing}`;
}

const settings = definePluginSettings({
    pingOwnerChance: {
        type: OptionType.BOOLEAN,
        label: "Ping Server Owner",
        description: "If there should be a 1 in 10 chance to ping the owner of the server (oh no)",
        default: true
    }
});

export default definePlugin({
    name: "GifRoulette",
    description: "Adds a /gifroulette slash command to send a random GIF from your favorites, with a one in ten chance to ping the server owner",
    authors: [
        {
            name: "Samwich",
            id: 0n // Original Equicord author
        }
    ],
    settings,
    commands: [
        {
            name: "gifroulette",
            displayName: "gifroulette",
            description: "Tempt fate and send a random GIF from your favorites",
            displayDescription: "Tempt fate and send a random GIF from your favorites",
            type: ApplicationCommandType.CHAT,
            inputType: ApplicationCommandInputType.BUILT_IN,
            options: [],
            execute: async (args: any[], ctx: any) => {
                const content = getMessage(ctx);
                
                return {
                    content: content
                };
            }
        }
    ]
});
