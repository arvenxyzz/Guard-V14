import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Shield, Save, RefreshCw, CheckCircle, XCircle, Zap, Users, Hash, Image, Sticker, Globe, Link, Hammer, Footprints } from 'lucide-react';

const shieldFields = [
  { field: 'roleShield', name: 'Rol Koruması', desc: 'Rol oluşturma, silme ve düzenleme işlemlerini korur', icon: Users },
  { field: 'channelShield', name: 'Kanal Koruması', desc: 'Kanal oluşturma, silme ve düzenleme işlemlerini korur', icon: Hash },
  { field: 'emojiShield', name: 'Emoji Koruması', desc: 'Emoji oluşturma, silme ve düzenleme işlemlerini korur', icon: Image },
  { field: 'stickerShield', name: 'Sticker Koruması', desc: 'Sticker oluşturma, silme ve düzenleme işlemlerini korur', icon: Sticker },
  { field: 'guildShield', name: 'Sunucu Koruması', desc: 'Sunucu ayarlarının değiştirilmesini korur', icon: Globe },
  { field: 'webhookShield', name: 'Webhook Koruması', desc: 'Webhook oluşturma ve silme işlemlerini korur', icon: Link },
  { field: 'banShield', name: 'Ban Koruması', desc: 'Yetkisiz ban işlemlerini engeller', icon: Hammer },
  { field: 'kickShield', name: 'Kick Koruması', desc: 'Yetkisiz kick işlemlerini engeller', icon: Footprints }
];

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Ayarlar yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleShield = async (field) => {
    const newValue = !settings[field];
    setSettings({ ...settings, [field]: newValue });
    
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Ayar güncellenemedi:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleAll = async (value) => {
    const updates = {};
    shieldFields.forEach(s => updates[s.field] = value);
    setSettings({ ...settings, ...updates });

    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Ayarlar güncellenemedi:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const activeCount = shieldFields.filter(s => settings[s.field]).length;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Koruma Ayarları</h1>
        <p className="text-gray-400 text-lg">Guard koruma sistemlerini yönetin</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Hızlı Ayarlar</h2>
              <p className="text-gray-400">Tüm korumaları tek tıklama ile yönetin</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toggleAll(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-medium hover:from-emerald-500/30 hover:to-teal-500/30 transition-all backdrop-blur-sm"
            >
              Hepsini Aç
            </button>
            <button
              onClick={() => toggleAll(false)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 font-medium hover:from-red-500/30 hover:to-rose-500/30 transition-all backdrop-blur-sm"
            >
              Hepsini Kapat
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 font-medium">Aktif Korumalar</span>
            <span className="text-white font-bold">{activeCount}/{shieldFields.length}</span>
          </div>
          <div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-700 ease-out"
              style={{ width: `${(activeCount / shieldFields.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shieldFields.map((shield) => {
          const isActive = settings[shield.field];
          const Icon = shield.icon;
          return (
            <div
              key={shield.field}
              className={`bg-gradient-to-br ${isActive ? 'from-blue-500/10 to-purple-500/10 border border-blue-500/30' : 'from-gray-700/30 to-gray-800/30 border border-gray-600/30'} rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              onClick={() => toggleShield(shield.field)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{shield.name}</h3>
                    <p className="text-gray-400 text-sm">{shield.desc}</p>
                  </div>
                </div>
                <div className={`relative w-14 h-8 rounded-full transition-all ${
                  isActive ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  <div className={`absolute inset-y-1 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isActive ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Aktif</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Pasif</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-6 right-6 flex items-center gap-3">
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Kaydedildi!</span>
          </div>
        )}
        {saving && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-blue-400 font-medium">Kaydediliyor...</span>
          </div>
        )}
      </div>
    </Layout>
  );
}

