const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'roleCreate',
    async execute(role, client) {
        if (!isProtectedGuild(role.guild.id)) return;
        if (!await isShieldEnabled(role.guild.id, 'roleShield')) return;

        const fetchedLogs = await role.guild.fetchAuditLogs({ limit: 1, type: 30 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-I | Rol Oluşturma',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Rol Oluşturma',
                target: `${role.name} (${role.id})`,
                targetID: role.id,
                logType: 'role',
                isOwner: true
            });
            return;
        }

        const member = await role.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(role.guild.id, member, 'role');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-I | Rol Oluşturma',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Rol Oluşturma',
                    target: `${role.name} (${role.id})`,
                    targetID: role.id,
                    logType: 'role',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Rol Oluşturma';
        const banned = await banUser(role.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-I | Rol Oluşturma',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Rol Oluşturma',
            target: `${role.name} (${role.id})`,
            targetID: role.id,
            logType: 'role',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });

        try { await role.delete(); } catch (e) {}
    }
};
