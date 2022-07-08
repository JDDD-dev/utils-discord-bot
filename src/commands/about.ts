import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About me :)')
        .setDMPermission(false),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('A simple Discord Bot made by https://github.com/iJDxX with Love <3')
    }
}