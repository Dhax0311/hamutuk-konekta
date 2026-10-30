import db from './db';
import { generateClientReportId } from './uuid';

/**
 * Validates report fields before local persistence
 */
export function validateReportInput(data) {
  const errors = [];
  if (!data.category) errors.push('Kategoria dezastre presiza hili.');
  if (!data.administrative_post) errors.push('Postu administrativu presiza hili.');
  if (!data.suco) errors.push('Suku presiza hili.');
  if (!data.description || data.description.trim().length < 5) {
    errors.push('Deskrisaun presiza pelumenus letra 5.');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates and stores a new report locally in IndexedDB first
 */
export async function saveReportLocally(inputData, currentUser) {
  const validation = validateReportInput(inputData);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(' '));
  }

  // Ensure stable client UUID
  const clientReportId = inputData.client_report_id || generateClientReportId();
  const recordedAt = new Date().toISOString();

  const report = {
    client_report_id: clientReportId,
    category: inputData.category,
    municipality: inputData.municipality || 'Viqueque',
    administrative_post: inputData.administrative_post,
    suco: inputData.suco,
    aldeia: inputData.aldeia || '',
    location_description: inputData.location_description || '',
    coordinates: inputData.coordinates || null,
    incident_time: inputData.incident_time ? new Date(inputData.incident_time).toISOString() : recordedAt,
    created_at: recordedAt,
    description: inputData.description.trim(),
    priority: inputData.priority || 'HIGH',
    immediate_needs: Array.isArray(inputData.immediate_needs) ? inputData.immediate_needs : [],
    reporter_role: currentUser?.role || inputData.reporter_role || 'SUCO_OFFICER',
    reporter_name: currentUser?.name || inputData.reporter_name || 'Ofisiál Suku',
    verification_status: 'UNVERIFIED',
    
    // Explicit sync state tracking
    sync_status: 'SAVED_ON_DEVICE', // 'SAVED_ON_DEVICE' | 'PENDING_SYNC' | 'SYNCING' | 'SERVER_ACKNOWLEDGED' | 'SYNC_FAILED'
    server_ack_at: null,
    attempt_count: 0,
    last_attempt_at: null,
    last_error: null,
    follow_up_status: 'PENDING',
    follow_up_notes: 'Rai iha memória aparellu ne\'e (IndexedDB).',
    is_demo: true
  };

  try {
    await db.reports.put(report);
    return report;
  } catch (err) {
    console.error('IndexedDB write failure:', err);
    throw new Error('Memória lokál la disponivel ka aparellu la fó lisensa atu rai relatóriu.');
  }
}

/**
 * List all reports from IndexedDB
 */
export async function getAllLocalReports() {
  try {
    return await db.reports.reverse().sortBy('created_at');
  } catch (err) {
    console.error('Error fetching local reports:', err);
    return [];
  }
}

/**
 * Get single report by client_report_id
 */
export async function getLocalReportById(clientReportId) {
  try {
    return await db.reports.get(clientReportId);
  } catch (err) {
    console.error(`Error fetching report ${clientReportId}:`, err);
    return null;
  }
}

/**
 * Get all reports awaiting server acknowledgement
 */
export async function getPendingReports() {
  try {
    return await db.reports
      .filter((r) =>
        r.sync_status === 'SAVED_ON_DEVICE' ||
        r.sync_status === 'PENDING_SYNC' ||
        r.sync_status === 'SYNC_FAILED' ||
        r.sync_status === 'RETRYING'
      )
      .toArray();
  } catch (err) {
    console.error('Error fetching pending reports:', err);
    return [];
  }
}

/**
 * Update report sync state to SYNCING
 */
export async function markReportsSyncing(clientReportIds) {
  try {
    const now = new Date().toISOString();
    for (const id of clientReportIds) {
      await db.reports.update(id, {
        sync_status: 'SYNCING',
        last_attempt_at: now
      });
    }
  } catch (err) {
    console.error('Error marking reports syncing:', err);
  }
}

/**
 * Mark a single report as confirmed by the central server
 * NEVER called until server receipt is acknowledged!
 */
export async function markReportAcknowledged(clientReportId, serverAckAt) {
  try {
    await db.reports.update(clientReportId, {
      sync_status: 'SERVER_ACKNOWLEDGED',
      server_ack_at: serverAckAt || new Date().toISOString(),
      last_error: null,
      follow_up_notes: 'Servidor sentrál rekonhese no simu ona relatóriu ne\'e.'
    });
  } catch (err) {
    console.error(`Error marking report ${clientReportId} acknowledged:`, err);
  }
}

/**
 * Record a failed sync attempt for a single report
 */
export async function recordFailedAttempt(clientReportId, errorMessage) {
  try {
    const existing = await db.reports.get(clientReportId);
    const attempts = (existing?.attempt_count || 0) + 1;

    await db.reports.update(clientReportId, {
      sync_status: 'SYNC_FAILED',
      attempt_count: attempts,
      last_attempt_at: new Date().toISOString(),
      last_error: errorMessage || 'Koneksaun falla durante haruka ba servidor sentrál.'
    });
  } catch (err) {
    console.error(`Error recording failed attempt for ${clientReportId}:`, err);
  }
}
