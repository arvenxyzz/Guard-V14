const { 
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MessageFlags
} = require('discord.js');
const config = require('../../DevCode.json');
const { GuardLog } = require('../../Schemas');

const BASE_FLAGS = [MessageFlags.IsComponentsV2];

function getLogChannel(client, guild, logType) {
    const channelNames = config.logChannels;
    let channelName;

    switch (logType) {
        case 'channel':
            channelName = channelNames.channel;
            break;
        case 'role':
            channelName = channelNames.role;
            break;
        case 'emoji':
            channelName = channelNames.emoji;
            break;
        case 'sticker':
            channelName = channelNames.sticker;
            break;
        case 'webhook':
            channelName = channelNames.webhook;
            break;
        case 'ban':
            channelName = channelNames.ban;
            break;
        case 'kick':
            channelName = channelNames.kick;
            break;
        default:
            channelName = channelNames.guard;
    }

    return guild.channels.cache.find(c => c.name === channelName);
}

function formatDate(date) {
    return `<t:${Math.floor(date.getTime() / 1000)}:F>`;
}

function formatRelative(date) {
    return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
}

async function sendLog(client, data) {
    const guild = client.guilds.cache.get(config.guildID);
    if (!guild) return;

    const logChannel = getLogChannel(client, guild, data.logType);
    if (!logChannel) return;

    const now = new Date();
    
    let statusEmoji = '🔴';
    let statusText = 'CEZA UYGULANDI';
    
    if (data.isOwner) {
        statusEmoji = '🟢';
        statusText = 'ISLEM UYGULANMADI';
    } else if (data.isWhitelisted) {
        statusEmoji = '🟡';
        statusText = 'GUVENLI LISTE';
    }

    const container = new ContainerBuilder();

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### 🛡️ **GUARD SECURITY** | ${statusEmoji} ${statusText}`)
    );
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`**[ ${data.action.toUpperCase()} ]**`)
    );

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `**👤 Yetkili Bilgileri**\n` +
            `> Kullanici: ${data.executorTag}\n` +
            `> ID: \`${data.executorID}\`\n` +
            `> Mention: <@${data.executorID}>`
        )
    );

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `**🎯 Hedef Bilgileri**\n` +
            `> Hedef: ${data.target || 'Bilinmiyor'}\n` +
            `> ID: \`${data.targetID || 'N/A'}\``
        )
    );

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `**🕐 Zaman Bilgileri**\n` +
            `> Tarih: ${formatDate(now)}\n` +
            `> Gecen Sure: ${formatRelative(now)}`
        )
    );

    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));

    if (data.isOwner) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `✅ **ISLEM UYGULANMADI**\n` +
                `> Sebep: Bot sahibi oldugu icin islem uygulanmadi.\n` +
                `> Yetki Seviyesi: **OWNER**`
            )
        );
    } else if (data.isWhitelisted) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `⚠️ **GUVENLI LISTEDE**\n` +
                `> Durum: Guvenli listede oldugu icin islem uygulanmadi.\n` +
                `> Kalan Limit: \`${data.remainingLimit}\``
            )
        );
    } else {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `❌ **UYGULANAN CEZA**\n` +
                `> Ceza: ${data.punishment || 'SUNUCUDAN YASAKLANDI'}\n` +
                `> Sebep: ${data.reason || 'Guard korumasi'}`
            )
        );

        if (data.restored) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `🔄 **GERI YUKLEME**\n` +
                    `> Durum: Silinen oge yedekten basariyla geri yuklendi.`
                )
            );
        }
    }

    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `**🏠 Sunucu:** ${guild.name} | **ID:** \`${guild.id}\` | **Uye:** \`${guild.memberCount}\`\n` +
            `*Guard Security System | Log ID: ${Date.now()}*`
        )
    );

    await logChannel.send({ 
        components: [container], 
        flags: BASE_FLAGS 
    });

    await GuardLog.create({
        guildID: config.guildID,
        executorID: data.executorID,
        executorTag: data.executorTag,
        action: data.action,
        targetName: data.target,
        targetID: data.targetID,
        punishment: data.punishment,
        reason: data.reason
    });
}

module.exports = { sendLog, getLogChannel };
