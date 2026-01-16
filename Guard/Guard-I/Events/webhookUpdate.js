const { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled } = require('../../Shared/Utils');
const { sendLog } = require('../../Shared/Logger');

module.exports = {
    name: 'webhookUpdate',
    async execute(channel, client) {
        if (!channel.guild) return;
        if (!isProtectedGuild(channel.guild.id)) return;
        if (!await isShieldEnabled(channel.guild.id, 'webhookShield')) return;

        const fetchedLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 50 });
        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor, target } = log;
        if (executor.id === client.user.id) return;

        const timeDiff = Date.now() - log.createdTimestamp;
        if (timeDiff > 5000) return;

        if (isOwner(executor.id)) {
            await sendLog(client, {
                title: 'Guard-I | Webhook Islemi',
                executorTag: executor.tag,
                executorID: executor.id,
                action: 'Webhook Olusturma',
                target: `${channel.name} (${channel.id})`,
                targetID: channel.id,
                logType: 'webhook',
                isOwner: true
            });
            return;
        }

        const member = await channel.guild.members.fetch(executor.id).catch(() => null);
        if (member) {
            const wl = await checkWhitelist(channel.guild.id, member, 'webhook');
            if (wl.whitelisted) {
                const remaining = await useWhitelistLimit(wl.doc);
                await sendLog(client, {
                    title: 'Guard-I | Webhook Islemi',
                    executorTag: executor.tag,
                    executorID: executor.id,
                    action: 'Webhook Olusturma',
                    target: `${channel.name} (${channel.id})`,
                    targetID: channel.id,
                    logType: 'webhook',
                    isWhitelisted: true,
                    remainingLimit: remaining
                });
                return;
            }
        }

        const reason = 'Guard - Yetkisiz Webhook';
        const banned = await banUser(channel.guild, executor.id, reason);

        try {
            const webhooks = await channel.fetchWebhooks();
            for (const [id, webhook] of webhooks) {
                if (webhook.owner?.id === executor.id) {
                    await webhook.delete('Guard - Yetkisiz webhook silindi');
                }
            }
        } catch (e) {}

        await sendLog(client, {
            title: 'Guard-I | Webhook Islemi',
            executorTag: executor.tag,
            executorID: executor.id,
            action: 'Webhook Olusturma',
            target: `${channel.name} (${channel.id})`,
            targetID: channel.id,
            logType: 'webhook',
            punishment: banned ? 'Sunucudan Yasaklandi' : 'Ban basarisiz',
            reason: reason,
            restored: true
        });
    }
};
