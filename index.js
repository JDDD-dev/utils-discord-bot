require('dotenv').config();
const { Client, Intents, Constants, GuildMember } = require('discord.js');
const { createAudioResource, createAudioPlayer, VoiceConnection, joinVoiceChannel } = require('@discordjs/voice')

const client = new Client(
    {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
})

client.on('ready', () => {
    console.log("The Bot is Ready")
    const guildId = process.env.GUILD
    const guild = client.guilds.cache.get(guildId)

    let commands

    if (guild){
        commands = guild.commands
    }else{
        commands = client.application?.commands
    }

    commands?.create({
        name: 'josepesao',
        description: 'Jose coño Pesao',
    })

    commands?.create({
        name: 'about',
        description: 'Just Another About Text',
    })

    commands?.create({
        name: 'raffle',
        description: 'Make a Raffle between the people that reacts to the bot message',
        options: [
            {
                name: 'winners',
                description: 'Number of Winners',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.NUMBER
            },
        ]
    })
})



client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'josepesao'){
        const resource = createAudioResource('videoplayback.mp3')
        console.log('ose')
        const player = createAudioPlayer()
        if (interaction.member instanceof GuildMember){
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
        }
    }else if(interaction.commandName === 'about'){
        await interaction.reply('A simple Discord Bot made by https://github.com/iJDxX with Love <3')
    }else if(interaction.commandName === 'raffle'){
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
                if (participants.size < options.getNumber('winners')){
                    await interaction.reply(
                        {
                            content: 'You selected more winners than people in your Voice Channel',
                        }
                    )
                }else{
                    let winners = []
                    let auxArray = []
                    participants.forEach((i) => {
                        auxArray.push(i.id)
                    })
                    for (let k = 0; k < options.getNumber('winners'); k++){
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
})

client.login(process.env.TOKEN)

