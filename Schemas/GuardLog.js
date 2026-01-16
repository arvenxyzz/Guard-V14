const mongoose = require('mongoose');

const GuardLogSchema = new mongoose.Schema({
    guildID: { type: String, required: true },
    executorID: { type: String, required: true },
    executorTag: { type: String, required: true },
    action: { type: String, required: true },
    targetName: { type: String },
    targetID: { type: String },
    punishment: { type: String },
    reason: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GuardLog', GuardLogSchema);
