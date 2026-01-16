import mongoose from 'mongoose';

const GuardSettingsSchema = new mongoose.Schema({
  guildID: { type: String, required: true, unique: true },
  roleShield: { type: Boolean, default: true },
  channelShield: { type: Boolean, default: true },
  emojiShield: { type: Boolean, default: true },
  stickerShield: { type: Boolean, default: true },
  guildShield: { type: Boolean, default: true },
  webhookShield: { type: Boolean, default: true },
  banShield: { type: Boolean, default: true },
  kickShield: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

const WhitelistSchema = new mongoose.Schema({
  guildID: { type: String, required: true },
  targetID: { type: String, required: true },
  targetType: { type: String, enum: ['user', 'role'], required: true },
  category: { type: String, required: true },
  limit: { type: Number, default: 0 },
  used: { type: Number, default: 0 },
  addedBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const GuardLogSchema = new mongoose.Schema({
  guildID: { type: String, required: true },
  executorID: { type: String, required: true },
  executorTag: { type: String },
  action: { type: String, required: true },
  targetName: { type: String },
  targetID: { type: String },
  punishment: { type: String },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const GuardSettings = mongoose.models.GuardSettings || mongoose.model('GuardSettings', GuardSettingsSchema);
export const Whitelist = mongoose.models.Whitelist || mongoose.model('Whitelist', WhitelistSchema);
export const GuardLog = mongoose.models.GuardLog || mongoose.model('GuardLog', GuardLogSchema);
