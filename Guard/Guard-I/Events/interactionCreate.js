const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Whitelist, GuardSettings } = require('../../../Schemas');
const { isOwner } = require('../../Shared/Utils');
const { createBackup, deleteAllBackups, listBackups } = require('../../Shared/Backup');
const config = require('../../../DevCode.json');

// Track interactions to prevent double handling
const handledInteractions = new Set();

const shieldSettings = [
    { field: 'roleShield', display: 'Rol Korumasi', desc: 'Rol olusturma/silme/duzenleme' },
    { field: 'channelShield', display: 'Kanal Korumasi', desc: 'Kanal olusturma/silme/duzenleme' },
    { field: 'emojiShield', display: 'Emoji Korumasi', desc: 'Emoji olusturma/silme/duzenleme' },
    { field: 'stickerShield', display: 'Sticker Korumasi', desc: 'Sticker olusturma/silme/duzenleme' },
    { field: 'guildShield', display: 'Sunucu Korumasi', desc: 'Sunucu ayarlari degisikligi' },
    { field: 'webhookShield', display: 'Webhook Korumasi', desc: 'Webhook olusturma/silme' },
    { field: 'botShield', display: 'Bot Korumasi', desc: 'Bot ekleme engelleme' },
    { field: 'banShield', display: 'Ban Korumasi', desc: 'Yetkisiz ban engelleme' },
    { field: 'kickShield', display: 'Kick Korumasi', desc: 'Yetkisiz kick engelleme' }
];

const limitSettings = [
    { field: 'roleCreateLimit', display: 'Rol Olusturma Limiti' },
    { field: 'roleDeleteLimit', display: 'Rol Silme Limiti' },
    { field: 'roleUpdateLimit', display: 'Rol Duzenleme Limiti' },
    { field: 'channelCreateLimit', display: 'Kanal Olusturma Limiti' },
    { field: 'channelDeleteLimit', display: 'Kanal Silme Limiti' },
    { field: 'channelUpdateLimit', display: 'Kanal Duzenleme Limiti' },
    { field: 'emojiCreateLimit', display: 'Emoji Olusturma Limiti' },
    { field: 'emojiDeleteLimit', display: 'Emoji Silme Limiti' },
    { field: 'emojiUpdateLimit', display: 'Emoji Duzenleme Limiti' },
    { field: 'stickerCreateLimit', display: 'Sticker Olusturma Limiti' },
    { field: 'stickerDeleteLimit', display: 'Sticker Silme Limiti' },
    { field: 'stickerUpdateLimit', display: 'Sticker Duzenleme Limiti' }
];

function createSettingsEmbed(settings, guild) {
    const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: 'GUARD SECURITY PANEL', iconURL: guild.iconURL() })
        .setTitle('[ KORUMA AYARLARI ]')
        .setDescription('```\n' + '='.repeat(40) + '\n```');

    let shieldStatus = '';
    for (const shield of shieldSettings) {
        const status = settings[shield.field] ? '[+] AKTIF' : '[-] DEAKTIF';
        shieldStatus += `${shield.display}: ${status}\n`;
    }

    embed.addFields({
        name: '[ KORUMA DURUMLARI ]',
        value: '```diff\n' + shieldStatus + '```',
        inline: false
    });

    let limitStatus = '';
    for (const limit of limitSettings) {
        limitStatus += `${limit.display}: ${settings[limit.field]}\n`;
    }

    embed.addFields({
        name: '[ LIMIT AYARLARI ]',
        value: '```yaml\n' + limitStatus + '```',
        inline: false
    });

    embed.setFooter({ text: `Guard Security System | ${guild.name}` });
    embed.setTimestamp();

    return embed;
}

function createShieldMenu(settings) {
    const options = shieldSettings.map(shield => ({
        label: shield.display,
        value: shield.field,
        description: `${shield.desc} - ${settings[shield.field] ? 'AKTIF' : 'DEAKTIF'}`,
        emoji: settings[shield.field] ? '🟢' : '🔴'
    }));

    return new StringSelectMenuBuilder()
        .setCustomId('gsetup_shield')
        .setPlaceholder('Koruma Ac/Kapat...')
        .addOptions(options);
}

