const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {
        if (!newChannel.guild) return;
        if (!isProtectedGuild(newChannel.guild.id)) return;
        if (!await isShieldEnabled(newChannel.guild.id, 'channelShield')) return;

        const fetchedLogs = await newChannel.guild.fetchAuditLogs({ limit: 1, type: 11 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        let changes = [];
        if (oldChannel.name !== newChannel.name) {
            changes.push(`İsim: ${oldChannel.name} → ${newChannel.name}`);
        }
        if (changes.length === 0) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-I | Kanal Düzenleme',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Kanal Düzenleme',
                target: `${newChannel.name} (${newChannel.id})\n${changes.join('\n')}`,
                targetID: newChannel.id,
                logType: 'channel',
                isOwner: true
            });
            return;
        }

        const member = await newChannel.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(newChannel.guild.id, member, 'channel');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-I | Kanal Düzenleme',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Kanal Düzenleme',
                    target: `${newChannel.name} (${newChannel.id})\n${changes.join('\n')}`,
                    targetID: newChannel.id,
                    logType: 'channel',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Kanal Düzenleme';
        const banned = await banUser(newChannel.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-I | Kanal Düzenleme',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Kanal Düzenleme',
            target: `${newChannel.name} (${newChannel.id})\n${changes.join('\n')}`,
            targetID: newChannel.id,
            logType: 'channel',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });

        try { await newChannel.setName(oldChannel.name); } catch (e) {}
    }
};
