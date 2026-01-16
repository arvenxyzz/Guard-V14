import Link from 'next/link';
import { useRouter } from 'next/router';
import { Shield, Settings, Users, FileText, Home, Activity, LogOut, Server, Lock, BarChart3, Zap, AlertTriangle, X } from 'lucide-react';

const menuItems = [
  { name: 'Ana Sayfa', href: '/', icon: Home, badge: null, gradient: 'from-blue-600 to-blue-800', iconBg: 'from-blue-500/20 to-cyan-500/20', activeBorder: 'border-blue-500/50' },
  { name: 'Koruma Ayarları', href: '/settings', icon: Shield, badge: null, gradient: 'from-purple-600 to-purple-800', iconBg: 'from-purple-500/20 to-pink-500/20', activeBorder: 'border-purple-500/50' },
  { name: 'Güvenli Liste', href: '/whitelist', icon: Lock, badge: null, gradient: 'from-emerald-600 to-emerald-800', iconBg: 'from-emerald-500/20 to-teal-500/20', activeBorder: 'border-emerald-500/50' },
  { name: 'Log Kayıtları', href: '/logs', icon: FileText, badge: null, gradient: 'from-amber-600 to-amber-800', iconBg: 'from-amber-500/20 to-orange-500/20', activeBorder: 'border-amber-500/50' },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      
      <aside 
        className={`fixed lg:static left-0 top-0 h-screen lg:h-auto w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 z-50 backdrop-blur-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        <div className="p-8 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                GUARD
              </h1>
              <p className="text-sm text-gray-400 font-medium">Security System</p>
            </div>
            <button 
              className="lg:hidden ml-auto p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              onClick={toggleSidebar}
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>
        </div>

        <nav className="p-6 space-y-3">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border ${isActive 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-current/25 ${item.activeBorder}` 
                  : 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white hover:shadow-lg hover:shadow-gray-700/25'}`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <div className={`p-3 rounded-xl transition-all duration-300 bg-gradient-to-r ${isActive 
                  ? `${item.iconBg} text-white` 
                  : 'bg-gray-700/30 group-hover:bg-gray-600/30 text-gray-400 group-hover:text-white'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">{item.name}</span>
                <div className={`ml-auto transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-500'}`}></div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700/50 bg-gradient-to-t from-gray-800/80 to-transparent backdrop-blur-sm">
          <div className="rounded-2xl p-5 bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/50 backdrop-blur-sm shadow-xl shadow-gray-900/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-md opacity-30"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Sistem Durumu</p>
                <p className="text-emerald-400 text-xs font-medium">Tüm Koruma Aktif</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600/30 hover:to-rose-600/30 transition-all text-red-400 border border-red-500/30 font-medium shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
