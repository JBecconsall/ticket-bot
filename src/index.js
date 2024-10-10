const {
    Client,
    IntentsBitField,
    GatewayIntentBits,
    ActivityType,
    Partials
} = require('discord.js');
const CH = require('wokcommands');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        IntentsBitField.Flags.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.Guilds
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

module.exports = {client}
client.setMaxListeners(0);


client.on('ready', async() => { 

    new CH({
        client,
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'events'),
        testServers: ['1261811826329387080'],
        botOwners: ['818539885950009454'],
        disabledDefaultCommands: [
            CH.DefaultCommands.Prefix,
            CH.DefaultCommands.ChannelCommand,
            CH.DefaultCommands.RequiredPermissions,
            CH.DefaultCommands.CustomCommand,
            CH.DefaultCommands.ToggleCommand,
            CH.DefaultCommands.RequiredRoles,
        ]
    })

    const mongourl = process.env.MONGO_CONNECT;

    if(!mongourl) return;
    await mongoose.set('strictQuery', true)
    await mongoose.connect(mongourl, {dbName: 'BotTesting'}|| '')
    
    
    if(mongoose.connect) {
        console.log('[MONGO] Connected')
    } else {
        console.log('[MONGO] An error occured connecting to the database...')
    }

})

client.login(process.env.TOKEN)