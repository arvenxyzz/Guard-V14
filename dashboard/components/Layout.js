import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, X, Bell, User, Search, Activity } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Set initial time and update every second
    setCurrentTime(new Date().toLocaleTimeString('tr-TR'));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('tr-TR'));
    }, 1000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(timer);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>
      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col transition-all duration-300 relative z-10">
        {/* Mobile header */}
        <header className="lg:hidden p-4 bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">Guard Dashboard</h1>
          <div className="w-10"></div>
        </header>
        
        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between p-6 bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/30">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-30"></div>
              <div className="relative flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-600/50">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Arama..."
                  className="bg-transparent text-white placeholder-gray-400 outline-none w-64"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-md opacity-30"></div>
              <div className="relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-600/50">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Aktif</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-30"></div>
              <div className="relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-600/50">
                <span className="text-white text-sm font-medium">
                  {currentTime || '00:00:00'}
                </span>
              </div>
            </div>
            
            <button className="p-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-colors border border-gray-600/50 relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              <Bell className="w-5 h-5 text-gray-300" />
            </button>
            
            <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-700/50 border border-gray-600/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Admin</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 bg-transparent overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
