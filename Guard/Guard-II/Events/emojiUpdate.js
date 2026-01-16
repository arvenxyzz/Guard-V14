const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'emojiUpdate',
    async execute(oldEmoji, newEmoji, client) {
        if (!isProtectedGuild(newEmoji.guild.id)) return;
        if (!await isShieldEnabled(newEmoji.guild.id, 'emojiShield')) return;

        const fetchedLogs = await newEmoji.guild.fetchAuditLogs({ limit: 1, type: 61 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        let changes = [];
        if (oldEmoji.name !== newEmoji.name) {
            changes.push(`İsim: ${oldEmoji.name} → ${newEmoji.name}`);
        }
        if (changes.length === 0) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-II | Emoji Düzenleme',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Emoji Düzenleme',
                target: `${newEmoji.name} (${newEmoji.id})\n${changes.join('\n')}`,
                targetID: newEmoji.id,
                logType: 'emoji',
                isOwner: true
            });
            return;
        }

        const member = await newEmoji.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(newEmoji.guild.id, member, 'emoji');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-II | Emoji Düzenleme',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Emoji Düzenleme',
                    target: `${newEmoji.name} (${newEmoji.id})\n${changes.join('\n')}`,
                    targetID: newEmoji.id,
                    logType: 'emoji',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Emoji Düzenleme';
        const banned = await banUser(newEmoji.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-II | Emoji Düzenleme',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Emoji Düzenleme',
            target: `${newEmoji.name} (${newEmoji.id})\n${changes.join('\n')}`,
            targetID: newEmoji.id,
            logType: 'emoji',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });

        try { await newEmoji.setName(oldEmoji.name); } catch (e) {}
    }
};
