const mongoose = require('mongoose');
const config = require('../../DevCode.json');

async function connect() {
    try {
        await mongoose.connect(config.mongoURL);
        console.log('[DATABASE] MongoDB bağlantısı başarılı.');
    } catch (err) {
        console.error('[DATABASE] MongoDB bağlantı hatası:', err);
        process.exit(1);
    }
}

module.exports = { connect };
