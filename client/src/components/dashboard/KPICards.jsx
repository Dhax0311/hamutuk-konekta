import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  Radio, 
  RefreshCw, 
  HardDrive, 
  Send 
} from 'lucide-react';

export default function KPICards({
  serverAcknowledgedCount = 0,
  requiresVerificationCount = 0,
  needsAwaitingFollowUpCount = 0,
  localPendingCount = 0,
  staleOrUnreachableSitesCount = 0,
  totalMonitoredSites = 0,
  onSyncNow,
  isSyncing = false
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Server-Acknowledged Reports */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-500 border-t border-r border-b border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Server Acknowledged
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-brand-navy">
            {serverAcknowledgedCount}
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            SYNCED
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Confirmed at Central Municipal Registry
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 border-t pt-1.5 font-mono">
          <span>SOURCE: CENTRAL API</span>
          <span className="bg-gray-100 px-1 py-0.2 rounded font-bold text-gray-600">DEMO DATA</span>
        </div>
      </div>

      {/* 2. Reports Requiring Verification */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-amber-500 border-t border-r border-b border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Requires Verification
          </span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-amber-600">
            {requiresVerificationCount}
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
            ACTION REQUIRED
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Community field reports awaiting review
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 border-t pt-1.5 font-mono">
          <span>PRIORITY TRIAGE</span>
          <span className="bg-gray-100 px-1 py-0.2 rounded font-bold text-gray-600">DEMO DATA</span>
        </div>
      </div>

      {/* 3. Needs Awaiting Follow-Up */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500 border-t border-r border-b border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Needs Follow-Up
          </span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <HelpCircle size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-blue-600">
            {needsAwaitingFollowUpCount}
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
            RELIEF QUEUE
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Water, food, shelter & transport requests
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 border-t pt-1.5 font-mono">
          <span>CIVIL PROTECTION</span>
          <span className="bg-gray-100 px-1 py-0.2 rounded font-bold text-gray-600">DEMO DATA</span>
        </div>
      </div>

      {/* 4. Pending Reports on Current Device (Local Offline Queue) */}
      <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${localPendingCount > 0 ? 'border-brand-red bg-red-50/20' : 'border-gray-400'} border-t border-r border-b border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Local Pending Reports
          </span>
          <div className={`p-2 rounded-lg ${localPendingCount > 0 ? 'bg-red-50 text-brand-red' : 'bg-gray-50 text-gray-500'}`}>
            <HardDrive size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold ${localPendingCount > 0 ? 'text-brand-red' : 'text-gray-700'}`}>
            {localPendingCount}
          </div>
          <button
            onClick={onSyncNow}
            disabled={isSyncing}
            className="flex items-center space-x-1 text-[11px] bg-brand-navy hover:bg-opacity-90 text-white font-bold px-2 py-1 rounded shadow-sm transition-all disabled:opacity-50"
            title="Push local IndexedDB reports to server"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {localPendingCount > 0 
            ? 'Stored in IndexedDB — awaiting uplink' 
            : 'All local device reports synchronized'}
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 border-t pt-1.5 font-mono">
          <span>OFFLINE RESILIENCE</span>
          <span className="text-brand-navy font-bold">CLIENT QUEUE</span>
        </div>
      </div>

      {/* 5. Monitored Sites with Stale/Unreachable Status */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-brand-navy border-t border-r border-b border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            SiteWatch Nodes
          </span>
          <div className="p-2 bg-indigo-50 text-brand-navy rounded-lg">
            <Radio size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-brand-navy">
            {staleOrUnreachableSitesCount}
            <span className="text-sm font-normal text-gray-400 ml-1">/ {totalMonitoredSites}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${staleOrUnreachableSitesCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {staleOrUnreachableSitesCount > 0 ? `${staleOrUnreachableSitesCount} AT RISK` : 'ALL HEALTHY'}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Stale or unreachable telemetry heartbeats
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 border-t pt-1.5 font-mono">
          <span>NETWORK HEALTH</span>
          <span className="bg-gray-100 px-1 py-0.2 rounded font-bold text-gray-600">SIMULATION</span>
        </div>
      </div>
    </div>
  );
}
