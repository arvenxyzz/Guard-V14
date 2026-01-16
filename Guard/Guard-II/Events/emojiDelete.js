const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'emojiDelete',
    async execute(emoji, client) {
        if (!isProtectedGuild(emoji.guild.id)) return;
        if (!await isShieldEnabled(emoji.guild.id, 'emojiShield')) return;

        const fetchedLogs = await emoji.guild.fetchAuditLogs({ limit: 1, type: 62 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-II | Emoji Silme',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Emoji Silme',
                target: `${emoji.name} (${emoji.id})`,
                targetID: emoji.id,
                logType: 'emoji',
                isOwner: true
            });
            return;
        }

        const member = await emoji.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(emoji.guild.id, member, 'emoji');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-II | Emoji Silme',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Emoji Silme',
                    target: `${emoji.name} (${emoji.id})`,
                    targetID: emoji.id,
                    logType: 'emoji',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Emoji Silme';
        const banned = await banUser(emoji.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-II | Emoji Silme',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Emoji Silme',
            target: `${emoji.name} (${emoji.id})`,
            targetID: emoji.id,
            logType: 'emoji',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });
    }
};
