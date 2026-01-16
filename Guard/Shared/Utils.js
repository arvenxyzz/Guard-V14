const config = require('../../DevCode.json');
const { Whitelist, GuardSettings } = require('../../Schemas');

function isOwner(userID) {
    return config.ownerIDs.includes(userID);
}

async function isShieldEnabled(guildID, shieldType) {
    const settings = await GuardSettings.findOne({ guildID: guildID });
    if (!settings) return true;
    return settings[shieldType] !== false;
}

function isProtectedGuild(guildID) {
    return guildID === config.guildID;
}

async function banUser(guild, userID, reason) {
    try {
        await guild.members.ban(userID, { reason: reason });
        return true;
    } catch (err) {
        console.error('[GUARD] Ban işlemi başarısız:', err);
        return false;
    }
}

async function checkWhitelist(guildID, member, category) {
    const userWl = await Whitelist.findOne({
        guildID: guildID,
        targetID: member.id,
        targetType: 'user',
        category: { $in: [category, 'full'] }
    });

    if (userWl && (userWl.limit === 0 || userWl.used < userWl.limit)) {
        return { whitelisted: true, doc: userWl };
    }

    const memberRoles = member.roles?.cache?.map(r => r.id) || [];
    for (const roleID of memberRoles) {
        const roleWl = await Whitelist.findOne({
            guildID: guildID,
            targetID: roleID,
            targetType: 'role',
            category: { $in: [category, 'full'] }
        });

        if (roleWl && (roleWl.limit === 0 || roleWl.used < roleWl.limit)) {
            return { whitelisted: true, doc: roleWl };
        }
    }

    return { whitelisted: false, doc: null };
}

async function useWhitelistLimit(doc) {
    if (!doc) return;
    doc.used += 1;
    await doc.save();
    return doc.limit === 0 ? 'Sınırsız' : `${doc.limit - doc.used}`;
}

module.exports = { isOwner, isProtectedGuild, banUser, checkWhitelist, useWhitelistLimit, isShieldEnabled };
