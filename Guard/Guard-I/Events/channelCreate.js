const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'channelCreate',
    async execute(channel, client) {
        if (!channel.guild) return;
        if (!isProtectedGuild(channel.guild.id)) return;
        if (!await isShieldEnabled(channel.guild.id, 'channelShield')) return;

        const fetchedLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 10 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-I | Kanal Oluşturma',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Kanal Oluşturma',
                target: `${channel.name} (${channel.id})`,
                targetID: channel.id,
                logType: 'channel',
                isOwner: true
            });
            return;
        }

        const member = await channel.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(channel.guild.id, member, 'channel');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-I | Kanal Oluşturma',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Kanal Oluşturma',
                    target: `${channel.name} (${channel.id})`,
                    targetID: channel.id,
                    logType: 'channel',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Kanal Oluşturma';
        const banned = await banUser(channel.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-I | Kanal Oluşturma',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Kanal Oluşturma',
            target: `${channel.name} (${channel.id})`,
            targetID: channel.id,
            logType: 'channel',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });

        try { await channel.delete(); } catch (e) {}
    }
};
