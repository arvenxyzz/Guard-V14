const mongoose = require('mongoose');

const WhitelistSchema = new mongoose.Schema({
    guildID: { type: String, required: true },
    targetID: { type: String, required: true },
    targetType: { type: String, enum: ['user', 'role'], required: true },
    category: { type: String, enum: ['full', 'channel', 'role', 'emoji', 'sticker', 'server'], required: true },
    limit: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
    addedBy: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
});

WhitelistSchema.index({ guildID: 1, targetID: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Whitelist', WhitelistSchema);
