import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  Server, 
  Activity, 
  Power, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { evaluateNodeStatus, getHeartbeatDiagnosticMessage, formatAge } from '../../services/siteWatchService';

export default function SiteWatchPanel({
  nodes = [],
  onRefresh,
  isRefreshing = false
}) {
  const [expandedNodeId, setExpandedNodeId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedNodeId(expandedNodeId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#0B1F3A] border-b border-slate-700/80 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <Radio size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-white">
                SiteWatch Network Infrastructure Monitoring
              </h3>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                SIMULATION & TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Heartbeat tracking for community gateways, health post nodes & local edge servers
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer border border-blue-400/50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Polling Nodes...' : 'Check Heartbeats'}</span>
        </button>
      </div>

      {/* Honest Diagnostic Standard Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 text-xs text-blue-900 flex items-start space-x-2">
        <Info size={16} className="text-blue-700 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Monitoring Policy:</strong> A missed heartbeat indicates telemetry absence; it does <em>not</em> prove power failure or hardware breakdown. Unreachability may stem from solar depletion, radio link fading, or provider maintenance.
        </p>
      </div>

      {/* Node List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Node Name & Location</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Health Status</th>
              <th className="py-3 px-4">Last Heartbeat</th>
              <th className="py-3 px-4">Latency</th>
              <th className="py-3 px-4">Power Source</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {nodes.map(node => {
              const evalResult = evaluateNodeStatus(node.last_seen_at || node.lastSeenAt);
              const isExpanded = expandedNodeId === node.id;

              return (
                <React.Fragment key={node.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    {/* Node Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{node.name}</div>
                      <div className="text-[11px] text-gray-500">
                        {node.suco}, {node.posto}, {node.municipality}
                      </div>
                    </td>

                    {/* Node Type */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-700">
                        {node.node_type}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] border ${evalResult.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          evalResult.status === 'ONLINE' ? 'bg-emerald-500' :
                          evalResult.status === 'STALE' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></span>
                        {evalResult.label}
                      </span>
                    </td>

                    {/* Last Heartbeat */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">
                        {formatAge(evalResult.ageSeconds)} ago
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {node.last_seen_at ? new Date(node.last_seen_at).toLocaleTimeString() : 'Never'}
                      </div>
                    </td>

                    {/* Latency */}
                    <td className="py-3 px-4 font-mono font-medium text-gray-700">
                      {node.latency_ms ? `${node.latency_ms} ms` : '—'}
                    </td>

                    {/* Power */}
                    <td className="py-3 px-4 text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Power size={12} className="text-gray-400" />
                        <span>{node.power_source || 'Solar'}</span>
                      </span>
                    </td>

                    {/* Expand/Collapse */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleExpand(node.id)}
                        className="text-brand-navy hover:text-blue-700 font-bold flex items-center space-x-1 ml-auto"
                      >
                        <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Diagnostic Row */}
                  {isExpanded && (
                    <tr className="bg-gray-50/80">
                      <td colSpan={7} className="p-4 border-y border-gray-200">
                        <div className="space-y-3 max-w-4xl">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Telemetry Origin</span>
                              <span className="font-bold text-gray-900 text-xs">
                                {node.isSimulation ? 'SIMULATION DATASET' : 'LIVE PHYSICAL SENSOR'}
                              </span>
                              <p className="text-[10px] text-gray-500 mt-1">
                                {node.isSimulation 
                                  ? 'Synthetic heartbeat generator for offline drill testing' 
                                  : 'Active MikroTik/OpenWrt ICMP heartbeat agent'}
                              </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">System Uptime</span>
                              <span className="font-bold text-gray-900 text-xs">{node.uptime_str || 'N/A'}</span>
                              <p className="text-[10px] text-gray-500 mt-1">
                                Battery state: <strong>{node.battery_charge || 'N/A'}</strong>
                              </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block">Firmware / Stack</span>
                              <span className="font-bold text-gray-900 text-xs">{node.firmware_version || 'RouterOS'}</span>
                              <p className="text-[10px] text-gray-500 mt-1 font-mono">Node ID: {node.id}</p>
                            </div>
                          </div>

                          {/* Heartbeat Status History */}
                          {node.history && node.history.length > 0 && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">
                                Recent Heartbeat Checkpoints (Last 2 Hours)
                              </span>
                              <div className="flex flex-wrap items-center gap-2">
                                {node.history.map((h, idx) => (
                                  <div key={idx} className="flex items-center space-x-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-[11px]">
                                    <span className="font-mono text-gray-500">{h.timestamp}</span>
                                    <span className={`w-2 h-2 rounded-full ${h.status === 'ONLINE' ? 'bg-emerald-500' : h.status === 'STALE' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                    <span className="font-bold text-gray-700">{h.status}</span>
                                    {h.latency && <span className="text-gray-400 font-mono">({h.latency}ms)</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Diagnostic Statement */}
                          <div className="bg-amber-50/60 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900">
                            <strong>Diagnostic Assessment:</strong> {getHeartbeatDiagnosticMessage(node)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
