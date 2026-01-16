const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'guildUpdate',
    async execute(oldGuild, newGuild, client) {
        if (!isProtectedGuild(newGuild.id)) return;
        if (!await isShieldEnabled(newGuild.id, 'guildShield')) return;

        const fetchedLogs = await newGuild.fetchAuditLogs({ limit: 1, type: 1 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        let changes = [];
        if (oldGuild.name !== newGuild.name) {
            changes.push(`Sunucu İsmi: ${oldGuild.name} → ${newGuild.name}`);
        }
        if (oldGuild.iconURL() !== newGuild.iconURL()) {
            changes.push('Sunucu İkonu Değiştirildi');
        }
        if (oldGuild.bannerURL() !== newGuild.bannerURL()) {
            changes.push('Sunucu Banner Değiştirildi');
        }
        if (changes.length === 0) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-II | Sunucu Düzenleme',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Sunucu Düzenleme',
                target: changes.join('\n'),
                targetID: newGuild.id,
                logType: 'guard',
                isOwner: true
            });
            return;
        }

        const member = await newGuild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(newGuild.id, member, 'server');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-II | Sunucu Düzenleme',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Sunucu Düzenleme',
                    target: changes.join('\n'),
                    targetID: newGuild.id,
                    logType: 'guard',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Sunucu Düzenleme';
        const banned = await banUser(newGuild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-II | Sunucu Düzenleme',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Sunucu Düzenleme',
            target: changes.join('\n'),
            targetID: newGuild.id,
            logType: 'guard',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });

        try {
            if (oldGuild.name !== newGuild.name) {
                await newGuild.setName(oldGuild.name);
            }
        } catch (e) {}
    }
};
