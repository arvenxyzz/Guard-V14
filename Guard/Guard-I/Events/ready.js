const { ActivityType } = require('discord.js');
const config = require('../../../DevCode.json');
const { createBackup } = require('../../Shared/Backup');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`[GUARD-I] ${client.user.tag} olarak giriş yapıldı!`);

        const statusMap = {
            'online': 'online',
            'idle': 'idle',
            'dnd': 'dnd',
            'invisible': 'invisible'
        };

        client.user.setPresence({
            activities: [{ name: config.guardI.activity, type: ActivityType.Watching }],
            status: statusMap[config.guardI.status] || 'online'
        });

        const guild = client.guilds.cache.get(config.guildID);
        if (!guild) {
            console.log('[GUARD-I] Koruma altındaki sunucu bulunamadı!');
            return;
        }

        console.log(`[GUARD-I] ${guild.name} sunucusu koruma altında. (Kanal + Rol)`);

        await createBackup(guild, true);
        console.log('[GUARD-I] İlk yedek alındı.');

        setInterval(async () => {
            await createBackup(guild, true);
            console.log('[GUARD-I] Otomatik yedek alındı.');
        }, 2 * 60 * 60 * 1000);

        const voiceChannel = guild.channels.cache.get(config.guardI.voiceChannelID);
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
                    console.log('[GUARD-I] Ses kanalı bağlantı hatası:', err.message);
                });
                console.log(`[GUARD-I] ${voiceChannel.name} ses kanalına bağlanıldı.`);
            } catch (err) {
                console.log('[GUARD-I] Ses kanalına bağlanılamadı:', err.message);
            }
        }
    }
};
