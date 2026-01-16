const { createCanvas } = require('canvas');
const { 
    AttachmentBuilder,
    ActionRowBuilder, 
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
const { GuardSettings } = require('../../../Schemas');
const { isOwner } = require('../../Shared/Utils');

const shieldSettings = [
    { field: 'roleShield', display: 'Rol Korumasi', color: '#e74c3c' },
    { field: 'channelShield', display: 'Kanal Korumasi', color: '#3498db' },
    { field: 'emojiShield', display: 'Emoji Korumasi', color: '#e91e63' },
    { field: 'stickerShield', display: 'Sticker Korumasi', color: '#00bcd4' },
    { field: 'guildShield', display: 'Sunucu Korumasi', color: '#9b59b6' },
    { field: 'webhookShield', display: 'Webhook Korumasi', color: '#607d8b' },
    { field: 'banShield', display: 'Ban Korumasi', color: '#f44336' },
    { field: 'kickShield', display: 'Kick Korumasi', color: '#ff9800' }
];

function renderCanvas(settings, guild, author) {
    const canvasWidth = 1200;
    const canvasHeight = 800;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const bgGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    bgGradient.addColorStop(0, '#0d1117');
    bgGradient.addColorStop(0.5, '#161b22');
    bgGradient.addColorStop(1, '#0d1117');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = 'rgba(88, 101, 242, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasWidth; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasHeight);
        ctx.stroke();
    }
    for (let i = 0; i < canvasHeight; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GUARD SECURITY PANEL', canvasWidth / 2, 70);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '20px Arial';
    ctx.fillText(`${guild.name} | Koruma Ayarlari`, canvasWidth / 2, 105);

    ctx.strokeStyle = 'rgba(88, 101, 242, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 130);
    ctx.lineTo(canvasWidth - 100, 130);
    ctx.stroke();

    const panelX = 50;
    const panelY = 160;
    const panelWidth = canvasWidth - 100;
    const panelHeight = 520;

    ctx.fillStyle = 'rgba(30, 35, 45, 0.9)';
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
    ctx.fill();

    ctx.strokeStyle = 'rgba(88, 101, 242, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('KORUMA DURUMLARI', panelX + 30, panelY + 45);

    const cardWidth = 250;
    const cardHeight = 100;
    const cardsPerRow = 4;
    const cardMarginX = 20;
    const cardMarginY = 20;
    const startX = panelX + 30;
    const startY = panelY + 80;

    shieldSettings.forEach((shield, index) => {
        const col = index % cardsPerRow;
        const row = Math.floor(index / cardsPerRow);
        const x = startX + col * (cardWidth + cardMarginX);
        const y = startY + row * (cardHeight + cardMarginY);

        const isActive = settings[shield.field];
        
        ctx.fillStyle = isActive ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x, y, cardWidth, cardHeight, 12);
        ctx.fill();

        ctx.strokeStyle = isActive ? '#2ecc71' : '#e74c3c';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = shield.color;
        ctx.beginPath();
        ctx.arc(x + 25, y + cardHeight / 2, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(shield.display, x + 50, y + 40);

        ctx.fillStyle = isActive ? '#2ecc71' : '#e74c3c';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(isActive ? 'AKTIF' : 'DEAKTIF', x + 50, y + 70);

        ctx.fillStyle = isActive ? '#2ecc71' : '#e74c3c';
        ctx.beginPath();
        ctx.arc(x + cardWidth - 25, y + cardHeight / 2, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    const statsY = panelY + panelHeight - 80;
    ctx.fillStyle = 'rgba(88, 101, 242, 0.3)';
    ctx.beginPath();
    ctx.roundRect(panelX + 30, statsY, panelWidth - 60, 60, 10);
    ctx.fill();

    const activeCount = shieldSettings.filter(s => settings[s.field]).length;
    const totalCount = shieldSettings.length;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Aktif Koruma: ${activeCount}/${totalCount}`, panelX + 200, statsY + 38);

    const barX = panelX + 350;
    const barWidth = 400;
    const barHeight = 20;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(barX, statsY + 20, barWidth, barHeight, 10);
    ctx.fill();

    const fillWidth = (activeCount / totalCount) * barWidth;
    const barGradient = ctx.createLinearGradient(barX, 0, barX + fillWidth, 0);
    barGradient.addColorStop(0, '#2ecc71');
    barGradient.addColorStop(1, '#27ae60');
    ctx.fillStyle = barGradient;
    ctx.beginPath();
    ctx.roundRect(barX, statsY + 20, fillWidth, barHeight, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round((activeCount / totalCount) * 100)}%`, barX + barWidth + 50, statsY + 36);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Panel: ${new Date().toLocaleString('tr-TR')} | ${author.tag}`, canvasWidth / 2, canvasHeight - 30);

    ctx.strokeStyle = 'rgba(88, 101, 242, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, canvasWidth - 10, canvasHeight - 10);

    return new AttachmentBuilder(canvas.toBuffer(), { name: 'guard-panel.png' });
}

function createShieldMenu(settings) {
    const options = shieldSettings.map(shield => ({
        label: shield.display,
        value: shield.field,
        description: settings[shield.field] ? 'Aktif - Tikla kapat' : 'Deaktif - Tikla ac',
        emoji: settings[shield.field] ? '🟢' : '🔴'
    }));

    return new StringSelectMenuBuilder()
        .setCustomId('gsetup_shield')
        .setPlaceholder('Koruma Ac/Kapat...')
        .addOptions(options);
}

module.exports = {
    name: 'gsetup',
    description: 'Guard koruma ayarlarini yonetir',
    ownerOnly: true,
    async execute(message, args, client) {
        if (!isOwner(message.author.id)) {
            return message.reply('Bu komutu sadece bot sahipleri kullanabilir.');
        }

        let settings = await GuardSettings.findOne({ guildID: message.guild.id });
        if (!settings) {
            settings = new GuardSettings({ guildID: message.guild.id });
            await settings.save();
        }

        const canvasAttachment = renderCanvas(settings, message.guild, message.author);
        const shieldRow = new ActionRowBuilder().addComponents(createShieldMenu(settings));

        const msg = await message.reply({ files: [canvasAttachment], components: [shieldRow] });

        const collector = msg.createMessageComponentCollector({ time: 120000 });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: 'Bu paneli sadece komutu kullanan kisi yonetebilir.', ephemeral: true });
            }

            if (interaction.customId === 'gsetup_shield') {
                const field = interaction.values[0];
                settings[field] = !settings[field];
                settings.updatedAt = new Date();
                await settings.save();

                const newCanvas = renderCanvas(settings, message.guild, message.author);
                const newShieldRow = new ActionRowBuilder().addComponents(createShieldMenu(settings));

                try {
                    await interaction.update({
                        files: [newCanvas]
                    });
                } catch (error) {
                    if (error.code === 10062) { // Unknown interaction
                        console.log('Interaction expired, cannot update:', error.message);
                    } else {
                        console.error('Interaction update error:', error);
                    }
                }
            }
        });

        collector.on('end', async () => {
            try {
                const disabledMenu = createShieldMenu(settings).setDisabled(true);
                const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);
                await msg.edit({ components: [disabledRow] });
            } catch (e) {
                if (e.code === 10008 || e.code === 10062) { // Unknown message or Unknown interaction
                    // Message or interaction no longer exists, ignore
                } else {
                    console.error('Collector end error:', e);
                }
            }
        });
    }
};
