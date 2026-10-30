import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Radio,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Clock,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Play,
  Square,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';

export function SiteWatch() {
  const {
    sites,
    staleThresholdMinutes,
    setStaleThresholdMinutes,
    simulateSiteHeartbeat,
    simulateSiteOutage,
    stopSiteSimulation,
    resumeSiteSimulation
  } = useNetwork();
  const { t, lang } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('ALL');

  const onlineCount = sites.filter((s) => s.status === 'ONLINE').length;
  const staleCount = sites.filter((s) => s.status === 'STALE').length;
  const unreachableCount = sites.filter((s) => s.status === 'UNREACHABLE').length;

  const filteredSites = sites.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
              SiteWatch — {lang === 'tet' ? 'Monitorizasaun Resiliénsia Rede' : 'Network Health Telemetry'}
            </h1>
            <Badge variant="simulation">SIMULATION</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Painél telemetria ba pontu ligasaun Wi-Fi, radio VHF no satélite iha postu administrativu 5 Viqueque no suku demo.'
              : 'Telemetry monitoring of connectivity points across 5 administrative posts in Viqueque and demo sucos.'}
          </p>
        </div>

        {/* Configurable Stale Threshold Control */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-2xs">
          <Sliders className="w-4 h-4 text-slate-500" />
          <span className="text-slate-600 font-medium">
            {lang === 'tet' ? 'Limiar Stale:' : 'Stale Threshold:'}
          </span>
          <select
            value={staleThresholdMinutes}
            onChange={(e) => setStaleThresholdMinutes(Number(e.target.value))}
            className="font-bold text-[#0B1F3A] bg-transparent outline-none cursor-pointer"
          >
            <option value={5}>5 min</option>
            <option value={15}>15 min (Standard)</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </select>
        </div>
      </div>

      {/* Mandatory Engineering & Ethical Disclosure Banner */}
      <div className="p-4 rounded-xl bg-cyan-900 text-white border border-cyan-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white tracking-wide flex items-center gap-2">
              <span>{lang === 'tet' ? 'AVIZU SIMULASAUN & PROTOKOLU TÉKNIKU' : 'PROTOTYPE SIMULATION NOTICE'}</span>
              <span className="text-[10px] bg-cyan-800 px-2 py-0.5 rounded font-mono">SIMULATED DATA</span>
            </p>
            <p className="text-cyan-100 text-xs mt-1 leading-relaxed">
              {lang === 'tet'
                ? 'Heartbeat ne\'ebé la to\'o la hatudu prova loloos katak router aat ka ahi-mate. Sistema la bele inferi razaun fíziku antes investigasaun tékniku direta. Labele bolu simulasaun ne\'e hanesan telemetria router Mikrotik reál.'
                : 'A missing heartbeat does not constitute proof of power outage or hardware failure. Field verification is strictly required. Do not label simulated monitoring as real router telemetry.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title={lang === 'tet' ? 'Total Pontu Rede' : 'Total Service Points'}
          value={sites.length}
          subtitle={`Viqueque Pilot + Demo`}
          icon={Radio}
        />
        <StatCard
          title={lang === 'tet' ? 'Status Online' : 'Online Sites'}
          value={onlineCount}
          subtitle={`Heartbeat < ${staleThresholdMinutes}m`}
          icon={Wifi}
          badgeText="ONLINE"
        />
        <StatCard
          title={lang === 'tet' ? 'Sinal Tarde (Stale)' : 'Stale Heartbeats'}
          value={staleCount}
          subtitle={`>${staleThresholdMinutes} min la simu`}
          icon={Clock}
          badgeText="STALE"
        />
        <StatCard
          title={lang === 'tet' ? 'La Ligadu' : 'Unreachable'}
          value={unreachableCount}
          subtitle="Simulasaun kotu / offline"
          icon={WifiOff}
          badgeText="OUTAGE"
          className={unreachableCount > 0 ? 'border-rose-300 bg-rose-50/30' : ''}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium mr-1">{t('filterBy')}:</span>
          {['ALL', 'ONLINE', 'STALE', 'UNREACHABLE', 'UNKNOWN'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                activeFilter === status
                  ? 'bg-[#0B1F3A] text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          {lang === 'tet' ? 'Kontrolu Stop/Resume ba juíz sira' : 'Interactive Stop/Resume for demonstration'}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSites.map((site) => (
          <Card
            key={site.id}
            className={`flex flex-col justify-between overflow-hidden ${
              site.id.includes('demo') ? 'border-indigo-300 ring-1 ring-indigo-200' : ''
            }`}
          >
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {site.id}
                    </span>
                    {site.is_demo && (
                      <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded uppercase">
                        DEMO SUCO
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base mt-1 text-[#0B1F3A]">
                    {site.name}
                  </CardTitle>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    📍 {site.location} ({site.post})
                  </p>
                </div>

                <Badge
                  variant={
                    site.status === 'ONLINE'
                      ? 'online'
                      : site.status === 'STALE'
                      ? 'stale'
                      : site.status === 'UNREACHABLE'
                      ? 'unreachable'
                      : 'unknown'
                  }
                >
                  {site.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 py-4 text-xs">
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'tet' ? 'Tipu Ligasaun:' : 'Link Type:'}</span>
                  <span className="font-semibold text-slate-900">{site.connection_type}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IP Internu:</span>
                  <span className="font-mono text-slate-900">{site.ip_address}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Uptime Estimadu:</span>
                  <span className="font-semibold text-emerald-700">{site.uptime_percentage}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'tet' ? 'Heartbeat Ikus:' : 'Last Heartbeat:'}</span>
                  <span className="font-mono text-slate-900">
                    {new Date(site.last_heartbeat).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Operator note */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  {lang === 'tet' ? 'Nota Diagnóstiku Operadór:' : 'Operator Diagnostic Note:'}
                </span>
                <p className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                  {site.operator_notes}
                </p>
              </div>

              {/* Explicit Demo Controls: Stop & Resume Simulated Heartbeat */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                  {lang === 'tet' ? 'Kontrolu Simulasaun Heartbeat:' : 'Heartbeat Simulation Controls:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => resumeSiteSimulation(site.id)}
                    className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-300 text-center font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>{lang === 'tet' ? 'Komesa (Resume)' : 'Resume'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => stopSiteSimulation(site.id)}
                    className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded border border-rose-300 text-center font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Square className="w-3 h-3 text-rose-600 fill-rose-600" />
                    <span>{lang === 'tet' ? 'Para (Stop)' : 'Stop'}</span>
                  </button>
                </div>
              </div>
            </CardContent>

            <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {site.open_tickets > 0 ? (
                  <span className="text-rose-600 font-semibold">{site.open_tickets} kazu loke</span>
                ) : (
                  <span className="text-emerald-700">0 kazu aat</span>
                )}
              </span>

              <Link
                to={`/sitewatch/${site.id}`}
                className="font-semibold text-[#0B1F3A] hover:underline flex items-center gap-1"
              >
                <span>{lang === 'tet' ? 'Istóriku Kompletu' : 'Ticket History'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SiteWatch;
