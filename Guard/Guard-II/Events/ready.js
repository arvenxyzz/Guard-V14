const { ActivityType } = require('discord.js');
const config = require('../../../DevCode.json');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`[GUARD-II] ${client.user.tag} olarak giriş yapıldı!`);

        const statusMap = {
            'online': 'online',
            'idle': 'idle',
            'dnd': 'dnd',
            'invisible': 'invisible'
        };

        client.user.setPresence({
            activities: [{ name: config.guardII.activity, type: ActivityType.Watching }],
            status: statusMap[config.guardII.status] || 'online'
        });

        const guild = client.guilds.cache.get(config.guildID);
        if (!guild) {
            console.log('[GUARD-II] Koruma altındaki sunucu bulunamadı!');
            return;
        }

        console.log(`[GUARD-II] ${guild.name} sunucusu koruma altında. (Emoji + Sticker + Sunucu)`);

        const voiceChannel = guild.channels.cache.get(config.guardII.voiceChannelID);
        if (voiceChannel) {
            try {
                const { joinVoiceChannel } = require('@discordjs/voice');
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                    selfDeaf: true,
                    selfMute: true
                });
                connection.on('error', (err) => {
                    console.log('[GUARD-II] Ses kanalı bağlantı hatası:', err.message);
                });
                console.log(`[GUARD-II] ${voiceChannel.name} ses kanalına bağlanıldı.`);
            } catch (err) {
                console.log('[GUARD-II] Ses kanalına bağlanılamadı:', err.message);
            }
        }
    }
};
