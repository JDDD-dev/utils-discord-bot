import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('raffle')
        .setDescription('Make a Raffle between the people in the same voice room')
        .setDMPermission(false)
        .addNumberOption(option =>
            option.setName('winners')
                .setDescription('Set the number of Winners')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const { options } = interaction
        if (interaction.member instanceof GuildMember){
            const channel = interaction.member.voice.channel
            if (channel == null){
                await interaction.reply(
                    {
                        content: 'The message was send outside of a Voice Channel  😭',
                    }
                )
            }else{
                let participants = channel.members
                if (participants.size < options.getNumber('winners', true)){
                    await interaction.reply(
                        {
                            content: 'You selected more winners than people in your Voice Channel',
                        }
                    )
                }else{
                    let winners = []
                    let auxArray: string[] = []
                    participants.forEach((i) => {
                        auxArray.push(i.id)
                    })
                    for (let k = 0; k < options.getNumber('winners', true); k++){
                        let rnd = Math.floor(Math.random()*auxArray.length)
                        winners.push(auxArray.at(rnd))
                        auxArray.splice(rnd,1)
                    }
                    let winnersString = ''
                    winners.forEach((i) => {
                        winnersString = winnersString + '<@' + i + '>,'
                    })
                    await interaction.reply(
                    {
                        content: 'The Raffle\'s winners are... ' + winnersString.slice(0, winnersString.length-1),
                        components: [],
                    })
                }
            }
        }
    }
}