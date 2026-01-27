import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const messageUtil = findByProps("sendMessage", "editMessage");
const UserSettingsActionCreators = findByProps("FrecencyUserSettingsActionCreators");

function getMessage(ctx) {
    const frecencyStore = UserSettingsActionCreators?.FrecencyUserSettingsActionCreators?.getCurrentValue?.();
    
    if (!frecencyStore?.favoriteGifs?.gifs) {
        return "❌ You don't have any favorite GIFs! Add some by favoriting GIFs in Discord first.";
    }

    const gifsArray = Object.keys(frecencyStore.favoriteGifs.gifs);
    
    if (gifsArray.length === 0) {
        return "❌ You don't have any favorite GIFs! Add some by favoriting GIFs in Discord first.";
    }

    const chosenGifUrl = gifsArray[Math.floor(Math.random() * gifsArray.length)];
    let ownerPing = "";

    // Check if we're in a guild and should ping the owner
    if (ctx?.channel?.guild_id) {
        // Try to get guild info
        const GuildStore = findByProps("getGuild");
        const guild = GuildStore?.getGuild?.(ctx.channel.guild_id);
        
        // Get the ping setting from storage, default to true
        const pingOwnerEnabled = storage.pingOwner ?? true;
        
        if (guild?.ownerId && pingOwnerEnabled && Math.random() <= 0.1) {
            ownerPing = ` <@${guild.ownerId}>`;
        }
    }

    return `${chosenGifUrl}${ownerPing}`;
}

let unregisterCommand;

export default {
    onLoad: () => {
        // Initialize the setting if it doesn't exist
        if (storage.pingOwner === undefined) {
            storage.pingOwner = true;
        }

        unregisterCommand = registerCommand({
            name: "gifroulette",
            displayName: "GIF Roulette",
            description: "Sends a random GIF from your favorites (1 in 10 chance to ping server owner!)",
            options: [],
            execute: async (args, ctx) => {
                const content = getMessage(ctx);
                
                messageUtil.sendMessage(ctx.channel.id, { 
                    content: content
                });
            },
            applicationId: "-1",
            inputType: 1,
            type: 1,
        });
    },
    
    onUnload: () => {
        if (unregisterCommand) {
            unregisterCommand();
        }
    }
};
