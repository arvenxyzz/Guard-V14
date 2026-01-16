import connectDB from '../../lib/mongodb';
import { GuardSettings } from '../../lib/models';

const GUILD_ID = '1457386138149847051';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      let settings = await GuardSettings.findOne({ guildID: GUILD_ID });
      if (!settings) {
        settings = await GuardSettings.create({ guildID: GUILD_ID });
      }
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Ayarlar yuklenemedi' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      const settings = await GuardSettings.findOneAndUpdate(
        { guildID: GUILD_ID },
        { ...updates, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Ayarlar guncellenemedi' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
