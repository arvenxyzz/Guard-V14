import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Users, Plus, Trash2, Search, Filter, User, Shield, Lock, Hash, Image, Sticker, Globe, Link, Hammer, Footprints, Maximize2, Minimize2 } from 'lucide-react';

const categories = [
  { value: 'full', label: 'Full Güvenli', icon: Lock, color: 'from-purple-500 to-pink-500' },
  { value: 'channel', label: 'Kanal', icon: Hash, color: 'from-blue-500 to-cyan-500' },
  { value: 'role', label: 'Rol', icon: Users, color: 'from-red-500 to-rose-500' },
  { value: 'emoji', label: 'Emoji', icon: Image, color: 'from-yellow-500 to-orange-500' },
  { value: 'sticker', label: 'Sticker', icon: Sticker, color: 'from-green-500 to-emerald-500' },
  { value: 'server', label: 'Sunucu', icon: Globe, color: 'from-indigo-500 to-blue-500' },
  { value: 'webhook', label: 'Webhook', icon: Link, color: 'from-gray-500 to-slate-500' },
  { value: 'ban', label: 'Ban', icon: Hammer, color: 'from-orange-500 to-red-500' },
  { value: 'kick', label: 'Kick', icon: Footprints, color: 'from-amber-500 to-yellow-500' }
];

export default function Whitelist() {
  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    targetID: '',
    targetType: 'user',
    category: 'full',
    limit: 0
  });

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const fetchWhitelist = async () => {
    try {
      const res = await fetch('/api/whitelist');
      const data = await res.json();
      setWhitelist(data);
    } catch (err) {
      console.error('Whitelist yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    try {
      await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      setFormData({ targetID: '', targetType: 'user', category: 'full', limit: 0 });
      fetchWhitelist();
    } catch (err) {
      console.error('Eklenemedi:', err);
    }
  };

  const deleteEntry = async (id) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    try {
      await fetch('/api/whitelist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchWhitelist();
    } catch (err) {
      console.error('Silinemedi:', err);
    }
  };

  const filteredList = whitelist.filter(entry => {
    const matchesSearch = entry.targetID.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryInfo = (cat) => categories.find(c => c.value === cat) || { label: cat, icon: Lock, color: 'from-gray-500 to-slate-500' };

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Güvenli Liste</h1>
        <p className="text-gray-400 text-lg">Güvenli listedeki kullanıcı ve rolleri yönetin</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="ID ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Yeni Ekle
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-4 p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-b border-gray-600/50 text-gray-300 text-sm font-medium">
          <div className="col-span-4">Hedef</div>
          <div className="col-span-2">Tür</div>
          <div className="col-span-3">Kategori</div>
          <div className="col-span-2">Limit</div>
          <div className="col-span-1">İşlemler</div>
        </div>

        {filteredList.length > 0 ? (
          <div className="divide-y divide-gray-700/50">
            {filteredList.map((entry) => {
              const catInfo = getCategoryInfo(entry.category);
              const Icon = catInfo.icon;
              const isExpanded = expandedId === entry._id;
              
              return (
                <div key={entry._id} className="hover:bg-gray-700/20 transition-all">
                  <div className="grid grid-cols-12 gap-4 p-6 items-center">
                    <div className="col-span-4 font-mono text-white break-all">{entry.targetID}</div>
                    <div className="col-span-2 flex items-center gap-2">
                      {entry.targetType === 'user' ? (
                        <User className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Shield className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-gray-300">{entry.targetType === 'user' ? 'Kullanıcı' : 'Rol'}</span>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${catInfo.color} flex items-center justify-center text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-gray-200 font-medium">{catInfo.label}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-gray-300">
                      {entry.limit === 0 ? (
                        <span className="text-emerald-400 font-medium">Sınırsız</span>
                      ) : (
                        <span className="text-amber-400">{entry.used}/{entry.limit}</span>
                      )}
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : entry._id)}
                        className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white transition-all"
                      >
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteEntry(entry._id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pl-14">
                      <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Eklenme Tarihi</span>
                            <p className="text-gray-300">{new Date(entry.addedAt).toLocaleString('tr-TR')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Ekleyen</span>
                            <p className="text-gray-300">{entry.addedBy}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <p className="text-xl mb-2">Güvenli listede kayıt bulunamadı</p>
            <p className="text-gray-600">Henüz güvenli listeye eklenmiş bir kullanıcı ya da rol yok</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-400" />
              Güvenli Listeye Ekle
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Hedef ID</label>
                <input
                  type="text"
                  value={formData.targetID}
                  onChange={(e) => setFormData({ ...formData, targetID: e.target.value })}
                  placeholder="Kullanıcı veya Rol ID"
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Tür</label>
                <select
                  value={formData.targetType}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="role">Rol</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                >
                  {categories.map(cat => {
                    const CatIcon = cat.icon;
                    return (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">Limit (0 = Sınırsız)</label>
                <input
                  type="number"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-all border border-gray-600"
              >
                İptal
              </button>
              <button
                onClick={addEntry}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

