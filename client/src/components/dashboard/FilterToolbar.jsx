import React, { useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { VIQUEQUE_POSTOS, ALL_VIQUEQUE_SUCOS } from '../../data/timorLesteLocations';

export default function FilterToolbar({
  filters = {},
  onChange,
  onReset,
  totalMatching = 0
}) {
  // Available Sucos based on selected Posto (or all 35 sucos in Viqueque)
  const availableSucos = useMemo(() => {
    if (!filters.posto || filters.posto === 'all') {
      return ALL_VIQUEQUE_SUCOS;
    }
    const posto = VIQUEQUE_POSTOS.find(
      p => p.name.toLowerCase() === filters.posto.toLowerCase()
    );
    return posto ? posto.sucos : [];
  }, [filters.posto]);

  // Available Aldeias based on selected Suco and/or Posto
  const availableAldeias = useMemo(() => {
    if (filters.suco && filters.suco !== 'all') {
      const foundSuco = availableSucos.find(
        s => s.name.toLowerCase() === filters.suco.toLowerCase()
      );
      return foundSuco && foundSuco.aldeias ? foundSuco.aldeias : [];
    }
    // If no specific suco chosen, collect all aldeias in current available sucos
    const set = new Set();
    availableSucos.forEach(s => {
      if (s.aldeias) s.aldeias.forEach(a => set.add(a));
    });
    return Array.from(set).sort();
  }, [availableSucos, filters.suco]);

  const handlePostoChange = (e) => {
    const val = e.target.value;
    onChange({
      ...filters,
      municipality: 'Viqueque',
      posto: val,
      suco: 'all',
      aldeia: 'all'
    });
  };

  const handleSucoChange = (e) => {
    const val = e.target.value;
    onChange({
      ...filters,
      suco: val,
      aldeia: 'all'
    });
  };

  const handleAldeiaChange = (e) => {
    const val = e.target.value;
    onChange({
      ...filters,
      aldeia: val
    });
  };

  const hasActiveFilters = 
    (filters.searchQuery && filters.searchQuery.trim() !== '') ||
    (filters.posto && filters.posto !== 'all') ||
    (filters.suco && filters.suco !== 'all') ||
    (filters.aldeia && filters.aldeia !== 'all') ||
    (filters.category && filters.category !== 'all') ||
    (filters.priority && filters.priority !== 'all') ||
    (filters.verificationStatus && filters.verificationStatus !== 'all') ||
    (filters.timeRange && filters.timeRange !== 'all') ||
    (filters.siteWatchStatus && filters.siteWatchStatus !== 'all');

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
      {/* Top Search & Reset Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Report ID (e.g. HMT-2026-0101), suco, aldeia, posto, or keywords..."
            value={filters.searchQuery || ''}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0B1F3A] focus:outline-none"
          />
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            Showing <strong>{totalMatching}</strong> reports in <strong>Viqueque</strong>
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1 text-xs text-[#D71920] hover:text-red-800 font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Criteria Filter Dropdowns focused on Viqueque */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 border-t border-gray-100 text-xs">
        {/* 1. Time Window */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">Time Window</label>
          <select
            value={filters.timeRange || 'all'}
            onChange={(e) => onChange({ ...filters, timeRange: e.target.value })}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">All Times</option>
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>

        {/* 2. Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">Category</label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">All Categories</option>
            <option value="FLOOD">Flood (Loke Be)</option>
            <option value="LANDSLIDE">Landslide (Rai Halai)</option>
            <option value="STRONG_WIND">Strong Wind (Anin Boot)</option>
            <option value="MEDICAL">Medical Emergency</option>
            <option value="FIRE">Fire (Ahi Han)</option>
            <option value="OTHER">Other Incident</option>
          </select>
        </div>

        {/* 3. Priority */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">Priority</label>
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onChange({ ...filters, priority: e.target.value })}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical (Urgente)</option>
            <option value="HIGH">High (Aas)</option>
            <option value="MEDIUM">Medium (Klaran)</option>
            <option value="LOW">Low (Baas)</option>
          </select>
        </div>

        {/* 4. Verification */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">Verification</label>
          <select
            value={filters.verificationStatus || 'all'}
            onChange={(e) => onChange({ ...filters, verificationStatus: e.target.value })}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">All Status</option>
            <option value="VERIFIED">Verified (Verifikadu)</option>
            <option value="NEEDS_VERIFICATION">Needs Review</option>
            <option value="LOCAL_ONLY">Local Device Only</option>
          </select>
        </div>

        {/* 5. Postu Administrativu (Viqueque 5 Postus) */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">
            Postu Admin (5)
          </label>
          <select
            value={filters.posto || 'all'}
            onChange={handlePostoChange}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs font-medium text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">All Postus (5)</option>
            {VIQUEQUE_POSTOS.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* 6. Suku (Suco) in Viqueque */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">
            Suku (Suco)
          </label>
          <select
            value={filters.suco || 'all'}
            onChange={handleSucoChange}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">
              {filters.posto && filters.posto !== 'all' 
                ? `Suku iha ${filters.posto} (${availableSucos.length})` 
                : 'Suku Hotu (35)'}
            </option>
            {availableSucos.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* 7. Aldeia in Viqueque */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">
            Aldeia
          </label>
          <select
            value={filters.aldeia || 'all'}
            onChange={handleAldeiaChange}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">Aldeia Hotu</option>
            {availableAldeias.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* 8. SiteWatch Status */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 truncate">SiteWatch</label>
          <select
            value={filters.siteWatchStatus || 'all'}
            onChange={(e) => onChange({ ...filters, siteWatchStatus: e.target.value })}
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-800 focus:ring-1 focus:ring-[#0B1F3A]"
          >
            <option value="all">All Sites (7)</option>
            <option value="ONLINE">Online</option>
            <option value="STALE">Stale Heartbeat</option>
            <option value="UNREACHABLE">Unreachable</option>
          </select>
        </div>
      </div>
    </div>
  );
}
