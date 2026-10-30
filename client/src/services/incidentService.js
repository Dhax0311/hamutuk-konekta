import db from '../lib/offline/db';
import { getAdministrativeFallbackLocation } from '../data/timorLesteLocations';
import { DEMO_INCIDENT_REPORTS } from '../data/demoData';

export function normalizeReport(rep) {
  let lat = null;
  let lng = null;
  let isApprox = false;

  if (rep.coordinates && typeof rep.coordinates === 'string' && rep.coordinates.includes(',')) {
    const parts = rep.coordinates.split(',').map(s => parseFloat(s.trim()));
    if (!isNaN(parts[0]) && !isNaN(parts[1])) {
      lat = parts[0];
      lng = parts[1];
    }
  } else if (rep.latitude && rep.longitude) {
    lat = parseFloat(rep.latitude);
    lng = parseFloat(rep.longitude);
  }

  let locationLabel = '';
  if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
    const fallback = getAdministrativeFallbackLocation(
      rep.municipality || 'Viqueque',
      rep.administrative_post || rep.posto,
      rep.suco
    );
    lat = fallback.coordinates[0];
    lng = fallback.coordinates[1];
    isApprox = true;
    locationLabel = fallback.label;
  } else {
    locationLabel = `${rep.suco ? rep.suco + ', ' : ''}${rep.administrative_post || rep.posto ? (rep.administrative_post || rep.posto) + ', ' : ''}${rep.municipality || 'Viqueque'}`;
  }

  const isAck = rep.sync_status === 'SERVER_ACKNOWLEDGED';
  const origin = isAck ? 'SERVER_ACKNOWLEDGED' : (rep.is_demo ? 'DEMO_DATA' : 'LOCAL_PENDING');

  return {
    ...rep,
    id: rep.client_report_id || rep.id,
    client_id: rep.client_report_id || rep.id,
    type: (rep.category || 'OTHER').toUpperCase(),
    severity: rep.priority || 'MEDIUM',
    title: rep.title || `${(rep.category || 'Disaster').toUpperCase()} in ${rep.suco || rep.municipality || 'Timor-Leste'}`,
    description: rep.description || rep.location_description || '',
    municipality: rep.municipality || 'Viqueque',
    posto: rep.administrative_post || rep.posto || 'Viqueque Vila',
    administrative_post: rep.administrative_post || rep.posto || 'Viqueque Vila',
    suco: rep.suco,
    aldeia: rep.aldeia,
    latitude: lat,
    longitude: lng,
    isApproximateOnly: isApprox,
    locationLabel,
    origin,
    isPendingSync: !isAck,
    isDemo: rep.is_demo !== false,
    sourceLabel: rep.is_demo ? 'DEMO DATA' : (origin === 'LOCAL_PENDING' ? 'LOCAL ONLY (PENDING SYNC)' : 'SERVER ACKNOWLEDGED'),
    verification_status: rep.verification_status || 'NEEDS_VERIFICATION',
    reported_at: rep.incident_time || rep.created_at || new Date().toISOString()
  };
}

