/**
 * Rule-Based Possible Incident Clustering Service
 * 
 * Transparent, deterministic heuristic clustering service that groups eligible, distinct incident reports
 * by configurable geographic distance, time window, and incident category.
 * 
 * IMPORTANT COMPLIANCE RULES:
 * 1. Every group MUST be labeled: "Possible cluster — requires review"
 * 2. Never represent a cluster as a confirmed disaster or official warning.
 * 3. Never claim AI or automated predictive capabilities.
 * 4. Deduplicate repeated retries of the same report ID.
 * 5. Exclude reports without valid coordinates from geographic clusters (do not invent coordinates).
 */

// Earth radius in kilometers for Haversine distance
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two geographic coordinates in kilometers
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Default rule-based thresholds.
 * Marked as PROVISIONAL and fully configurable.
 */
export const DEFAULT_CLUSTER_THRESHOLDS = {
  maxDistanceKm: 8,       // 8 kilometers radius
  timeWindowHours: 24,    // 24 hours window
  minReports: 2,          // Minimum distinct reports to constitute a possible cluster
  requireCategoryMatch: false // True = exact category match, False = same or related disaster types
};

/**
 * Deduplicates reports by stable identifier (id or client_id).
 * Prevents sync retries and client duplications from inflating incident counts.
 */
export function deduplicateReports(reports) {
  if (!Array.isArray(reports)) return [];
  const seen = new Set();
  const unique = [];

  for (const report of reports) {
    const key = report.client_id || report.id;
    if (!key) {
      unique.push(report);
      continue;
    }
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(report);
    }
  }

  return unique;
}

/**
 * Clusters reports based on deterministic geographic distance, time window, and category.
 * 
 * @param {Array} rawReports Array of incident reports
 * @param {Object} options Configurable thresholds
 * @returns {Object} { clusters: Array, unclustered: Array, reportsWithoutCoordinates: Array, totalDeduplicated: number }
 */
export function findPossibleIncidentClusters(rawReports, options = {}) {
  const thresholds = { ...DEFAULT_CLUSTER_THRESHOLDS, ...options };
  const uniqueReports = deduplicateReports(rawReports);

  const eligibleForGeoClustering = [];
  const reportsWithoutCoordinates = [];

  for (const r of uniqueReports) {
    const lat = parseFloat(r.latitude ?? r.lat);
    const lng = parseFloat(r.longitude ?? r.lng);

    // Only reports with genuine, verified coordinate pairs participate in spatial clustering.
    // Approximate or missing coordinates are isolated to avoid false geographic grouping.
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && !r.isApproximateOnly) {
      eligibleForGeoClustering.push({
        ...r,
        _lat: lat,
        _lng: lng,
        _time: new Date(r.reported_at || r.timestamp || r.created_at || Date.now()).getTime()
      });
    } else {
      reportsWithoutCoordinates.push(r);
    }
  }

  // Graph-based connected component clustering
  const visited = new Set();
  const clusters = [];
  const unclustered = [];

  for (let i = 0; i < eligibleForGeoClustering.length; i++) {
    const root = eligibleForGeoClustering[i];
    const rootId = root.client_id || root.id || `rep-${i}`;
    if (visited.has(rootId)) continue;

    const group = [root];
    visited.add(rootId);

    for (let j = i + 1; j < eligibleForGeoClustering.length; j++) {
      const candidate = eligibleForGeoClustering[j];
      const candidateId = candidate.client_id || candidate.id || `rep-${j}`;
      if (visited.has(candidateId)) continue;

      // Check Category
      if (thresholds.requireCategoryMatch && root.type !== candidate.type) {
        continue;
      }

      // Check Time Window
      const timeDiffHours = Math.abs(root._time - candidate._time) / (1000 * 60 * 60);
      if (timeDiffHours > thresholds.timeWindowHours) {
        continue;
      }

      // Check Spatial Distance
      const dist = calculateHaversineDistanceKm(root._lat, root._lng, candidate._lat, candidate._lng);
      if (dist <= thresholds.maxDistanceKm) {
        group.push(candidate);
        visited.add(candidateId);
      }
    }

    if (group.length >= thresholds.minReports) {
      // Calculate cluster centroid
      const totalLat = group.reduce((sum, r) => sum + r._lat, 0);
      const totalLng = group.reduce((sum, r) => sum + r._lng, 0);
      const centerLat = totalLat / group.length;
      const centerLng = totalLng / group.length;

      // Find time bounds
      const timestamps = group.map(r => r._time);
      const earliestTime = new Date(Math.min(...timestamps));
      const latestTime = new Date(Math.max(...timestamps));

      // Unique categories and severities
      const categories = [...new Set(group.map(r => r.type || 'UNKNOWN'))];
      const severities = [...new Set(group.map(r => r.severity || 'UNKNOWN'))];

      // Verification state evaluation
      const verifiedCount = group.filter(r => r.verification_status === 'VERIFIED' || r.status === 'VERIFIED').length;
      let verificationState = 'REQUIRES_VERIFICATION';
      if (verifiedCount === group.length) {
        verificationState = 'ALL_VERIFIED';
      } else if (verifiedCount > 0) {
        verificationState = 'PARTIALLY_VERIFIED';
      }

      const clusterId = `CLU-${Math.round(centerLat * 100).toString().replace('-', 'S')}-${Math.round(centerLng * 100)}-${group.length}`;

      clusters.push({
        clusterId,
        label: 'Possible cluster — requires review',
        provisionalNotice: 'Provisional rule-based grouping. Not an official warning or confirmed disaster.',
        reportCount: group.length,
        contributingReportIds: group.map(r => r.client_id || r.id),
        reports: group,
        categories,
        severities,
        locationEstimate: {
          latitude: centerLat,
          longitude: centerLng,
          municipality: group[0].municipality || 'Viqueque',
          posto: group[0].posto || group[0].administrative_post,
          suco: group[0].suco
        },
        timeRange: {
          earliest: earliestTime.toISOString(),
          latest: latestTime.toISOString(),
          spanHours: ((latestTime.getTime() - earliestTime.getTime()) / (1000 * 3600)).toFixed(1)
        },
        verificationState,
        verifiedCount,
        unverifiedCount: group.length - verifiedCount,
        requiresHumanReview: true,
        thresholdsApplied: {
          distanceKm: thresholds.maxDistanceKm,
          windowHours: thresholds.timeWindowHours
        }
      });
    } else {
      unclustered.push(root);
    }
  }

  return {
    clusters,
    unclustered,
    reportsWithoutCoordinates,
    totalDeduplicated: uniqueReports.length,
    thresholdsUsed: thresholds
  };
}
