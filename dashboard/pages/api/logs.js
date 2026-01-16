import connectDB from '../../lib/mongodb';
import { GuardLog } from '../../lib/models';

const GUILD_ID = '1457386138149847051';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        GuardLog.find({ guildID: GUILD_ID })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        GuardLog.countDocuments({ guildID: GUILD_ID })
      ]);

      res.status(200).json({ logs, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
      res.status(500).json({ error: 'Loglar yuklenemedi' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
