import 'dotenv/config'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'url'

const commands: string[] = [];
const __filename = process.cwd().replace("deploy-commands.js", "")
const commandsPath = path.join(__filename, 'dist/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

(async () => {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(pathToFileURL(filePath).toString());
        commands.push(command.default.data.toJSON());
    }

    if (process.env.TOKEN && process.env.CLIENTID && process.env.GUILD){
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
    
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILD), {body: commands})
    }else{
        console.log("error")
    }
})()
