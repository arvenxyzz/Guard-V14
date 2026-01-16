const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('../../DevCode.json');
const { connect } = require('../Shared/Database');
const { loadEvents } = require('./EventHandler');
const { loadCommands } = require('./CommandHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ]
});

client.commands = new Collection();

async function start() {
    await connect();
    loadCommands(client);
    loadEvents(client);
    await client.login(config.guardI.token);
}

start().catch(err => {
    console.error('[GUARD-I] Başlatma hatası:', err);
    process.exit(1);
});
