const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MessageFlags
} = require('discord.js');
const { isOwner } = require('../../Shared/Utils');

const BASE_FLAGS = [MessageFlags.IsComponentsV2];

module.exports = {
    name: 'backup',
    description: 'Yedekleme panelini açar',
    ownerOnly: true,
    async execute(message, args, client) {
        if (!isOwner(message.author.id)) {
            return message.reply('Bu komutu sadece bot sahipleri kullanabilir.');
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('backup_create')
                .setLabel('Yedekle')
                .setStyle(ButtonStyle.Success)
                .setEmoji('💾'),
            new ButtonBuilder()
                .setCustomId('backup_delete')
                .setLabel('Yedek Sil')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🗑️'),
            new ButtonBuilder()
                .setCustomId('backup_list')
                .setLabel('Yedek Listele')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📋')
        );

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### 🛡️ **Yedekleme Paneli**`))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
                `Sunucu yedekleme islemlerini yonetin.\n\n` +
                `💾 **Yedekle** - Sunucunun anlik yedegini alir\n` +
                `🗑️ **Yedek Sil** - Tum yedekleri siler\n` +
                `📋 **Yedek Listele** - Mevcut yedekleri listeler`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addActionRowComponents(row);

        await message.reply({ 
            components: [container], 
            flags: BASE_FLAGS 
        });
    }
};
