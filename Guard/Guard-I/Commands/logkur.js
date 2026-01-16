const { 
    ChannelType, 
    PermissionFlagsBits,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MessageFlags
} = require('discord.js');
const config = require('../../../DevCode.json');
const { isOwner } = require('../../Shared/Utils');

const BASE_FLAGS = [MessageFlags.IsComponentsV2];

module.exports = {
    name: 'logkur',
    description: 'Log kanallarını otomatik oluşturur',
    ownerOnly: true,
    async execute(message, args, client) {
        if (!isOwner(message.author.id)) {
            return message.reply('Bu komutu sadece bot sahipleri kullanabilir.');
        }

        const logChannelNames = Object.values(config.logChannels);

        const createdChannels = [];
        const skippedChannels = [];

        let category = message.guild.channels.cache.find(c => c.name === 'Guard Log' && c.type === ChannelType.GuildCategory);
        
        if (!category) {
            try {
                category = await message.guild.channels.create({
                    name: 'Guard Log',
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: client.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]
                        }
                    ]
                });
                createdChannels.push('📁 Guard Log kategorisi');
            } catch (e) {
                skippedChannels.push('❌ Guard Log kategorisi (hata)');
            }
        } else {
            skippedChannels.push('📁 Guard Log kategorisi (zaten var)');
        }

        for (const channelName of logChannelNames) {
            const existing = message.guild.channels.cache.find(c => c.name === channelName);
            if (existing) {
                if (category && existing.parentId !== category.id) {
                    try {
                        await existing.setParent(category.id);
                        createdChannels.push(`📌 #${channelName} (tasindi)`);
                    } catch (e) {
                        skippedChannels.push(`⏭️ #${channelName} (zaten var)`);
                    }
                } else {
                    skippedChannels.push(`⏭️ #${channelName} (zaten var)`);
                }
                continue;
            }

            try {
                await message.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category ? category.id : null,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: client.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]
                        }
                    ]
                });
                createdChannels.push(`✅ #${channelName}`);
            } catch (e) {
                skippedChannels.push(`❌ #${channelName} (hata)`);
            }
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### 🛡️ **Log Kanallari Kurulumu**`))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true));

        if (createdChannels.length > 0) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                `**Olusturulan Kanallar:**\n${createdChannels.join('\n')}`
            ));
        }

        if (skippedChannels.length > 0) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                `**Atlanan Kanallar:**\n${skippedChannels.join('\n')}`
            ));
        }

        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
            `📊 **Toplam:** ${createdChannels.length} olusturuldu, ${skippedChannels.length} atlandi`
        ));

        await message.reply({ 
            components: [container], 
            flags: BASE_FLAGS 
        });
    }
};
