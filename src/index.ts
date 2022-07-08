import 'dotenv/config'
import { Client, Collection, Intents } from 'discord.js';
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'url'

const client = new Client(
    {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
    }
)

// @ts-ignore
client.commands = new Collection();

(async () => {
    const __filename = process.cwd().replace("index.js", "")
    

    const commandsPath = path.join(__filename, 'dist/commands')
    console.log(commandsPath)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        console.log(filePath)
        const command = await import(pathToFileURL(filePath).toString())

        // @ts-ignore
        client.commands.set(command.default.data.name, command)
    }
})()



client.once('ready', () => {
    console.log("The Bot is Ready")
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    // @ts-ignore
    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error){
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

client.login(process.env.TOKEN)

