const { 
    ActionRowBuilder, 
    StringSelectMenuBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MessageFlags
} = require('discord.js');
const { isOwner } = require('../../Shared/Utils');
const Whitelist = require('../../../Schemas/Whitelist');
const config = require('../../../DevCode.json');

const BASE_FLAGS = [MessageFlags.IsComponentsV2];

module.exports = {
    name: 'wl',
    description: 'Güvenli listeye kullanıcı veya rol ekler',
    ownerOnly: true,
    async execute(message, args, client) {
        if (!isOwner(message.author.id)) {
            return message.reply('Bu komutu sadece bot sahipleri kullanabilir.');
        }
        if (args[0] && args[0].toLowerCase() === 'liste') {
            const whitelistEntries = await Whitelist.find({ guildID: config.guildID });
            
            if (whitelistEntries.length === 0) {
                return message.reply('Güvenli listede hiç biri bulunmamaktadır.');
            }
            const groupedEntries = {};
            for (const entry of whitelistEntries) {
                if (!groupedEntries[entry.targetID]) {
                    groupedEntries[entry.targetID] = {
                        targetType: entry.targetType,
                        name: '',
                        categories: []
                    };
                }
                groupedEntries[entry.targetID].categories.push(entry.category);
                if (!groupedEntries[entry.targetID].name) {
                    if (entry.targetType === 'user') {
                        try {
                            const user = await message.guild.members.fetch(entry.targetID).catch(() => null);
                            groupedEntries[entry.targetID].name = user ? user.user.tag : `Bilinmeyen Kullanıcı (${entry.targetID})`;
                        } catch (e) {
                            groupedEntries[entry.targetID].name = `Bilinmeyen Kullanıcı (${entry.targetID})`;
                        }
                    } else {
                        const role = message.guild.roles.cache.get(entry.targetID);
                        groupedEntries[entry.targetID].name = role ? role.name : `Bilinmeyen Rol (${entry.targetID})`;
                    }
                }
            }
            let response = '### 🛡️ **Güvenli Liste**\n\n';
            const categoryNames = {
                'full': 'Full Güvenli',
                'channel': 'Kanal',
                'role': 'Rol',
                'emoji': 'Emoji',
                'sticker': 'Sticker',
                'server': 'Sunucu',
                'webhook': 'Webhook',
                'ban': 'Ban',
                'kick': 'Kick'
            };
            
            for (const [targetID, data] of Object.entries(groupedEntries)) {
                const categories = data.categories.map(cat => categoryNames[cat] || cat).join(', ');
                response += `**${data.name}** (\`${targetID}\`) - Tür: ${data.targetType === 'user' ? 'Kullanıcı' : 'Rol'}\n`;
                response += `Kategoriler: ${categories}\n\n`;
            }
            if (response.length > 2000) {
                response = response.substring(0, 1997) + '...';
            }
            
            return message.reply(response);
        }
        
        let targetID = args[0];
        if (!targetID) {
            return message.reply('Kullanım: `.wl @kullanıcı/id` veya `.wl @rol/id`');
        }

        targetID = targetID.replace(/[<@!&>]/g, '');

        const member = await message.guild.members.fetch(targetID).catch(() => null);
        const role = message.guild.roles.cache.get(targetID);

        if (!member && !role) {
            return message.reply('Geçerli bir kullanıcı veya rol bulunamadı.');
        }

        const targetType = member ? 'user' : 'role';
        const targetName = member ? member.user.tag : role.name;
        const existingEntries = await Whitelist.find({
            guildID: config.guildID,
            targetID: targetID
        });
        if (existingEntries.length > 0) {
            await Whitelist.deleteMany({
                guildID: config.guildID,
                targetID: targetID
            });
            
            return message.reply(`${member ? member.user.tag : role.name} (${targetID}) tüm güvenli liste kategorilerinden kaldırıldı.`);
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`wl_${targetID}_${targetType}`)
            .setPlaceholder('Kategori seçin...')
            .addOptions([
                { label: 'Full Guvenli', value: 'full', description: 'Tum islemler icin guvenli', emoji: '🔓' },
                { label: 'Kanal', value: 'channel', description: 'Kanal islemleri icin guvenli', emoji: '📁' },
                { label: 'Rol', value: 'role', description: 'Rol islemleri icin guvenli', emoji: '🎭' },
                { label: 'Emoji', value: 'emoji', description: 'Emoji islemleri icin guvenli', emoji: '😀' },
                { label: 'Sticker', value: 'sticker', description: 'Sticker islemleri icin guvenli', emoji: '🏷️' },
                { label: 'Sunucu', value: 'server', description: 'Sunucu islemleri icin guvenli', emoji: '🏠' },
                { label: 'Webhook', value: 'webhook', description: 'Webhook islemleri icin guvenli', emoji: '🔗' },
                { label: 'Ban', value: 'ban', description: 'Ban islemleri icin guvenli', emoji: '🔨' },
                { label: 'Kick', value: 'kick', description: 'Kick islemleri icin guvenli', emoji: '👢' }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### 🛡️ **Guvenli Liste Paneli**`))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
                `**Hedef:** ${targetName}\n**Tur:** ${targetType === 'user' ? 'Kullanici' : 'Rol'}\n**ID:** \`${targetID}\``
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`📋 Asagidaki menuden guvenli liste kategorisini secin.`))
            .addActionRowComponents(row);

        await message.reply({ 
            components: [container], 
            flags: BASE_FLAGS 
        });
    }
};
