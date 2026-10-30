import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, PlusCircle, Activity, RefreshCw } from 'lucide-react';
import { useNetwork } from '../../features/context/NetworkContext';
import { useLanguage } from '../../features/context/LanguageContext';

export function MobileNav() {
  const { pendingReportsCount } = useNetwork();
  const { t, lang } = useLanguage();

  const items = [
    { to: '/', label: lang === 'tet' ? 'Vizaun' : 'Overview', icon: LayoutDashboard },
    { to: '/map', label: lang === 'tet' ? 'Mapa' : 'Map', icon: MapIcon },
    { to: '/reports/new', label: lang === 'tet' ? 'Kria' : 'New', icon: PlusCircle, special: true },
    { to: '/sitewatch', label: 'SiteWatch', icon: Activity },
    { to: '/sync', label: lang === 'tet' ? 'Sinc' : 'Sync', icon: RefreshCw, badge: pendingReportsCount }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B1F3A] border-t border-slate-700/80 px-2 py-1 shadow-lg flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 text-xs transition-colors relative ${
                item.special
                  ? 'text-[#F4B41A] font-bold'
                  : isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {item.special ? (
              <div className="w-10 h-10 -mt-5 rounded-full bg-[#D71920] text-white flex items-center justify-center shadow-md border-2 border-[#0B1F3A]">
                <Icon className="w-5 h-5" />
              </div>
            ) : (
              <Icon className="w-4 h-4 mb-0.5" />
            )}
            <span className="text-[10px] tracking-tight">{item.label}</span>
            {item.badge > 0 && !item.special && (
              <span className="absolute top-1 right-2 px-1 text-[9px] font-bold bg-[#D71920] text-white rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileNav;
