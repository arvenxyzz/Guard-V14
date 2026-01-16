const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'stickerUpdate',
    async execute(oldSticker, newSticker, client) {
        if (!isProtectedGuild(newSticker.guild.id)) return;
        if (!await isShieldEnabled(newSticker.guild.id, 'stickerShield')) return;

        const fetchedLogs = await newSticker.guild.fetchAuditLogs({ limit: 1, type: 91 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        let changes = [];
        if (oldSticker.name !== newSticker.name) {
            changes.push(`İsim: ${oldSticker.name} → ${newSticker.name}`);
        }
        if (changes.length === 0) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-II | Sticker Düzenleme',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Sticker Düzenleme',
                target: `${newSticker.name} (${newSticker.id})\n${changes.join('\n')}`,
                targetID: newSticker.id,
                logType: 'sticker',
                isOwner: true
            });
            return;
        }

        const member = await newSticker.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(newSticker.guild.id, member, 'sticker');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-II | Sticker Düzenleme',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Sticker Düzenleme',
                    target: `${newSticker.name} (${newSticker.id})\n${changes.join('\n')}`,
                    targetID: newSticker.id,
                    logType: 'sticker',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Sticker Düzenleme';
        const banned = await banUser(newSticker.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-II | Sticker Düzenleme',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Sticker Düzenleme',
            target: `${newSticker.name} (${newSticker.id})\n${changes.join('\n')}`,
            targetID: newSticker.id,
            logType: 'sticker',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });

        try { await newSticker.setName(oldSticker.name); } catch (e) {}
    }
};
