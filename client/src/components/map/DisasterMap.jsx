import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  AlertTriangle, 
  Wifi, 
  Layers, 
  MapPin, 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  Activity, 
  Server, 
  Info, 
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Search,
  MousePointer,
  ZoomIn
} from 'lucide-react';
import { VIQUEQUE_CENTER, VIQUEQUE_ZOOM, VIQUEQUE_BOUNDS } from '../../data/timorLesteLocations';
import { evaluateNodeStatus, getHeartbeatDiagnosticMessage, formatAge } from '../../services/siteWatchService';

// Controller to smoothly update map view when selection changes
function MapViewUpdater({ center, zoom, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } catch (e) {
        if (center) map.setView(center, zoom || VIQUEQUE_ZOOM);
      }
    } else if (center) {
      map.setView(center, zoom || VIQUEQUE_ZOOM);
    }

    // Force Leaflet to re-calculate container dimensions and fetch tiles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => clearTimeout(timer);
  }, [center, zoom, bounds, map]);
  return null;
}

// SVG icon helpers for professional React-style map markers
const getIncidentSvg = (type) => {
  switch (type) {
    case 'FLOOD':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>`;
    case 'LANDSLIDE':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
      </svg>`;
    case 'MEDICAL':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14"/>
        <path d="M5 12h14"/>
      </svg>`;
    case 'FIRE':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>`;
    case 'STRONG_WIND':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
      </svg>`;
    default:
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`;
  }
};

