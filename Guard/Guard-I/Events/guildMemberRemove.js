const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        if (!isProtectedGuild(member.guild.id)) return;
        if (!await isShieldEnabled(member.guild.id, 'kickShield')) return;

        const fetchedLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 20 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor, target } = log;
        if (executor.id === client.user.id) return;
        if (target.id !== member.id) return;

        const timeDiff = Date.now() - log.createdTimestamp;
        if (timeDiff > 5000) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: 'Guard-I | Kick Islemi',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Uye Kickleme',
                target: `${member.user.tag} (${member.user.id})`,
                targetID: member.user.id,
                logType: 'kick',
                isOwner: true
            });
            return;
        }

        const executorMember = await member.guild.members.fetch(executor.id).catch(() => null);
        if (executorMember) {
            const wl = await checkWhitelist(member.guild.id, executorMember, 'kick');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: 'Guard-I | Kick Islemi',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Uye Kickleme',
                    target: `${member.user.tag} (${member.user.id})`,
                    targetID: member.user.id,
                    logType: 'kick',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Yetkisiz Kick';
        const banned = await banUser(member.guild, executor.id, reason);

        await sendLog(client, {
            title: 'Guard-I | Kick Islemi',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Uye Kickleme',
            target: `${member.user.tag} (${member.user.id})`,
            targetID: member.user.id,
            logType: 'kick',
            punishment: banned ? 'Sunucudan Yasaklandi' : 'Ban basarisiz',
            reason: reason
        });
    }
};