function createLimitMenu(settings) {
    const options = limitSettings.map(limit => ({
        label: limit.display,
        value: limit.field,
        description: `Mevcut: ${settings[limit.field]}`,
        emoji: '⚙️'
    }));

    return new StringSelectMenuBuilder()
        .setCustomId('gsetup_limit')
        .setPlaceholder('Limit Ayarla...')
        .addOptions(options);
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Prevent double handling of interactions
        if (handledInteractions.has(interaction.id)) {
            return;
        }
        handledInteractions.add(interaction.id);
        
        // Clean up the set after 10 seconds to prevent memory leaks
        setTimeout(() => {
            handledInteractions.delete(interaction.id);
        }, 10000);
        
        if (interaction.isButton()) {
            if (!isOwner(interaction.user.id)) {
                return interaction.reply({ content: 'Bu işlemi yapamazsınız.', ephemeral: true });
            }

            if (interaction.customId === 'backup_create') {
                await interaction.deferReply();
                const backup = await createBackup(interaction.guild, false);
                
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Yedek Alındı')
                    .addFields(
                        { name: 'Kanal Sayısı', value: `${backup.channels.length}`, inline: true },
                        { name: 'Rol Sayısı', value: `${backup.roles.length}`, inline: true },
                        { name: 'Tarih', value: `<t:${Math.floor(backup.updatedAt.getTime() / 1000)}:F>`, inline: true }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }

            if (interaction.customId === 'backup_delete') {
                await interaction.deferReply();
                await deleteAllBackups(interaction.guild.id);

                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('🗑️ Yedekler Silindi')
                    .setDescription('Tüm yedekler başarıyla silindi.')
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }

            if (interaction.customId === 'backup_list') {
                await interaction.deferReply();
                const backups = await listBackups(interaction.guild.id);

                if (backups.length === 0) {
                    return interaction.editReply({ content: 'Hiç yedek bulunamadı.' });
                }

                const embed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle('📋 Yedek Listesi')
                    .setDescription(
                        backups.map((b, i) => 
                            `**${i + 1}.** ${b.isAuto ? '(Otomatik)' : '(Manuel)'} - <t:${Math.floor(b.updatedAt.getTime() / 1000)}:R>\n` +
                            `   Kanal: ${b.channels.length} | Rol: ${b.roles.length}`
                        ).join('\n\n')
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }
        }

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'gsetup_shield') {
                if (!isOwner(interaction.user.id)) {
                    return interaction.reply({ content: 'Bu islemi yapamazsiniz.', ephemeral: true });
                }

                const field = interaction.values[0];
                let settings = await GuardSettings.findOne({ guildID: interaction.guild.id });
                if (!settings) {
                    settings = new GuardSettings({ guildID: interaction.guild.id });
                }
                
                settings[field] = !settings[field];
                settings.updatedAt = new Date();
                await settings.save();

                const newEmbed = createSettingsEmbed(settings, interaction.guild);
                const newShieldRow = new ActionRowBuilder().addComponents(createShieldMenu(settings));
                const newLimitRow = new ActionRowBuilder().addComponents(createLimitMenu(settings));

                // Only update if the interaction hasn't been acknowledged yet
                if (!interaction.replied && !interaction.deferred) {
                    try {
                        await interaction.update({ embeds: [newEmbed], components: [newShieldRow, newLimitRow] });
                    } catch (error) {
                        if (error.code === 10062) { // Unknown interaction
                            console.log('Interaction expired, cannot update:', error.message);
                        } else {
                            console.error('Interaction update error:', error);
                        }
                    }
                }
                return;
            }

            if (interaction.customId === 'gsetup_limit') {
                if (!isOwner(interaction.user.id)) {
                    return interaction.reply({ content: 'Bu islemi yapamazsiniz.', ephemeral: true });
                }

                const field = interaction.values[0];
                const limitInfo = limitSettings.find(l => l.field === field);

                const modal = new ModalBuilder()
                    .setCustomId(`gsetup_modal_${field}`)
                    .setTitle(limitInfo.display);

                const input = new TextInputBuilder()
                    .setCustomId('limit_value')
                    .setLabel('Yeni limit degeri girin:')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setPlaceholder('Ornek: 3');

                modal.addComponents(new ActionRowBuilder().addComponents(input));
                await interaction.showModal(modal);
                return;
            }

            if (interaction.customId.startsWith('wl_')) {
                const parts = interaction.customId.split('_');
                const targetID = parts[1];
                const targetType = parts[2];
                const category = interaction.values[0];

                const modal = new ModalBuilder()
                    .setCustomId(`wlmodal_${targetID}_${targetType}_${category}`)
                    .setTitle('Limit Belirleme');

                const limitInput = new TextInputBuilder()
                    .setCustomId('limit')
                    .setLabel('Limit Girin (0 = Sınırsız)')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Örnek: 3')
                    .setRequired(true);

                const row = new ActionRowBuilder().addComponents(limitInput);
                modal.addComponents(row);

                await interaction.showModal(modal);
                return;
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith('gsetup_modal_')) {
                if (!isOwner(interaction.user.id)) {
                    return interaction.reply({ content: 'Bu islemi yapamazsiniz.', ephemeral: true });
                }

                const field = interaction.customId.replace('gsetup_modal_', '');
                const value = interaction.fields.getTextInputValue('limit_value');

                if (isNaN(value) || parseInt(value) < 1) {
                    return interaction.reply({ content: 'Gecersiz deger! 1 veya daha buyuk bir sayi girin.', ephemeral: true });
                }

                let settings = await GuardSettings.findOne({ guildID: interaction.guild.id });
                if (!settings) {
                    settings = new GuardSettings({ guildID: interaction.guild.id });
                }

                settings[field] = parseInt(value);
                settings.updatedAt = new Date();
                await settings.save();

                const newEmbed = createSettingsEmbed(settings, interaction.guild);
                const newShieldRow = new ActionRowBuilder().addComponents(createShieldMenu(settings));
                const newLimitRow = new ActionRowBuilder().addComponents(createLimitMenu(settings));

                // Only update if the interaction hasn't been acknowledged yet
                if (!interaction.replied && !interaction.deferred) {
                    try {
                        await interaction.update({ embeds: [newEmbed], components: [newShieldRow, newLimitRow] });
                    } catch (error) {
                        if (error.code === 10062) { // Unknown interaction
                            console.log('Interaction expired, cannot update:', error.message);
                        } else {
                            console.error('Interaction update error:', error);
                        }
                    }
                }
                return;
            }

            if (!interaction.customId.startsWith('wlmodal_')) return;
            if (!isOwner(interaction.user.id)) {
                return interaction.reply({ content: 'Bu işlemi yapamazsınız.', ephemeral: true });
            }

            const parts = interaction.customId.split('_');
            const targetID = parts[1];
            const targetType = parts[2];
            const category = parts[3];
            const limitValue = parseInt(interaction.fields.getTextInputValue('limit')) || 0;

            const categoryNames = {
                'full': 'Full Guvenli',
                'channel': 'Kanal',
                'role': 'Rol',
                'emoji': 'Emoji',
                'sticker': 'Sticker',
                'server': 'Sunucu',
                'webhook': 'Webhook',
                'ban': 'Ban',
                'kick': 'Kick'
            };

            try {
                await Whitelist.findOneAndUpdate(
                    { guildID: config.guildID, targetID: targetID, category: category },
                    {
                        guildID: config.guildID,
                        targetID: targetID,
                        targetType: targetType,
                        category: category,
                        limit: limitValue,
                        used: 0,
                        addedBy: interaction.user.id
                    },
                    { upsert: true, new: true }
                );

                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Güvenli Listeye Eklendi')
                    .addFields(
                        { name: 'Hedef ID', value: targetID, inline: true },
                        { name: 'Tür', value: targetType === 'user' ? 'Kullanıcı' : 'Rol', inline: true },
                        { name: 'Kategori', value: categoryNames[category], inline: true },
                        { name: 'Limit', value: limitValue === 0 ? 'Sınırsız' : `${limitValue} işlem`, inline: true }
                    )
                    .setTimestamp();

                // For modal submissions, we need to acknowledge the modal submission first
                // Since this is a modal submission, we should defer or reply appropriately
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } catch (err) {
                await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
            }
        }
    }
};
