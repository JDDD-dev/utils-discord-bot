import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('josepesao')
        .setDescription('JOSE COÑO PESAO')
        .setDMPermission(false),
    async execute(interaction: CommandInteraction) {
        const resource = createAudioResource('audio/videoplayback.mp3')
        const player = createAudioPlayer()
        if (interaction.member instanceof GuildMember){
            if (interaction.member.voice.channel && interaction.guildId) {
                const channelId = interaction.member.voice.channel.id
                const connection = joinVoiceChannel({
                    channelId: channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.member.voice.guild.voiceAdapterCreator,
                })
                player.play(resource)
                const subscription = connection.subscribe(player)

                if (subscription){
                    setTimeout(() => {
                        subscription.unsubscribe()
                        player.stop()
                        connection.destroy()
                    }, 25_000)
                }
                await interaction.reply(
                    {
                        content: 'JOSE COÑO PESAO',
                    })
            }else{
                await interaction.reply(
                    {
                        content: 'The message was send outside of a Voice Channel  😭'
                    }
                )
            }
        }
    }
}