const mongoose = require('mongoose');

const PermissionOverwriteSchema = new mongoose.Schema({
    id: String,
    type: Number,
    allow: String,
    deny: String
}, { _id: false });

const ChannelSchema = new mongoose.Schema({
    id: String,
    name: String,
    type: Number,
    parentID: String,
    position: Number,
    topic: String,
    nsfw: Boolean,
    rateLimitPerUser: Number,
    bitrate: Number,
    userLimit: Number,
    permissionOverwrites: [PermissionOverwriteSchema]
}, { _id: false });

const RoleSchema = new mongoose.Schema({
    id: String,
    name: String,
    color: Number,
    permissions: String,
    position: Number,
    hoist: Boolean,
    mentionable: Boolean,
    members: [String]
}, { _id: false });

const GuildBackupSchema = new mongoose.Schema({
    guildID: { type: String, required: true },
    channels: [ChannelSchema],
    roles: [RoleSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isAuto: { type: Boolean, default: false }
});

module.exports = mongoose.model('GuildBackup', GuildBackupSchema);