export async function loadUnifiedIncidents() {
  try {
    let rawReports = [];
    try {
      rawReports = await db.reports.toArray();
    } catch (e) {
      console.warn('Dexie error:', e);
    }

    if (!rawReports || rawReports.length === 0) {
      try {
        await db.reports.bulkAdd(DEMO_INCIDENT_REPORTS.map(r => ({
          client_report_id: r.client_id || `HMT-${r.id}`,
          category: (r.type || 'OTHER').toLowerCase(),
          municipality: r.municipality || 'Viqueque',
          administrative_post: r.posto || 'Viqueque Vila',
          suco: r.suco || '',
          aldeia: r.aldeia || '',
          coordinates: r.latitude && r.longitude ? `${r.latitude}, ${r.longitude}` : null,
          latitude: r.latitude,
          longitude: r.longitude,
          title: r.title,
          description: r.description,
          priority: r.severity || 'MEDIUM',
          verification_status: r.verification_status || 'VERIFIED',
          sync_status: 'SERVER_ACKNOWLEDGED',
          created_at: r.reported_at || new Date().toISOString(),
          is_demo: true
        })));
        rawReports = await db.reports.toArray();
      } catch (seedErr) {
        rawReports = DEMO_INCIDENT_REPORTS;
      }
    }

    const reports = (rawReports && rawReports.length > 0 ? rawReports : DEMO_INCIDENT_REPORTS).map(normalizeReport);

    const serverAcknowledgedCount = reports.filter(r => r.origin === 'SERVER_ACKNOWLEDGED').length;
    const localPendingCount = reports.filter(r => r.origin === 'LOCAL_PENDING').length;
    const requiresVerificationCount = reports.filter(r => r.verification_status === 'UNVERIFIED' || r.verification_status === 'NEEDS_VERIFICATION').length;
    const verifiedCount = reports.filter(r => r.verification_status === 'VERIFIED').length;

    return {
      reports,
      kpi: {
        serverAcknowledgedCount,
        localPendingCount,
        requiresVerificationCount,
        verifiedCount,
        totalCount: reports.length
      }
    };
  } catch (err) {
    console.error('Error loading unified incidents:', err);
    return { reports: [], kpi: { serverAcknowledgedCount: 0, localPendingCount: 0, requiresVerificationCount: 0, verifiedCount: 0, totalCount: 0 } };
  }
}

export function filterIncidents(reports, filters = {}) {
  if (!Array.isArray(reports)) return [];

  return reports.filter(r => {
    if (filters.timeRange && filters.timeRange !== 'all') {
      const reportTime = new Date(r.reported_at).getTime();
      const now = Date.now();
      const diffHours = (now - reportTime) / (1000 * 3600);

      if (filters.timeRange === '1h' && diffHours > 1) return false;
      if (filters.timeRange === '6h' && diffHours > 6) return false;
      if (filters.timeRange === '24h' && diffHours > 24) return false;
      if (filters.timeRange === '7d' && diffHours > 24 * 7) return false;
    }

    if (filters.category && filters.category !== 'all') {
      if ((r.type || '').toUpperCase() !== filters.category.toUpperCase()) return false;
    }

    if (filters.priority && filters.priority !== 'all') {
      if ((r.severity || '').toUpperCase() !== filters.priority.toUpperCase()) return false;
    }

    if (filters.verificationStatus && filters.verificationStatus !== 'all') {
      if (filters.verificationStatus === 'LOCAL_ONLY') {
        if (r.origin !== 'LOCAL_PENDING') return false;
      } else if (r.verification_status !== filters.verificationStatus) {
        return false;
      }
    }

    if (filters.municipality && filters.municipality !== 'all') {
      if ((r.municipality || '').toLowerCase() !== filters.municipality.toLowerCase()) return false;
    }

    if (filters.posto && filters.posto !== 'all') {
      const rPosto = (r.posto || r.administrative_post || '').toLowerCase();
      if (rPosto !== filters.posto.toLowerCase()) return false;
    }

    if (filters.suco && filters.suco !== 'all') {
      if ((r.suco || '').toLowerCase() !== filters.suco.toLowerCase()) return false;
    }

    if (filters.aldeia && filters.aldeia !== 'all') {
      if ((r.aldeia || '').toLowerCase() !== filters.aldeia.toLowerCase()) return false;
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = (r.client_id || '').toLowerCase().includes(q) || String(r.id).includes(q);
      const matchMuni = (r.municipality || '').toLowerCase().includes(q);
      const matchPosto = (r.posto || '').toLowerCase().includes(q);
      const matchSuco = (r.suco || '').toLowerCase().includes(q);
      const matchAldeia = (r.aldeia || '').toLowerCase().includes(q);
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      const matchDesc = (r.description || '').toLowerCase().includes(q);
      if (!matchId && !matchMuni && !matchPosto && !matchSuco && !matchAldeia && !matchTitle && !matchDesc) {
        return false;
      }
    }

    return true;
  });
}
