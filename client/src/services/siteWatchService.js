/**
 * SiteWatch Telemetry & Heartbeat Monitoring Service for HAMUTUK 2.0
 * All sites monitored within Municipio Viqueque.
 */

export const HEARTBEAT_THRESHOLDS = {
  ONLINE_MAX_SECONDS: 300,        // 5 minutes
  STALE_MAX_SECONDS: 1800,        // 30 minutes
  UNREACHABLE_SECONDS: 1800       // > 30 minutes
};

// All node coordinates strictly localized in Viqueque across its 5 postus
const SITE_COORDINATES = {
  'site-demo-suco-a': [-8.7690, 126.5580], // Uato-Lari (Afaloicai/Babulo)
  'site-demo-suco-b': [-8.7380, 126.3760], // Ossu (Liaruca)
  'site-vq-01': [-8.8575, 126.3647],       // Viqueque Villa Hub
  'site-vq-02': [-8.7610, 126.5490],       // Uato-Lari Community Center
  'site-vq-03': [-8.7900, 126.1400],       // Lacluta Health Point
  'site-vq-04': [-8.7390, 126.3740],       // Ossu Basic School Repeater
  'site-vq-05': [-8.7250, 126.6850],       // Uatucarbau Resilience Center
  'site-01': [-8.8650, 126.3620],          // Caraubalo (Viqueque Vila)
  'site-02': [-8.8780, 126.3750],          // Uma Uain Craic
  'site-03': [-8.9110, 126.3320],          // Bibileo
  'site-04': [-8.7690, 126.5580],          // Babulo
  'site-05': [-8.7210, 126.3580],          // Liaruca
  'site-06': [-8.8020, 126.1550],          // Dilor (Lacluta)
  'site-07': [-8.7180, 126.6780]           // Irabin de Cima (Uatucarbau)
};

export function evaluateNodeStatus(lastSeenAt) {
  if (!lastSeenAt) {
    return {
      status: 'UNKNOWN',
      ageSeconds: Infinity,
      label: 'UNKNOWN',
      color: 'gray',
      badgeClass: 'bg-gray-100 text-gray-700 border-gray-300'
    };
  }

  const now = Date.now();
  const lastTime = new Date(lastSeenAt).getTime();
  const ageSeconds = Math.max(0, Math.floor((now - lastTime) / 1000));

  if (ageSeconds <= HEARTBEAT_THRESHOLDS.ONLINE_MAX_SECONDS) {
    return {
      status: 'ONLINE',
      ageSeconds,
      label: 'ONLINE',
      color: 'green',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300'
    };
  }

  if (ageSeconds <= HEARTBEAT_THRESHOLDS.STALE_MAX_SECONDS) {
    return {
      status: 'STALE',
      ageSeconds,
      label: 'STALE / LAST SEEN',
      color: 'amber',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300'
    };
  }

  return {
    status: 'UNREACHABLE',
    ageSeconds,
    label: 'UNREACHABLE',
    color: 'red',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-300'
  };
}

export function normalizeSiteWatchNode(site) {
  let lat = site.latitude;
  let lng = site.longitude;

  if (!lat || !lng) {
    const coords = SITE_COORDINATES[site.id];
    if (coords) {
      lat = coords[0];
      lng = coords[1];
    } else {
      lat = -8.8575;
      lng = 126.3647;
    }
  }

  return {
    ...site,
    latitude: lat,
    longitude: lng,
    isSimulation: site.is_simulation !== false,
    simulationBadge: 'SIMULATION',
    last_seen_at: site.last_heartbeat || site.last_seen_at
  };
}

export function getHeartbeatDiagnosticMessage(node) {
  const evalResult = evaluateNodeStatus(node.last_seen_at || node.last_heartbeat);

  if (evalResult.status === 'ONLINE') {
    return `Healthy continuous telemetry. Last heartbeat received ${formatAge(evalResult.ageSeconds)} ago.`;
  }

  if (evalResult.status === 'STALE') {
    return `Telemetry delayed (${formatAge(evalResult.ageSeconds)} since last heartbeat). Heartbeat missed. Cause undetermined (may be transient channel fading, buffer congestion, or scheduled ping window).`;
  }

  if (evalResult.status === 'UNREACHABLE') {
    return `Node unreachable (${formatAge(evalResult.ageSeconds)} without heartbeat). Root cause undetermined: telemetry loss could be due to solar power depletion, physical link obstruction, device reboot, or fiber cut. On-site verification advised.`;
  }

  return 'No telemetry recorded for this node. Configuration or installation verification required.';
}

export function formatAge(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours < 24) return `${hours}h ${remainingMins}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}
