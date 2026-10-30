import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileWarning,
  CheckCircle2,
  Clock,
  RefreshCw,
  Activity,
  AlertTriangle,
  Radio,
  ArrowRight,
  ShieldAlert,
  PlusCircle,
  HelpCircle,
  Map as MapIcon,
  ExternalLink,
  SlidersHorizontal,
  HardDrive
} from 'lucide-react';
import db from '../lib/offline/db';
import { useNetwork } from '../features/context/NetworkContext';
import { useLanguage } from '../features/context/LanguageContext';

// UI Components
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// Enhanced Operational Dashboard Components
import DisasterMap from '../components/map/DisasterMap';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import ClusterPanel from '../components/dashboard/ClusterPanel';
import FilterToolbar from '../components/dashboard/FilterToolbar';
import KPICards from '../components/dashboard/KPICards';
import SiteWatchPanel from '../components/dashboard/SiteWatchPanel';
import RecentIncidentsTable from '../components/dashboard/RecentIncidentsTable';

// Services
import { loadUnifiedIncidents, filterIncidents } from '../services/incidentService';
import { findPossibleIncidentClusters, DEFAULT_CLUSTER_THRESHOLDS } from '../services/clusteringService';
import { normalizeSiteWatchNode } from '../services/siteWatchService';

