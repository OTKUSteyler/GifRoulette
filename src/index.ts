/*
 * Kettu, a Discord mobile app client modification
 * Copyright (c) 2025 Kettu Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { definePlugin } from "@lib/plugins";
import { findByProps } from "@metro";
import { ApplicationCommandInputType, ApplicationCommandType } from "@lib/api/commands/types";
import { storage } from "@lib/api/storage";

const UserSettingsActionCreators = findByProps("FrecencyUserSettingsActionCreators");

function getMessage(ctx: any, pingOwnerEnabled: boolean) {
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
        if (guild?.ownerId && pingOwnerEnabled && Math.random() <= 0.1) {
            ownerPing = ` <@${guild.ownerId}>`;
        }
    }

    return `${chosenGifUrl}${ownerPing}`;
}

export default definePlugin({
    name: "GifRoulette",
    description: "Adds a /gifroulette slash command to send a random GIF from your favorites, with a one in ten chance to ping the server owner",
    authors: [
        {
            name: "Samwich",
            id: 0n // Original Equicord author
        }
    ],
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
                // Get the ping setting from storage, default to true
                const pingOwnerEnabled = storage.getBoolean("GifRoulette_pingOwner", true);
                const content = getMessage(ctx, pingOwnerEnabled);
                
                return {
                    content: content
                };
            }
        }
    ],
    onLoad() {
        // Initialize the setting if it doesn't exist
        if (storage.getBoolean("GifRoulette_pingOwner") === undefined) {
            storage.set("GifRoulette_pingOwner", true);
        }
    },
    onUnload() {
        // Cleanup if needed
    }
});
