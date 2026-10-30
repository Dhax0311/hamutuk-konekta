import React from 'react';
import { Menu, Wifi, WifiOff, Globe, RefreshCw, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../features/context/AuthContext';
import { useNetwork } from '../../features/context/NetworkContext';
import { useLanguage } from '../../features/context/LanguageContext';

export function Header({ toggleMobileSidebar, isCollapsed = false, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const { isOnline, isSimulatedOffline, toggleSimulationMode, pendingReportsCount, lastSyncTime, isSyncing, triggerSync } = useNetwork();
  const { lang, toggleLanguage } = useLanguage();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'ADMIN';
      case 'MUNICIPAL_COORDINATOR': return 'KORDENADOR';
      case 'SUCO_OFFICER': return 'OFISIAL SUKU';
      default: return 'OPERADOR';
    }
  };

  return (
    <header className="bg-[#0B1F3A]/95 backdrop-blur-md text-white border-b border-slate-700/60 sticky top-0 z-40 shadow-sm h-16 shrink-0 transition-all">
      <div className="w-full px-3 sm:px-5 lg:px-6 h-full flex items-center justify-between gap-3">
        {/* Left: ONE Single Sidebar Toggle & Operational Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-200 hover:bg-white/10 cursor-pointer focus:outline-none"
            aria-label="Loke menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop/Laptop ONE Single Sidebar Toggle (Collapse / Expand) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            title={isCollapsed ? 'Habelar Menu (Expand Sidebar)' : 'Hakotu Menu (Collapse Sidebar)'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          {/* Mobile Logo with uploaded public asset */}
          <div className="flex items-center gap-2 lg:hidden">
            <img src="/hamutuk.png" alt="HAMUTUK" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
            <span className="font-extrabold text-white tracking-tight">HAMUTUK</span>
          </div>

          {/* Desktop Operational Banner Context focused on Viqueque */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-100 font-semibold tracking-wide truncate max-w-[480px] xl:max-w-none">
                {lang === 'tet'
                  ? 'Painél Koordinasaun Dezastre & Resiliénsia — Munisípiu Viqueque'
                  : 'Disaster Coordination & Network Resilience — Viqueque Municipality'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Network status simulation pill */}
          <button
            type="button"
            onClick={toggleSimulationMode}
            title={lang === 'tet' ? 'Klike hodi troka simulasaun rede online/offline' : 'Click to toggle network simulation'}
            className={`hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full cursor-pointer border transition-all ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40 hover:bg-rose-900/80 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
            <span className="font-bold">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            {isSimulatedOffline && <span className="text-[9px] bg-white/20 px-1 rounded font-mono font-bold">SIM</span>}
          </button>

          {/* Quick sync button */}
          <button
            type="button"
            disabled={!isOnline || isSyncing}
            onClick={triggerSync}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-bold ${
              pendingReportsCount > 0
                ? 'bg-[#F4B41A] hover:bg-amber-500 text-slate-950 cursor-pointer shadow-md animate-bounce'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 cursor-pointer'
            } disabled:opacity-40 disabled:pointer-events-none`}
            title={`Last sync: ${lastSyncTime}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">
              {isSyncing ? (lang === 'tet' ? 'Sincroniza...' : 'Syncing...') : (lang === 'tet' ? 'Sincroniza' : 'Sync Now')}
            </span>
            {pendingReportsCount > 0 && (
              <span className="bg-[#D71920] text-white font-black text-[10px] px-1.5 py-0.2 rounded-full shadow-xs">
                {pendingReportsCount}
              </span>
            )}
          </button>

          {/* Language toggle Tetum / English */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer transition-colors"
            title="Troka Lian / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* User profile dropdown / chip */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
              <div className="hidden xl:block text-right">
                <p className="text-xs font-bold text-slate-100 truncate max-w-[130px]">{user.name}</p>
                <p className="text-[10px] text-amber-300 font-mono">{getRoleLabel(user.role)}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                title={lang === 'tet' ? 'Sai husi konta' : 'Sign out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
