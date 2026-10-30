import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Layers, 
  MapPin, 
  ShieldAlert, 
  Wifi, 
  X, 
  RotateCcw,
  List,
  Map as MapIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import DisasterMap from '../components/map/DisasterMap';
import FilterToolbar from '../components/dashboard/FilterToolbar';
import { loadUnifiedIncidents, filterIncidents } from '../services/incidentService';
import { findPossibleIncidentClusters, DEFAULT_CLUSTER_THRESHOLDS } from '../services/clusteringService';
import { DEMO_SITEWATCH_NODES } from '../data/demoData';
import { VIQUEQUE_POSTOS, VIQUEQUE_CENTER, VIQUEQUE_ZOOM } from '../data/timorLesteLocations';

export default function MapPage() {
  const navigate = useNavigate();

  // Data
  const [allIncidents, setAllIncidents] = useState([]);
  const [siteWatchNodes, setSiteWatchNodes] = useState(DEMO_SITEWATCH_NODES);
  const [isLoading, setIsLoading] = useState(true);

  // View state
  const [isListView, setIsListView] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [mapCenterOverride, setMapCenterOverride] = useState(null);

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadUnifiedIncidents({ includeDemo: true });
      setAllIncidents(data.reports);
    } catch (err) {
      console.error('[MapPage] Error loading incidents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return filterIncidents(allIncidents, filters);
  }, [allIncidents, filters]);

  // Clusters
  const { clusters, reportsWithoutCoordinates } = useMemo(() => {
    return findPossibleIncidentClusters(filteredIncidents, clusterThresholds);
  }, [filteredIncidents, clusterThresholds]);

  // Quick zoom to a municipality
  const handleQuickMuniSelect = (postoName) => {
    if (postoName === 'ALL') {
      setFilters(prev => ({ ...prev, posto: 'all', suco: 'all', aldeia: 'all' }));
      setMapCenterOverride(VIQUEQUE_CENTER);
      return;
    }
    const p = VIQUEQUE_POSTOS.find(item => item.name.toLowerCase() === postoName.toLowerCase());
    if (p) {
      setFilters(prev => ({ ...prev, posto: p.name, suco: 'all', aldeia: 'all' }));
      setMapCenterOverride(p.center);
    }
  };

  const handleSelectIncident = (report) => {
    setSelectedCluster(null);
    setSelectedIncident(report);
  };

  const handleSelectCluster = (cluster) => {
    setSelectedIncident(null);
    setSelectedCluster(cluster);
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
    setMapCenterOverride(VIQUEQUE_CENTER);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -m-3.5 sm:-m-5 lg:-m-6 bg-gray-100">
      {/* Top Map Operational Control Bar */}
      <div className="bg-[#0B1F3A] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-1 text-xs font-bold cursor-pointer"
            title="Back to Operations Dashboard"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div>
            <h1 className="font-bold text-sm sm:text-base leading-none tracking-wide flex items-center space-x-2">
              <span>Interactive Disaster Map — Munisípiu Viqueque</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                5 POSTUS
              </span>
            </h1>
            <p className="text-[11px] text-gray-300 mt-0.5 hidden md:block">
              Full administrative multi-layer coordination map with heuristic cluster analysis — Viqueque
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Toggle Filters Drawer */}
          <button
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              showFiltersDrawer 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            <Filter size={14} />
            <span>Filters ({filteredIncidents.length})</span>
          </button>

          {/* Toggle Map vs List View */}
          <button
            onClick={() => setIsListView(!isListView)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            {isListView ? <MapIcon size={14} /> : <List size={14} />}
            <span>{isListView ? 'Show Map' : 'List Fallback'}</span>
          </button>
        </div>
      </div>

      {/* Quick Postu Jump Pills */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-2 overflow-x-auto text-xs z-10">
        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
          Jump to:
        </span>
        <button
          onClick={() => handleQuickMuniSelect('ALL')}
          className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
            (!filters.posto || filters.posto === 'all')
              ? 'bg-[#0B1F3A] text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Viqueque (5 Postus)
        </button>
        {VIQUEQUE_POSTOS.map(p => (
          <button
            key={p.name}
            onClick={() => handleQuickMuniSelect(p.name)}
            className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              (filters.posto || '').toLowerCase() === p.name.toLowerCase()
                ? 'bg-[#0B1F3A] text-white font-bold shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Map Viewport / Fallback List View */}
      <div className="flex-1 relative overflow-hidden flex min-h-[550px]">
        {/* Map Container */}
        {!isListView ? (
          <div className="flex-1 min-h-[550px] relative">
            <DisasterMap
              incidents={filteredIncidents}
              clusters={clusters}
              siteWatchNodes={siteWatchNodes}
              height="calc(100vh - 220px)"
              initialScrollWheelZoom={true}
              selectedLocation={mapCenterOverride}
              onSelectIncident={handleSelectIncident}
              onSelectCluster={handleSelectCluster}
              showLayersControl={true}
              showLegend={true}
            />
          </div>
        ) : (
          /* Offline/List Fallback View */
          <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 bg-white space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-center justify-between">
              <span>
                <strong>Report List Fallback:</strong> Displaying all incident reports and administrative centroids in list format. 
                Full reporting workflows operate even if basemap tiles cannot be rendered offline.
              </span>
              <button 
                onClick={() => setIsListView(false)}
                className="font-bold underline text-brand-navy ml-2 flex-shrink-0"
              >
                Return to Map
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIncidents.map(report => (
                <div 
                  key={report.client_id || report.id} 
                  onClick={() => setSelectedIncident(report)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-brand-navy hover:shadow-md transition-all cursor-pointer bg-white space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-xs text-gray-700">{report.client_id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      report.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      report.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {report.severity}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900">{report.title || report.type}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{report.description}</p>

                  <div className="text-xs text-gray-500 pt-2 border-t flex justify-between">
                    <span>{report.suco ? `${report.suco}, ` : ''}{report.municipality}</span>
                    <span>{new Date(report.reported_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible Slide-Out Inspector Drawer */}
        {(selectedIncident || selectedCluster) && (
          <div className="w-full sm:w-96 bg-white border-l border-gray-200 shadow-2xl z-30 flex flex-col absolute top-0 right-0 bottom-0 overflow-y-auto">
            {/* Inspector Header */}
            <div className="p-4 bg-brand-navy text-white flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider">
                {selectedCluster ? 'Cluster Inspection' : 'Incident Details'}
              </span>
              <button
                onClick={() => { setSelectedIncident(null); setSelectedCluster(null); }}
                className="text-gray-300 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Incident Inspector Content */}
            {selectedIncident && (
              <div className="p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono text-base font-bold text-gray-900">
                    {selectedIncident.client_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedIncident.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    selectedIncident.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedIncident.severity}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Incident Title</span>
                  <h3 className="font-bold text-base text-gray-900 mt-0.5">
                    {selectedIncident.title || selectedIncident.type}
                  </h3>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Description</span>
                  <p className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 mt-1 leading-relaxed">
                    {selectedIncident.description}
                  </p>
                </div>

                <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Administrative Location</span>
                    <span className="font-medium text-gray-800">
                      {selectedIncident.aldeia ? selectedIncident.aldeia + ', ' : ''}
                      {selectedIncident.suco ? selectedIncident.suco + ', ' : ''}
                      {selectedIncident.posto ? selectedIncident.posto + ', ' : ''}
                      {selectedIncident.municipality}
                    </span>
                  </div>

                  {selectedIncident.isApproximateOnly && (
                    <div className="text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded text-[11px]">
                      ⚠️ <strong>Approximate Centroid:</strong> Exact device GPS was not granted. Mapped to representative suco center.
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500 text-[11px] pt-1 border-t">
                    <span>Coordinates:</span>
                    <span className="font-mono">
                      {selectedIncident.latitude?.toFixed(4)}, {selectedIncident.longitude?.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verification State:</span>
                    <span className="font-bold text-emerald-600">{selectedIncident.verification_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Origin / Provenance:</span>
                    <span className="font-mono font-bold text-gray-700">{selectedIncident.sourceLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reported Time:</span>
                    <span>{new Date(selectedIncident.reported_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cluster Inspector Content */}
            {selectedCluster && (
              <div className="p-5 space-y-4 text-xs">
                <div className="bg-amber-100 border border-amber-300 text-amber-900 p-3 rounded-lg">
                  <div className="font-bold text-sm flex items-center space-x-1.5">
                    <ShieldAlert size={16} className="text-amber-700" />
                    <span>Possible cluster — requires review</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    {selectedCluster.provisionalNotice}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-500">Cluster ID:</span>
                    <span className="font-mono font-bold">{selectedCluster.clusterId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-500">Distinct Reports Count:</span>
                    <span className="font-bold text-red-600">{selectedCluster.reportCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-500">Disaster Categories:</span>
                    <span className="font-bold text-gray-800">{selectedCluster.categories.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-500">Active Temporal Span:</span>
                    <span className="font-bold">{selectedCluster.timeRange.spanHours} hrs</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 font-bold block mb-2">Contributing Incident Reports:</span>
                  <div className="space-y-2">
                    {selectedCluster.reports.map(r => (
                      <div 
                        key={r.client_id || r.id}
                        onClick={() => setSelectedIncident(r)}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between font-mono font-bold text-[11px]">
                          <span>{r.client_id}</span>
                          <span className="text-red-700">{r.type}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">{r.title || r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Filter Drawer Modal */}
      {showFiltersDrawer && (
        <div className="absolute top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 shadow-2xl animate-in fade-in duration-200">
          <FilterToolbar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            totalMatching={filteredIncidents.length}
          />
        </div>
      )}
    </div>
  );
}
