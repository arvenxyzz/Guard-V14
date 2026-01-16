import connectDB from '../../lib/mongodb';
import { Whitelist } from '../../lib/models';

const GUILD_ID = '1457386138149847051';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const whitelist = await Whitelist.find({ guildID: GUILD_ID }).sort({ createdAt: -1 });
      res.status(200).json(whitelist);
    } catch (error) {
      res.status(500).json({ error: 'Whitelist yuklenemedi' });
    }
  } else if (req.method === 'POST') {
    try {
      const { targetID, targetType, category, limit } = req.body;
      const entry = await Whitelist.findOneAndUpdate(
        { guildID: GUILD_ID, targetID, category },
        {
          guildID: GUILD_ID,
          targetID,
          targetType,
          category,
          limit: limit || 0,
          used: 0
        },
        { new: true, upsert: true }
      );
      res.status(200).json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Whitelist eklenemedi' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await Whitelist.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Whitelist silinemedi' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
