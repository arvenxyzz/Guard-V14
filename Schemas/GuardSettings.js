const mongoose = require('mongoose');

const GuardSettingsSchema = new mongoose.Schema({
    guildID: { type: String, required: true, unique: true },
    
    roleShield: { type: Boolean, default: true },
    channelShield: { type: Boolean, default: true },
    emojiShield: { type: Boolean, default: true },
    stickerShield: { type: Boolean, default: true },
    guildShield: { type: Boolean, default: true },
    webhookShield: { type: Boolean, default: true },
    botShield: { type: Boolean, default: true },
    banShield: { type: Boolean, default: true },
    kickShield: { type: Boolean, default: true },
    
    roleCreateLimit: { type: Number, default: 3 },
    roleDeleteLimit: { type: Number, default: 3 },
    roleUpdateLimit: { type: Number, default: 3 },
    channelCreateLimit: { type: Number, default: 3 },
    channelDeleteLimit: { type: Number, default: 3 },
    channelUpdateLimit: { type: Number, default: 3 },
    emojiCreateLimit: { type: Number, default: 3 },
    emojiDeleteLimit: { type: Number, default: 3 },
    emojiUpdateLimit: { type: Number, default: 3 },
    stickerCreateLimit: { type: Number, default: 3 },
    stickerDeleteLimit: { type: Number, default: 3 },
    stickerUpdateLimit: { type: Number, default: 3 },
    
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GuardSettings', GuardSettingsSchema);
