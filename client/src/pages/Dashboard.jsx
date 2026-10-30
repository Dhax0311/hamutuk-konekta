import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  Clock, 
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import KPICards from '../components/dashboard/KPICards';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import ClusterPanel from '../components/dashboard/ClusterPanel';
import SiteWatchPanel from '../components/dashboard/SiteWatchPanel';
import RecentIncidentsTable from '../components/dashboard/RecentIncidentsTable';
import FilterToolbar from '../components/dashboard/FilterToolbar';
import DisasterMap from '../components/map/DisasterMap';

import { loadUnifiedIncidents, filterIncidents } from '../services/incidentService';
import { findPossibleIncidentClusters, DEFAULT_CLUSTER_THRESHOLDS } from '../services/clusteringService';
import { DEMO_SITEWATCH_NODES, DEMO_COMMUNITY_NEEDS } from '../data/demoData';
import { syncEngine } from '../services/syncEngine';

export default function Dashboard() {
  const navigate = useNavigate();

  // State
  const [allIncidents, setAllIncidents] = useState([]);
  const [siteWatchNodes, setSiteWatchNodes] = useState(DEMO_SITEWATCH_NODES);
  const [communityNeeds, setCommunityNeeds] = useState(DEMO_COMMUNITY_NEEDS);
  const [kpiData, setKpiData] = useState({
    serverAcknowledgedCount: 0,
    localPendingCount: 0,
    requiresVerificationCount: 0,
    verifiedCount: 0,
    totalCount: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshingSiteWatch, setIsRefreshingSiteWatch] = useState(false);
  const [lastDataFetchTime, setLastDataFetchTime] = useState(new Date());
  const [isStaleData, setIsStaleData] = useState(false);

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

  // Cluster Thresholds State (Provisional & Configurable)
  const [clusterThresholds, setClusterThresholds] = useState(DEFAULT_CLUSTER_THRESHOLDS);
  const [selectedMapPoint, setSelectedMapPoint] = useState(null);

  // Load Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadUnifiedIncidents({ includeDemo: true });
      setAllIncidents(data.reports);
      setKpiData(data.kpi);
      setLastDataFetchTime(new Date());
      setIsStaleData(false);
    } catch (err) {
      console.error('[Dashboard] Error loading unified incidents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Check for stale data (> 15 minutes old)
    const interval = setInterval(() => {
      const diffMins = (Date.now() - lastDataFetchTime.getTime()) / (1000 * 60);
      if (diffMins > 15) setIsStaleData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData, lastDataFetchTime]);

  // Synchronize Now Handler
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await syncEngine.sync();
      await fetchData();
    } catch (err) {
      console.error('[Dashboard] Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Refresh SiteWatch Nodes
  const handleRefreshSiteWatch = async () => {
    setIsRefreshingSiteWatch(true);
    // Simulate real heartbeat check / poll
    setTimeout(() => {
      setSiteWatchNodes(prev => prev.map(n => ({
        ...n,
        last_seen_at: n.status === 'ONLINE' ? new Date().toISOString() : n.last_seen_at
      })));
      setIsRefreshingSiteWatch(false);
    }, 700);
  };

  // Filtered Incidents
  const filteredIncidents = React.useMemo(() => {
    return filterIncidents(allIncidents, filters);
  }, [allIncidents, filters]);

  // Rule-Based Clustering
  const { clusters, reportsWithoutCoordinates } = React.useMemo(() => {
    return findPossibleIncidentClusters(filteredIncidents, clusterThresholds);
  }, [filteredIncidents, clusterThresholds]);

  // SiteWatch Filtered Nodes
  const filteredSiteWatchNodes = React.useMemo(() => {
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

  // Stale or Unreachable Sites Count
  const staleOrUnreachableCount = React.useMemo(() => {
    return siteWatchNodes.filter(n => n.status === 'STALE' || n.status === 'UNREACHABLE').length;
  }, [siteWatchNodes]);

  // Handle Inspecting a cluster or incident on map
  const handleInspectOnMap = (item) => {
    if (item.locationEstimate) {
      // Cluster
      setSelectedMapPoint([item.locationEstimate.latitude, item.locationEstimate.longitude]);
    } else if (item.latitude && item.longitude) {
      // Incident
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
      {/* Top Operational Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">
              HAMUTUK 2.0 Operational Dashboard
            </h1>
            <span className="bg-brand-navy text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
              CIVIL DEFENCE
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Offline-first disaster coordination and community network resilience — Munisípiu Viqueque
          </p>
        </div>

        {/* Global Controls & Timestamps */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stale Warning Indicator */}
          {isStaleData && (
            <div className="flex items-center space-x-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs px-2.5 py-1.5 rounded-lg">
              <Clock size={14} className="text-amber-600" />
              <span>Data &gt;15m old</span>
            </div>
          )}

          {/* Sync Now Button */}
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 text-xs font-bold bg-[#0B1F3A] hover:bg-opacity-90 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Synchronising...' : 'Synchronise Now'}</span>
          </button>

          {/* Dedicated Full Map Navigation Button */}
          <button
            onClick={() => navigate('/map')}
            className="flex items-center space-x-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <MapIcon size={14} />
            <span>Open Full Map Screen</span>
          </button>
        </div>
      </div>

      {/* 1. Five Core KPI Cards */}
      <KPICards
        serverAcknowledgedCount={kpiData.serverAcknowledgedCount}
        requiresVerificationCount={kpiData.requiresVerificationCount}
        needsAwaitingFollowUpCount={communityNeeds.length}
        localPendingCount={kpiData.localPendingCount}
        staleOrUnreachableSitesCount={staleOrUnreachableCount}
        totalMonitoredSites={siteWatchNodes.length}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
      />

      {/* 2. Multi-Faceted Filter Toolbar */}
      <FilterToolbar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        totalMatching={filteredIncidents.length}
      />

      {/* 3. Interactive Disaster Map Overview with Direct Link to Full Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-gray-900">
              Interactive Disaster & Network Map
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Munisípiu Viqueque Overview
            </span>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="text-xs font-bold text-brand-navy hover:text-blue-700 flex items-center space-x-1"
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
        onRefresh={handleRefreshSiteWatch}
        isRefreshing={isRefreshingSiteWatch}
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
