const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'guildBanAdd',
    async execute(ban, client) {
        if (!isProtectedGuild(ban.guild.id)) return;
        if (!await isShieldEnabled(ban.guild.id, 'banShield')) return;

        const fetchedLogs = await ban.guild.fetchAuditLogs({ limit: 1, type: 22 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor, target } = log;
        if (executor.id === client.user.id) return;
        if (target.id !== ban.user.id) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: 'Guard-I | Ban Islemi',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Uye Banlama',
                target: `${ban.user.tag} (${ban.user.id})`,
                targetID: ban.user.id,
                logType: 'ban',
                isOwner: true
            });
            return;
        }

        const member = await ban.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(ban.guild.id, member, 'ban');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: 'Guard-I | Ban Islemi',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Uye Banlama',
                    target: `${ban.user.tag} (${ban.user.id})`,
                    targetID: ban.user.id,
                    logType: 'ban',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Yetkisiz Ban';
        const banned = await banUser(ban.guild, executor.id, reason);

        try {
            await ban.guild.members.unban(ban.user.id, 'Guard - Yetkisiz ban geri alindi');
        } catch (e) {}

        await sendLog(client, {
            title: 'Guard-I | Ban Islemi',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Uye Banlama',
            target: `${ban.user.tag} (${ban.user.id})`,
            targetID: ban.user.id,
            logType: 'ban',
            punishment: banned ? 'Sunucudan Yasaklandi' : 'Ban basarisiz',
            reason: reason,
            restored: true
        });
    }
};