export function Overview() {
  const navigate = useNavigate();
  const { 
    isOnline, 
    pendingReportsCount, 
    lastSyncTime, 
    sites: networkSites, 
    triggerSync, 
    isSyncing 
  } = useNetwork();
  const { t, lang } = useLanguage();

  const [allIncidents, setAllIncidents] = useState([]);
  const [communityNeeds, setCommunityNeeds] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [kpiData, setKpiData] = useState({
    serverAcknowledgedCount: 0,
    localPendingCount: 0,
    requiresVerificationCount: 0,
    verifiedCount: 0,
    totalCount: 0
  });

  const [selectedMapPoint, setSelectedMapPoint] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    searchQuery: '',
    timeRange: 'all',
    category: 'all',
    priority: 'all',
    verificationStatus: 'all',
    municipality: 'all',
    posto: 'all',
    suco: 'all',
    siteWatchStatus: 'all'
  });

  // Cluster Thresholds
  const [clusterThresholds, setClusterThresholds] = useState(DEFAULT_CLUSTER_THRESHOLDS);

  const loadData = useCallback(async () => {
    try {
      const data = await loadUnifiedIncidents();
      setAllIncidents(data.reports);
      setKpiData(data.kpi);

      const loadedNeeds = await db.needs.toArray();
      setCommunityNeeds(loadedNeeds || []);

      const loadedWarnings = await db.warnings.toArray();
      setWarnings(loadedWarnings || []);
    } catch (err) {
      console.error('Error loading overview data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, pendingReportsCount]);

  // Normalized SiteWatch Nodes with coordinates
  const siteWatchNodes = useMemo(() => {
    return (networkSites || []).map(normalizeSiteWatchNode);
  }, [networkSites]);

  // Stale or Unreachable Sites Count
  const staleOrUnreachableCount = useMemo(() => {
    return siteWatchNodes.filter(s => s.status === 'STALE' || s.status === 'UNREACHABLE').length;
  }, [siteWatchNodes]);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return filterIncidents(allIncidents, filters);
  }, [allIncidents, filters]);

  // Rule-Based Clustering
  const { clusters, reportsWithoutCoordinates } = useMemo(() => {
    return findPossibleIncidentClusters(filteredIncidents, clusterThresholds);
  }, [filteredIncidents, clusterThresholds]);

  // SiteWatch Filtered Nodes
  const filteredSiteWatchNodes = useMemo(() => {
    if (filters.siteWatchStatus && filters.siteWatchStatus !== 'all') {
      return siteWatchNodes.filter(n => {
        if (filters.siteWatchStatus === 'ONLINE') return n.status === 'ONLINE';
        if (filters.siteWatchStatus === 'STALE') return n.status === 'STALE';
        if (filters.siteWatchStatus === 'UNREACHABLE') return n.status === 'UNREACHABLE';
        return true;
      });
    }
    return siteWatchNodes;
  }, [siteWatchNodes, filters.siteWatchStatus]);

  // Handle Inspecting a cluster or incident on map
  const handleInspectOnMap = (item) => {
    if (item.locationEstimate) {
      setSelectedMapPoint([item.locationEstimate.latitude, item.locationEstimate.longitude]);
    } else if (item.latitude && item.longitude) {
      setSelectedMapPoint([item.latitude, item.longitude]);
    }
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      timeRange: 'all',
      category: 'all',
      priority: 'all',
      verificationStatus: 'all',
      municipality: 'all',
      posto: 'all',
      suco: 'all',
      siteWatchStatus: 'all'
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Operational Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tracking-tight">
              {lang === 'tet' ? 'Painél Koordinasaun Munisípiu Viqueque' : 'HAMUTUK 2.0 Operational Dashboard'}
            </h1>
            <Badge variant="demo">DEMO DATA</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {lang === 'tet'
              ? 'Monitorizasaun dezastre lokál no telemetria rede resiliénsia iha suku 35.'
              : 'Local disaster coordination, interactive mapping, and network resilience telemetry across Timor-Leste.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Synchronise Now Action */}
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 text-xs font-bold bg-[#0B1F3A] hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Synchronising...' : 'Synchronise Now'}</span>
          </button>

          {/* Full Screen Map Navigation */}
          <button
            onClick={() => navigate('/map')}
            className="flex items-center space-x-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all"
          >
            <MapIcon size={14} />
            <span>Open Full Map Screen</span>
          </button>

          {/* New Incident Report Action */}
          <Link to="/reports/new">
            <Button variant="emergency" size="sm" icon={PlusCircle}>
              {t('navCreateReport') || 'New Report'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Local Pending Queue Notice */}
      {kpiData.localPendingCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                {lang === 'tet' ? 'Atensaun: Relatóriu Lokál Seidauk To\'o Servidor Sentrál' : 'Notice: Local Reports Pending Synchronization'}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                {kpiData.localPendingCount} {lang === 'tet' ? 'relatóriu rai iha memória aparellu (IndexedDB). Sincroniza bainhira rede re-estabelese.' : 'reports stored locally on this device. Click Synchronise Now when connected.'}
              </p>
            </div>
          </div>
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shrink-0 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{lang === 'tet' ? 'Sincroniza Agora' : 'Synchronise Now'}</span>
          </button>
        </div>
      )}

      {/* 1. Five Core Operational KPI Cards */}
      <KPICards
        serverAcknowledgedCount={kpiData.serverAcknowledgedCount}
        requiresVerificationCount={kpiData.requiresVerificationCount}
        needsAwaitingFollowUpCount={communityNeeds.length}
        localPendingCount={kpiData.localPendingCount}
        staleOrUnreachableSitesCount={staleOrUnreachableCount}
        totalMonitoredSites={siteWatchNodes.length}
        onSyncNow={triggerSync}
        isSyncing={isSyncing}
      />

      {/* 2. Multi-Faceted Filter Toolbar */}
      <FilterToolbar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        totalMatching={filteredIncidents.length}
      />

      {/* 3. Interactive Disaster Map Overview with Link to Full Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-gray-900">
              Interactive Disaster &amp; Network Map
            </h2>
            <span className="text-xs text-gray-400">Timor-Leste Operational Overview</span>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="text-xs font-bold text-[#0B1F3A] hover:text-blue-700 flex items-center space-x-1"
          >
            <span>Full-Screen Map Mode</span>
            <ExternalLink size={13} />
          </button>
        </div>

        <DisasterMap
          incidents={filteredIncidents}
          clusters={clusters}
          siteWatchNodes={filteredSiteWatchNodes}
          height="450px"
          selectedLocation={selectedMapPoint}
          onSelectCluster={(c) => setSelectedMapPoint([c.locationEstimate.latitude, c.locationEstimate.longitude])}
          onSelectIncident={(i) => setSelectedMapPoint([i.latitude, i.longitude])}
        />
      </div>

      {/* 4. Rule-Based Possible Incident Cluster Panel */}
      <ClusterPanel
        clusters={clusters}
        thresholds={clusterThresholds}
        onUpdateThresholds={setClusterThresholds}
        onInspectClusterOnMap={handleInspectOnMap}
        reportsWithoutCoordinatesCount={reportsWithoutCoordinates.length}
      />

      {/* 5. Professional Dashboard Analytics (Recharts) */}
      <AnalyticsCharts incidents={filteredIncidents} />

      {/* 6. SiteWatch Heartbeat & Telemetry Panel */}
      <SiteWatchPanel
        nodes={filteredSiteWatchNodes}
        onRefresh={triggerSync}
        isRefreshing={isSyncing}
      />

      {/* 7. Recent Incident Reports & Community Needs */}
      <RecentIncidentsTable
        incidents={filteredIncidents}
        communityNeeds={communityNeeds}
        onInspectOnMap={handleInspectOnMap}
      />
    </div>
  );
}

export default Overview;
