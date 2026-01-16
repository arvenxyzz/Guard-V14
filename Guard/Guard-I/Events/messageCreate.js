const config = require('../../../DevCode.json');
const { isOwner } = require('../../Shared/Utils');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        if (!message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!isOwner(message.author.id)) {
            return;
        }

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (err) {
            console.error('[GUARD-I] Komut hatası:', err);
        }
    }
};
