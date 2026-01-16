const { GuildBackup } = require('../../Schemas');
const config = require('../../DevCode.json');

async function createBackup(guild, isAuto = false) {
    const channels = guild.channels.cache
        .filter(c => c.type !== 4)
        .map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            parentID: channel.parentId,
            position: channel.position,
            topic: channel.topic || null,
            nsfw: channel.nsfw || false,
            rateLimitPerUser: channel.rateLimitPerUser || 0,
            bitrate: channel.bitrate || null,
            userLimit: channel.userLimit || null,
            permissionOverwrites: channel.permissionOverwrites.cache.map(perm => ({
                id: perm.id,
                type: perm.type,
                allow: perm.allow.bitfield.toString(),
                deny: perm.deny.bitfield.toString()
            }))
        }));

    const categories = guild.channels.cache
        .filter(c => c.type === 4)
        .map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            parentID: null,
            position: channel.position,
            topic: null,
            nsfw: false,
            rateLimitPerUser: 0,
            bitrate: null,
            userLimit: null,
            permissionOverwrites: channel.permissionOverwrites.cache.map(perm => ({
                id: perm.id,
                type: perm.type,
                allow: perm.allow.bitfield.toString(),
                deny: perm.deny.bitfield.toString()
            }))
        }));

    const allChannels = [...categories, ...channels];

    const roles = await Promise.all(
        guild.roles.cache
            .filter(r => r.id !== guild.id)
            .map(async role => {
                const members = role.members.map(m => m.id);
                return {
                    id: role.id,
                    name: role.name,
                    color: role.color,
                    permissions: role.permissions.bitfield.toString(),
                    position: role.position,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    members: members
                };
            })
    );

    const backup = await GuildBackup.findOneAndUpdate(
        { guildID: guild.id, isAuto: isAuto },
        {
            guildID: guild.id,
            channels: allChannels,
            roles: roles,
            updatedAt: new Date(),
            isAuto: isAuto
        },
        { upsert: true, new: true }
    );

    return backup;
}

async function getBackup(guildID) {
    return await GuildBackup.findOne({ guildID: guildID }).sort({ updatedAt: -1 });
}

async function getChannelBackup(guildID, channelID) {
    const backup = await getBackup(guildID);
    if (!backup) return null;
    return backup.channels.find(c => c.id === channelID);
}

async function getRoleBackup(guildID, roleID) {
    const backup = await getBackup(guildID);
    if (!backup) return null;
    return backup.roles.find(r => r.id === roleID);
}

async function restoreChannel(guild, channelData) {
    try {
        const { ChannelType, PermissionsBitField } = require('discord.js');
        
        let parent = null;
        if (channelData.parentID) {
            parent = guild.channels.cache.get(channelData.parentID);
        }

        const permissionOverwrites = channelData.permissionOverwrites.map(perm => ({
            id: perm.id,
            type: perm.type,
            allow: new PermissionsBitField(BigInt(perm.allow)),
            deny: new PermissionsBitField(BigInt(perm.deny))
        }));

        const options = {
            name: channelData.name,
            type: channelData.type,
            parent: parent,
            position: channelData.position,
            permissionOverwrites: permissionOverwrites
        };

        if (channelData.topic) options.topic = channelData.topic;
        if (channelData.nsfw) options.nsfw = channelData.nsfw;
        if (channelData.rateLimitPerUser) options.rateLimitPerUser = channelData.rateLimitPerUser;
        if (channelData.bitrate) options.bitrate = channelData.bitrate;
        if (channelData.userLimit) options.userLimit = channelData.userLimit;

        const newChannel = await guild.channels.create(options);
        return newChannel;
    } catch (err) {
        console.error('[BACKUP] Kanal geri yükleme hatası:', err);
        return null;
    }
}

async function restoreRole(guild, roleData) {
    try {
        const { PermissionsBitField } = require('discord.js');

        const newRole = await guild.roles.create({
            name: roleData.name,
            color: roleData.color,
            permissions: new PermissionsBitField(BigInt(roleData.permissions)),
            hoist: roleData.hoist,
            mentionable: roleData.mentionable,
            position: roleData.position
        });

        const backup = await getBackup(guild.id);
        if (backup && backup.channels) {
            for (const channelData of backup.channels) {
                const channel = guild.channels.cache.get(channelData.id);
                if (!channel) continue;

                const oldRolePerm = channelData.permissionOverwrites.find(p => p.id === roleData.id);
                if (oldRolePerm) {
                    try {
                        const allowBits = BigInt(oldRolePerm.allow);
                        const denyBits = BigInt(oldRolePerm.deny);
                        
                        await channel.permissionOverwrites.set([
                            ...channel.permissionOverwrites.cache.map(p => ({
                                id: p.id,
                                allow: p.allow.bitfield,
                                deny: p.deny.bitfield
                            })),
                            {
                                id: newRole.id,
                                allow: allowBits,
                                deny: denyBits
                            }
                        ]);
                        console.log(`[BACKUP] ${channel.name} kanalına ${newRole.name} rolü izinleri eklendi.`);
                    } catch (e) {
                        console.error('[BACKUP] Kanal izni geri yükleme hatası:', e.message);
                    }
                }
            }
        }

        if (roleData.members && roleData.members.length > 0) {
            for (const memberID of roleData.members) {
                try {
                    const member = await guild.members.fetch(memberID).catch(() => null);
                    if (member) {
                        await member.roles.add(newRole);
                    }
                } catch (e) {}
            }
        }

        return newRole;
    } catch (err) {
        console.error('[BACKUP] Rol geri yükleme hatası:', err);
        return null;
    }
}

async function deleteAllBackups(guildID) {
    return await GuildBackup.deleteMany({ guildID: guildID });
}

async function listBackups(guildID) {
    return await GuildBackup.find({ guildID: guildID }).sort({ updatedAt: -1 });
}

module.exports = {
    createBackup,
    getBackup,
    getChannelBackup,
    getRoleBackup,
    restoreChannel,
    restoreRole,
    deleteAllBackups,
    listBackups
};
