import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FileText, Search, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Calendar, User, Target, Clock, Ban, Shield, Hash, Users, Image, Sticker, Globe, Link, Footprints, Hammer } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logs?page=${page}&limit=20`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Loglar yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    return (
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.executorTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getActionIcon = (action) => {
    if (action?.includes('Rol')) return Shield;
    if (action?.includes('Kanal')) return Hash;
    if (action?.includes('Emoji')) return Image;
    if (action?.includes('Sticker')) return Sticker;
    if (action?.includes('Sunucu')) return Globe;
    if (action?.includes('Webhook')) return Link;
    if (action?.includes('Ban')) return Ban;
    if (action?.includes('Kick')) return Footprints;
    return FileText;
  };

  const getActionColor = (action) => {
    if (action?.includes('Silme') || action?.includes('Ban')) return 'text-red-400';
    if (action?.includes('Olusturma')) return 'text-emerald-400';
    if (action?.includes('Duzenleme') || action?.includes('Guncelleme')) return 'text-amber-400';
    return 'text-blue-400';
  };

  const getActionGradient = (action) => {
    if (action?.includes('Silme') || action?.includes('Ban')) return 'from-red-500/20 to-rose-500/20';
    if (action?.includes('Olusturma')) return 'from-emerald-500/20 to-teal-500/20';
    if (action?.includes('Duzenleme') || action?.includes('Guncelleme')) return 'from-amber-500/20 to-orange-500/20';
    return 'from-blue-500/20 to-purple-500/20';
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Log Kayıtları</h1>
        <p className="text-gray-400 text-lg">Toplam {total} log kaydı</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="İşlem, kullanıcı veya hedef ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button
            onClick={fetchLogs}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredLogs.length > 0 ? (
        <>
          <div className="space-y-6">
            {filteredLogs.map((log, index) => {
              const ActionIcon = getActionIcon(log.action);
              
              return (
                <div
                  key={log._id || index}
                  className={`bg-gradient-to-br ${getActionGradient(log.action)} border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${log.action?.includes('Silme') || log.action?.includes('Ban') ? 'from-red-500 to-rose-600' : log.action?.includes('Olusturma') ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-purple-600'} flex items-center justify-center text-white shadow-lg`}>
                        <ActionIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${getActionColor(log.action)}`}>
                          {log.action}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(log.createdAt).toLocaleString('tr-TR')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(log.createdAt).toLocaleTimeString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {log.punishment && (
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-sm font-medium backdrop-blur-sm">
                        {log.punishment}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/50 rounded-xl p-5 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3 text-gray-400">
                        <User className="w-5 h-5" />
                        <span className="font-medium text-gray-300">Yetkili</span>
                      </div>
                      <p className="text-white font-medium text-lg">{log.executorTag || 'Bilinmiyor'}</p>
                      <p className="text-gray-500 text-sm font-mono mt-2">{log.executorID}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/50 rounded-xl p-5 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3 text-gray-400">
                        <Target className="w-5 h-5" />
                        <span className="font-medium text-gray-300">Hedef</span>
                      </div>
                      <p className="text-white font-medium text-lg">{log.targetName || 'Bilinmiyor'}</p>
                      <p className="text-gray-500 text-sm font-mono mt-2">{log.targetID || 'N/A'}</p>
                    </div>
                  </div>

                  {log.reason && (
                    <div className="mt-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/50 rounded-xl p-5 backdrop-blur-sm">
                      <span className="text-gray-400 text-sm font-medium">Sebep: </span>
                      <span className="text-gray-300">{log.reason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-600/50 hover:to-gray-700/50 transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              Önceki
            </button>
            <span className="text-gray-400 text-lg font-medium px-4 py-2">
              Sayfa {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-600/50 hover:to-gray-700/50 transition-all backdrop-blur-sm"
            >
              Sonraki
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-16 text-center backdrop-blur-sm">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-gray-500 opacity-50" />
          <p className="text-2xl text-gray-400 mb-2">Log kaydı bulunamadı</p>
          <p className="text-gray-600 text-lg">Henüz herhangi bir guard işlemi gerçekleşmedi</p>
        </div>
      )}
    </Layout>
  );
}

