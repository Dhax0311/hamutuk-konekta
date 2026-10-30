import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  FileWarning,
  PlusCircle,
  HelpingHand,
  Activity,
  AlertOctagon,
  RefreshCw,
  Users,
  Settings,
  X,
  Radio,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../features/context/AuthContext';
import { useNetwork } from '../../features/context/NetworkContext';
import { useLanguage } from '../../features/context/LanguageContext';

export function Sidebar({ isOpen, onClose, isCollapsed = false }) {
  const { user, isAdmin } = useAuth();
  const { isOnline, pendingReportsCount, lastSyncTime } = useNetwork();
  const { t, lang } = useLanguage();

  const navLinks = [
    { to: '/', label: t('navOverview') || (lang === 'tet' ? 'Vizaun Jerál' : 'Overview Dashboard'), icon: LayoutDashboard },
    { to: '/map', label: lang === 'tet' ? 'Mapa Dezastre' : 'Disaster Map', icon: MapIcon },
    { to: '/reports', label: t('navReports') || (lang === 'tet' ? 'Relatóriu Suku' : 'Incident Reports'), icon: FileWarning },
    { to: '/reports/new', label: t('navCreateReport') || (lang === 'tet' ? 'Rejistu Foun' : 'Report Emergency'), icon: PlusCircle, highlight: true },
    { to: '/needs', label: t('navNeeds') || (lang === 'tet' ? 'Nesesidade Komunidade' : 'Community Needs'), icon: HelpingHand },
    { to: '/sitewatch', label: t('navSiteWatch') || 'SiteWatch Telemetry', icon: Activity }, // SIM badge removed as requested
    { to: '/warnings', label: t('navWarnings') || (lang === 'tet' ? 'Avizu Ofisiál' : 'Official Warnings'), icon: AlertOctagon },
    {
      to: '/sync',
      label: t('navSyncQueue') || (lang === 'tet' ? 'Fila Sincroniza' : 'Offline Sync Queue'),
      icon: RefreshCw,
      counter: pendingReportsCount
    },
    ...(isAdmin ? [{ to: '/users', label: t('navUsers') || 'User Management', icon: Users, adminOnly: true }] : []),
    { to: '/settings', label: t('navSettings') || (lang === 'tet' ? 'Konfigurasaun' : 'Settings'), icon: Settings }
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container: Sticky full-height on Desktop / Laptop, Slide Drawer on Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#0B1F3A] text-slate-200 border-r border-slate-800/80 flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30 shrink-0 select-none ${
          isOpen ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full lg:shadow-none'
        } ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64 xl:w-72'
        }`}
      >
        {/* Brand Header with Uploaded Public Logo */}
        <div className={`h-16 border-b border-slate-800 flex items-center bg-[#071528] shrink-0 transition-all ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4 sm:px-5'
        }`}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src="/hamutuk.png"
              alt="HAMUTUK Logo"
              className="w-10 h-10 object-contain rounded-xl shrink-0 cursor-pointer drop-shadow-sm"
              title="HAMUTUK 2.0 — Viqueque Resilience"
            />

            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="font-black text-base text-white tracking-tight leading-tight">
                  <span>HAMUTUK</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
                  VIQUEQUE RESILIENCE
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
            aria-label="Taka menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className={`shrink-0 transition-all ${
          isCollapsed ? 'py-3 px-2 flex justify-center' : 'p-2.5 mx-3 my-2 rounded-xl bg-white/5 border border-white/10'
        }`}>
          {isCollapsed ? (
            <div
              className="w-9 h-9 rounded-xl bg-[#F4B41A]/20 text-[#F4B41A] flex items-center justify-center font-bold text-xs border border-[#F4B41A]/40 shrink-0 cursor-default shadow-xs"
              title={`${user?.name || 'Operadór Suku'} (${user?.role || 'SUCO_OFFICER'})`}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F4B41A]/20 text-[#F4B41A] flex items-center justify-center font-bold text-xs border border-[#F4B41A]/40 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Operadór Suku'}</p>
                <p className="text-[10px] text-amber-300 font-mono tracking-wide truncate">{user?.role || 'SUCO_OFFICER'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links with Sleek Custom Scrollbar */}
        <nav className={`flex-1 overflow-y-auto sidebar-scroll space-y-1 transition-all ${
          isCollapsed ? 'px-2 py-1' : 'px-3 py-1'
        }`}>
          {!isCollapsed && (
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 pt-1 pb-1">
              Menu Operasional
            </div>
          )}
          {isCollapsed && (
            <div className="border-t border-slate-800/80 my-1 mx-2"></div>
          )}

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                title={isCollapsed ? item.label : undefined}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-xs sm:text-[13px] font-semibold transition-all group relative ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-[#162C4E] text-white shadow-xs border-l-4 border-[#F4B41A]'
                      : item.highlight
                      ? 'bg-red-950/30 text-amber-300 border border-amber-400/20 hover:bg-red-900/40'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      item.highlight ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {/* Badges / Counters */}
                {isCollapsed ? (
                  item.counter > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D71920] rounded-full border border-[#0B1F3A] animate-pulse" />
                  )
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.counter > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-black bg-[#D71920] text-white rounded-full shadow-sm animate-pulse">
                        {item.counter}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Network Resilience Status Footer */}
        <div className={`shrink-0 transition-all border-t border-slate-800 ${
          isCollapsed ? 'p-2 flex flex-col items-center gap-2 bg-[#071528]' : 'p-3 m-3 rounded-xl bg-[#071528] border border-slate-800 text-xs space-y-1.5'
        }`}>
          {isCollapsed ? (
            <div
              className="p-2 rounded-lg bg-white/5 flex flex-col items-center gap-1 cursor-default"
              title={`${isOnline ? 'Connected Online' : 'Offline Local Mode'} | Sync: ${lastSyncTime || 'Ready'}`}
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}></span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">
                {isOnline ? 'ON' : 'OFF'}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                  STATUS APARELLU
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}></span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-200">
                {isOnline ? (
                  <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span className="font-bold text-xs truncate">
                  {isOnline
                    ? (lang === 'tet' ? 'Ligadu (Online)' : 'Connected Online')
                    : (lang === 'tet' ? 'Modu Offline Lokál' : 'Offline Local Mode')}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-0.5 truncate">
                Sync: {lastSyncTime ? lastSyncTime.split(' ')[1] || lastSyncTime : 'Ready'}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
