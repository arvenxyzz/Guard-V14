const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('../../DevCode.json');
const { connect } = require('../Shared/Database');
const { loadEvents } = require('./EventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildEmojisAndStickers
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ]
});

async function start() {
    await connect();
    loadEvents(client);
    await client.login(config.guardII.token);
}

start().catch(err => {
    console.error('[GUARD-II] Başlatma hatası:', err);
    process.exit(1);
});
