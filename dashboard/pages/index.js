import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Shield, Users, FileText, Activity, TrendingUp, AlertTriangle, CheckCircle, XCircle, BarChart3, Zap, Globe, Lock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    whitelistCount: 0,
    activeShields: 0,
    totalShields: 8
  });
  const [settings, setSettings] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, logsRes, whitelistRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/logs?limit=5'),
        fetch('/api/whitelist')
      ]);

      const settingsData = await settingsRes.json();
      const logsData = await logsRes.json();
      const whitelistData = await whitelistRes.json();

      setSettings(settingsData);
      setRecentLogs(logsData.logs || []);

      const shieldFields = ['roleShield', 'channelShield', 'emojiShield', 'stickerShield', 'guildShield', 'webhookShield', 'banShield', 'kickShield'];
      const activeCount = shieldFields.filter(f => settingsData[f]).length;

      setStats({
        totalLogs: logsData.total || 0,
        whitelistCount: whitelistData.length || 0,
        activeShields: activeCount,
        totalShields: 8
      });
    } catch (err) {
      console.error('Veri yuklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Aktif Korumalar',
      value: `${stats.activeShields}/${stats.totalShields}`,
      icon: Shield,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-500/10 to-purple-600/10',
      border: 'border-blue-500/30'
    },
    {
      title: 'Güvenli Liste',
      value: stats.whitelistCount,
      icon: Lock,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/10 to-teal-600/10',
      border: 'border-emerald-500/30'
    },
    {
      title: 'Toplam Log',
      value: stats.totalLogs,
      icon: FileText,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 to-orange-600/10',
      border: 'border-amber-500/30'
    },
    {
      title: 'Sistem Durumu',
      value: 'Aktif',
      icon: Activity,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
      border: 'border-green-500/30'
    }
  ];

  const shieldStatus = settings ? [
    { name: 'Rol Koruması', icon: Users, active: settings.roleShield },
    { name: 'Kanal Koruması', icon: Globe, active: settings.channelShield },
    { name: 'Emoji Koruması', icon: AlertTriangle, active: settings.emojiShield },
    { name: 'Sticker Koruması', icon: BarChart3, active: settings.stickerShield },
    { name: 'Sunucu Koruması', icon: Zap, active: settings.guildShield },
    { name: 'Webhook Koruması', icon: Lock, active: settings.webhookShield },
    { name: 'Ban Koruması', icon: XCircle, active: settings.banShield },
    { name: 'Kick Koruması', icon: Shield, active: settings.kickShield }
  ] : [];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Ana Panel</h1>
        <p className="text-gray-400 text-lg">Guard Security Sistemine Hoş Geldiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.bgGradient} border ${card.border} rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg shadow-blue-500/30`}>
                  <Icon className="w-7 h-7" />
                </div>
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-gray-300 text-base mb-1 font-medium">{card.title}</h3>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            Korumalar
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {shieldStatus.map((shield, index) => {
              const Icon = shield.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl backdrop-blur-sm transition-all ${
                    shield.active
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      shield.active
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-200 font-medium text-sm">{shield.name}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    {shield.active ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-xs font-medium">Aktif</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-red-400 text-xs font-medium">Pasif</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            Son İşlemler
          </h2>
          <div className="space-y-4">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/30 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium text-sm ${log.action.includes('Silme') || log.action.includes('Ban') ? 'text-red-400' : log.action.includes('Olusturma') ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {log.action}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {log.executorTag} - {log.targetName || 'Bilinmiyor'}
                  </p>
                  {log.punishment && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30">
                      {log.punishment}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Herhangi bir kayıt bulunamadı</p>
                <p className="text-sm mt-1">Sistem henüz herhangi bir işlem kaydetmedi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
