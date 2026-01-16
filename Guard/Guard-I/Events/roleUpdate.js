const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole, client) {
        if (!isProtectedGuild(newRole.guild.id)) return;
        if (!await isShieldEnabled(newRole.guild.id, 'roleShield')) return;

        const fetchedLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: 31 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id) return;

        let changes = [];
        if (oldRole.name !== newRole.name) {
            changes.push(`İsim: ${oldRole.name} → ${newRole.name}`);
        }
        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            changes.push('Yetkiler değiştirildi');
        }
        if (changes.length === 0) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: '🛡️ Guard-I | Rol Düzenleme',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Rol Düzenleme',
                target: `${newRole.name} (${newRole.id})\n${changes.join('\n')}`,
                targetID: newRole.id,
                logType: 'role',
                isOwner: true
            });
            return;
        }

        const member = await newRole.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(newRole.guild.id, member, 'role');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: '🛡️ Guard-I | Rol Düzenleme',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Rol Düzenleme',
                    target: `${newRole.name} (${newRole.id})\n${changes.join('\n')}`,
                    targetID: newRole.id,
                    logType: 'role',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Rol Düzenleme';
        const banned = await banUser(newRole.guild, executor.id, reason);

        await sendLog(client, {
            title: '🛡️ Guard-I | Rol Düzenleme',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Rol Düzenleme',
            target: `${newRole.name} (${newRole.id})\n${changes.join('\n')}`,
            targetID: newRole.id,
            logType: 'role',
            punishment: banned ? 'Sunucudan Yasaklandı' : 'Ban başarısız',
            reason: reason
        });

        try {
            await newRole.setName(oldRole.name);
            await newRole.setPermissions(oldRole.permissions);
        } catch (e) {}
    }
};
