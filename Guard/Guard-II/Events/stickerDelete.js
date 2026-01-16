const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'stickerDelete',
    async execute(sticker, client) {
        if (!isProtectedGuild(sticker.guild.id)) return;
        if (!await isShieldEnabled(sticker.guild.id, 'stickerShield')) return;

        const fetchedLogs = await sticker.guild.fetchAuditLogs({ limit: 1, type: 92 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-II | Sticker Silme',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Sticker Silme',
                target: `${sticker.name} (${sticker.id})`,
                targetID: sticker.id,
                logType: 'sticker',
                isOwner: true
            });
            return;
        }

        const member = await sticker.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(sticker.guild.id, member, 'sticker');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-II | Sticker Silme',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Sticker Silme',
                    target: `${sticker.name} (${sticker.id})`,
                    targetID: sticker.id,
                    logType: 'sticker',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Sticker Silme';
        const banned = await banUser(sticker.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-II | Sticker Silme',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Sticker Silme',
            target: `${sticker.name} (${sticker.id})`,
            targetID: sticker.id,
            logType: 'sticker',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });
    }
};