const getSiteWatchSvg = (status) => {
  if (status === 'UNREACHABLE') {
    return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <line x1="2" y1="2" x2="22" y2="22"/>
      <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
      <path d="M2 8.82a15 15 0 0 1 4.17-2.65"/>
      <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.82"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>`;
  }
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 13a10 10 0 0 1 14 0"/>
    <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>`;
};

// Generate distinct custom SVG div-icons without emojis
const createIncidentIcon = (type, severity, isApproximate) => {
  let bgColor = '#0B1F3A'; // default navy
  let pulse = '';

  if (severity === 'CRITICAL') {
    bgColor = '#D71920';
    pulse = '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span></span>';
  } else if (severity === 'HIGH') {
    bgColor = '#EA580C';
  } else if (severity === 'MEDIUM') {
    bgColor = '#F4B41A';
  } else {
    bgColor = '#2563EB';
  }

  const borderStyle = isApproximate ? 'border-dashed border-2 border-amber-300' : 'border-2 border-white';
  const approxBadge = isApproximate 
    ? '<span class="absolute -bottom-1 -left-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-sm shadow">APPROX</span>' 
    : '';

  const svg = getIncidentSvg(type);

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
      <div style="background-color: ${bgColor};" class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white ${borderStyle}">
        ${svg}
      </div>
      ${pulse}
      ${approxBadge}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-incident-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const createClusterIcon = (count) => {
  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-500 text-white font-black text-sm flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-amber-400/40">
        <div class="flex items-center space-x-0.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          <span class="text-xs font-black tracking-tighter">${count}</span>
        </div>
      </div>
      <span class="absolute -top-2 bg-[#0B1F3A] text-[9px] text-white font-bold px-1.5 py-0.5 rounded-full shadow border border-slate-600 whitespace-nowrap">
        Cluster
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-cluster-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
  });
};

const createSiteWatchIcon = (status) => {
  let color = '#10B981'; // Green
  let label = 'ON';
  if (status === 'STALE') {
    color = '#F59E0B'; // Amber
    label = 'STALE';
  } else if (status === 'UNREACHABLE') {
    color = '#E11D48'; // Red
    label = 'LOST';
  } else if (status === 'UNKNOWN') {
    color = '#6B7280';
    label = '?';
  }

  const svg = getSiteWatchSvg(status);

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
      <div style="background-color: ${color};" class="w-8 h-8 rounded-lg rotate-45 shadow-md flex items-center justify-center border-2 border-white">
        <div class="-rotate-45 text-white flex items-center justify-center">
          ${svg}
        </div>
      </div>
      <span class="absolute -bottom-3 bg-[#0B1F3A] text-white text-[9px] font-bold px-1 rounded shadow border border-slate-600 whitespace-nowrap">
        ${label}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-sitewatch-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20]
  });
};

export default function DisasterMap({
  incidents = [],
  clusters = [],
  siteWatchNodes = [],
  height = '600px',
  onSelectIncident,
  onSelectCluster,
  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
  showLayersControl = true,
  showLegend = true,
  selectedLocation = null,
  initialScrollWheelZoom = false
}) {
  const [scrollZoomEnabled, setScrollZoomEnabled] = useState(initialScrollWheelZoom);
  const [layers, setLayers] = useState({
    incidents: true,
    clusters: true,
    siteWatch: true
  });
  const [isTileOffline, setIsTileOffline] = useState(false);
  const [selectedClusterDetail, setSelectedClusterDetail] = useState(null);

  // Calculate bounding box for all available valid coordinates
  const bounds = useMemo(() => {
    const coords = [];
    if (layers.incidents) {
      incidents.forEach(r => {
        if (r.latitude && r.longitude) coords.push([r.latitude, r.longitude]);
      });
    }
    if (layers.siteWatch) {
      siteWatchNodes.forEach(s => {
        if (s.latitude && s.longitude) coords.push([s.latitude, s.longitude]);
      });
    }
    return coords.length > 0 ? coords : null;
  }, [incidents, siteWatchNodes, layers]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
      {/* Top Banner for Offline / Map Status */}
      <div className="bg-brand-navy text-white px-4 py-2 flex flex-wrap items-center justify-between text-xs z-10 relative">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold tracking-wide">OPERATIONAL DISASTER MAP — TIMOR-LESTE</span>
          <span className="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded font-mono">
            {incidents.length} Reports | {clusters.length} Clusters | {siteWatchNodes.length} Sites
          </span>
        </div>

        {/* Mouse Scroll Wheel Toggle (Page Scroll vs Map Zoom) */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setScrollZoomEnabled(!scrollZoomEnabled)}
            className={`px-2.5 py-1 rounded text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
              scrollZoomEnabled
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/10'
            }`}
            title={
              scrollZoomEnabled
                ? 'Map wheel zoom active. Click to scroll the page smoothly.'
                : 'Page scroll down active. Click to enable mouse wheel map zoom.'
            }
          >
            {scrollZoomEnabled ? (
              <ZoomIn size={13} className="text-slate-950" />
            ) : (
              <MousePointer size={13} className="text-amber-400" />
            )}
            <span className="font-mono text-[11px]">
              {scrollZoomEnabled ? 'Zoom: Wheel' : 'Scroll: Page'}
            </span>
          </button>
        </div>

        {/* Layer Toggles */}
        {showLayersControl && (
          <div className="flex items-center space-x-3 mt-1 sm:mt-0">
            <span className="text-gray-300 font-medium flex items-center">
              <Layers size={14} className="mr-1" /> Layers:
            </span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input 
                type="checkbox" 
                checked={layers.incidents} 
                onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
                className="rounded text-brand-red focus:ring-0" 
              />
              <span className="text-xs">Incidents</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input 
                type="checkbox" 
                checked={layers.clusters} 
                onChange={(e) => setLayers({ ...layers, clusters: e.target.checked })}
                className="rounded text-amber-500 focus:ring-0" 
              />
              <span className="text-xs">Clusters</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input 
                type="checkbox" 
                checked={layers.siteWatch} 
                onChange={(e) => setLayers({ ...layers, siteWatch: e.target.checked })}
                className="rounded text-blue-500 focus:ring-0" 
              />
              <span className="text-xs">SiteWatch</span>
            </label>
          </div>
        )}
      </div>

      {/* Offline Alert Banner if Tiles cannot load or network offline */}
      {!navigator.onLine && (
        <div className="bg-amber-50 border-b border-amber-300 p-2.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> Basemap tiles may be cached or limited. Emergency coordinates, administrative centroids, and local incident lists remain fully active offline.
            </span>
          </div>
          <span className="bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
            LOCAL RESILIENCE
          </span>
        </div>
      )}

      {/* Leaflet Map Container with guaranteed min-height */}
      <div 
        style={{ 
          height: (height && height !== '100%') ? height : '620px', 
          minHeight: '520px', 
          isolation: 'isolate' 
        }} 
        className="w-full relative z-0 flex-1"
      >
        <MapContainer
          center={VIQUEQUE_CENTER}
          zoom={VIQUEQUE_ZOOM}
          scrollWheelZoom={scrollZoomEnabled}
          style={{ height: '100%', width: '100%', minHeight: '520px' }}
        >
          <MapViewUpdater 
            center={selectedLocation || VIQUEQUE_CENTER} 
            zoom={selectedLocation ? 13 : VIQUEQUE_ZOOM} 
            bounds={selectedLocation ? null : (bounds || VIQUEQUE_BOUNDS)} 
          />

          <TileLayer
            url={tileUrl}
            attribution={attribution}
            maxZoom={18}
          />

          {/* SiteWatch Network Nodes Layer */}
          {layers.siteWatch && siteWatchNodes.map(site => {
            const evalStatus = evaluateNodeStatus(site.last_seen_at || site.lastSeenAt);
            return (
              <Marker
                key={site.id}
                position={[site.latitude, site.longitude]}
                icon={createSiteWatchIcon(evalStatus.status)}
              >
                <Popup className="hamutuk-popup">
                  <div className="p-1 space-y-2 max-w-xs text-gray-800">
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Wifi size={16} className="text-blue-600" />
                        <span className="font-bold text-sm text-brand-navy">SiteWatch Node</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${evalStatus.badgeClass}`}>
                        {evalStatus.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{site.name}</h4>
                      <p className="text-xs text-gray-500">
                        {site.suco}, {site.posto}, {site.municipality}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 bg-gray-50 p-2 rounded text-xs border border-gray-100">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Heartbeat Age</span>
                        <span className="font-bold text-gray-800">{formatAge(evalStatus.ageSeconds)} ago</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Latency</span>
                        <span className="font-bold text-gray-800">{site.latency_ms ? `${site.latency_ms} ms` : 'No Ping'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Power</span>
                        <span className="font-medium text-gray-800">{site.power_source || 'Solar'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Uptime</span>
                        <span className="font-medium text-gray-800">{site.uptime_str || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-600 bg-blue-50/50 p-1.5 rounded border border-blue-100">
                      <Info size={12} className="inline mr-1 text-blue-600" />
                      {getHeartbeatDiagnosticMessage(site)}
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t text-[10px] text-gray-400 font-mono">
                      <span>Source: {site.isSimulation ? 'SIMULATION' : 'LIVE TELEMETRY'}</span>
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">ID: {site.id}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Rule-Based Possible Incident Clusters Layer */}
          {layers.clusters && clusters.map(cluster => (
            <React.Fragment key={cluster.clusterId}>
              <Circle
                center={[cluster.locationEstimate.latitude, cluster.locationEstimate.longitude]}
                radius={(cluster.thresholdsApplied?.distanceKm || 8) * 1000}
                pathOptions={{
                  color: '#D71920',
                  fillColor: '#F4B41A',
                  fillOpacity: 0.15,
                  dashArray: '4, 8'
                }}
              />
              <Marker
                position={[cluster.locationEstimate.latitude, cluster.locationEstimate.longitude]}
                icon={createClusterIcon(cluster.reportCount)}
                eventHandlers={{
                  click: () => {
                    setSelectedClusterDetail(cluster);
                    if (onSelectCluster) onSelectCluster(cluster);
                  }
                }}
              >
                <Popup className="hamutuk-popup">
                  <div className="p-1 space-y-2 max-w-sm text-gray-800">
                    <div className="bg-amber-100 border border-amber-300 text-amber-900 px-2 py-1 rounded text-xs font-bold flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <ShieldAlert size={14} className="text-amber-700" />
                        <span>Possible cluster — requires review</span>
                      </div>
                      <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {cluster.reportCount} reports
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 italic">
                      {cluster.provisionalNotice}
                    </p>

                    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Approximate Location:</span>
                        <span className="font-bold text-gray-800">
                          {cluster.locationEstimate.suco || cluster.locationEstimate.municipality}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Categories Included:</span>
                        <span className="font-bold text-gray-800">{cluster.categories.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Span:</span>
                        <span className="font-bold text-gray-800">{cluster.timeRange.spanHours} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Verification:</span>
                        <span className="font-bold text-amber-700">
                          {cluster.verifiedCount} of {cluster.reportCount} Verified
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-500">
                      Contributing Reports:
                      <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                        {cluster.contributingReportIds.map(id => (
                          <span key={id} className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedClusterDetail(cluster);
                        if (onSelectCluster) onSelectCluster(cluster);
                      }}
                      className="w-full bg-brand-navy hover:bg-opacity-90 text-white font-bold py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1"
                    >
                      <span>Review All Cluster Incidents</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* Incident Reports Layer */}
          {layers.incidents && incidents.map(report => {
            if (!report.latitude || !report.longitude) return null;

            return (
              <Marker
                key={report.client_id || report.id}
                position={[report.latitude, report.longitude]}
                icon={createIncidentIcon(report.type, report.severity, report.isApproximateOnly)}
                eventHandlers={{
                  click: () => {
                    if (onSelectIncident) onSelectIncident(report);
                  }
                }}
              >
                <Popup className="hamutuk-popup">
                  <div className="p-1 space-y-2 max-w-sm text-gray-800">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs font-mono text-gray-700">
                          {report.client_id}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          report.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          report.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          report.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.severity}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        report.origin === 'LOCAL_PENDING' ? 'bg-amber-100 text-amber-800' :
                        report.origin === 'SERVER_ACKNOWLEDGED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {report.sourceLabel}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-snug">
                        {report.title || `${report.type} Incident Report`}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                        {report.description}
                      </p>
                    </div>

                    {/* Location & Approximate Badge */}
                    <div className="text-xs space-y-1 bg-gray-50 p-2 rounded border border-gray-100">
                      <div className="flex items-start space-x-1.5">
                        <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-800">
                            {report.aldeia ? report.aldeia + ', ' : ''}
                            {report.suco ? report.suco + ', ' : ''}
                            {report.posto ? report.posto + ', ' : ''}
                            {report.municipality || 'Viqueque'}
                          </span>
                          {report.isApproximateOnly && (
                            <span className="flex items-center text-[10px] text-amber-700 font-medium mt-0.5">
                              <AlertTriangle size={11} className="inline mr-1 text-amber-600 shrink-0" />
                              <span>GPS unavailable — mapped to administrative centroid</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 text-gray-500 text-[11px] pt-1">
                        <Clock size={12} className="flex-shrink-0" />
                        <span>Reported: {new Date(report.reported_at).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Verification and Reporter Details */}
                    <div className="flex justify-between items-center text-[11px] pt-1 border-t text-gray-500">
                      <div>
                        Verification: 
                        <span className={`ml-1 font-bold ${report.verification_status === 'VERIFIED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {report.verification_status === 'VERIFIED' ? 'VERIFIED' : 'ACTION REQUIRED'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-600">{report.reporter_role || 'Field Operator'}</span>
                    </div>

                    {/* Privacy safeguard note */}
                    <div className="text-[9px] text-gray-400">
                      Public privacy mode: Personal household coordinates aggregated.
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend Footer */}
      {showLegend && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-y-2">
          {/* Legend Items */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-bold text-brand-navy">Legend:</span>
            
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white inline-block"></span>
              <span>Critical Incident</span>
            </span>

            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-white inline-block"></span>
              <span>High / Medium</span>
            </span>

            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-amber-500 border border-white inline-block"></span>
              <span>Possible Cluster (Review Required)</span>
            </span>

            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-sm rotate-45 bg-emerald-500 inline-block"></span>
              <span>SiteWatch Online</span>
            </span>

            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-sm rotate-45 bg-rose-600 inline-block"></span>
              <span>SiteWatch Unreachable</span>
            </span>

            <span className="flex items-center space-x-1 text-amber-700">
              <span className="border-dashed border-2 border-amber-500 w-3 h-3 rounded-full inline-block"></span>
              <span>Approximate Centroid</span>
            </span>
          </div>

          {/* Required OSM Attribution */}
          <div className="text-[11px] text-gray-400">
            Map data: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">OpenStreetMap contributors</a>
          </div>
        </div>
      )}
    </div>
  );
}
