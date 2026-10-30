import api from '../api/client';
import {
  getPendingReports,
  markReportsSyncing,
  markReportAcknowledged,
  recordFailedAttempt,
  getLocalReportById
} from '../offline/reportsRepository';

/**
 * Executes idempotent synchronization of all pending reports
 */
export async function syncPendingReports() {
  const pending = await getPendingReports();

  if (pending.length === 0) {
    return {
      success: true,
      total: 0,
      acknowledged: 0,
      failed: 0,
      message: 'La iha relatóriu pendente atu sincroniza.'
    };
  }

  // Mark all pending reports locally as SYNCING
  const ids = pending.map((r) => r.client_report_id);
  await markReportsSyncing(ids);

  try {
    // Send batch to server API
    const response = await api.syncReportsBatch(pending);
    const data = response.data;

    let ackCount = 0;
    let failCount = 0;

    // Process server acknowledgements INDIVIDUALLY
    if (data.acknowledged && Array.isArray(data.acknowledged)) {
      for (const item of data.acknowledged) {
        await markReportAcknowledged(item.client_report_id, item.server_ack_at);
        ackCount++;
      }
    }

    // Process individual failures if any
    if (data.failures && Array.isArray(data.failures)) {
      for (const fail of data.failures) {
        await recordFailedAttempt(fail.client_report_id, fail.error);
        failCount++;
      }
    }

    const timestamp = new Date().toLocaleTimeString('tet-TL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    localStorage.setItem('hamutuk_last_sync', timestamp);

    return {
      success: failCount === 0,
      total: pending.length,
      acknowledged: ackCount,
      failed: failCount,
      timestamp,
      message: `Sincronizasaun susesu! Servidor rekonhese relatóriu ${ackCount}.`
    };
  } catch (networkErr) {
    console.warn('Sync batch failed, preserving local reports:', networkErr.message);

    // CRITICAL: On request failure or timeout, preserve every report and record retry state
    const errorMsg = networkErr.isNetworkError
      ? 'Servidor sentrál la bele kontaktu agora (Offline / Timeout).'
      : networkErr.response?.data?.message || networkErr.message;

    for (const report of pending) {
      await recordFailedAttempt(report.client_report_id, errorMsg);
    }

    return {
      success: false,
      total: pending.length,
      acknowledged: 0,
      failed: pending.length,
      error: errorMsg,
      message: 'Sincronizasaun falla. Relatóriu rai seguru hela iha aparellu no bele koko fali.'
    };
  }
}

/**
 * Synchronize a single report by its client_report_id
 */
export async function syncSingleReport(clientReportId) {
  const report = await getLocalReportById(clientReportId);
  if (!report) {
    throw new Error('Relatóriu la hetan iha aparellu.');
  }

  await markReportsSyncing([clientReportId]);

  try {
    const res = await api.createReport(report);
    const serverAckAt = res.data?.server_ack_at || new Date().toISOString();

    await markReportAcknowledged(clientReportId, serverAckAt);

    return {
      success: true,
      clientReportId,
      serverAckAt,
      isDuplicate: !!res.data?.is_duplicate,
      message: 'Servidor sentrál rekonhese ona relatóriu ne\'e.'
    };
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || 'Koneksaun falla.';
    await recordFailedAttempt(clientReportId, errorMsg);

    return {
      success: false,
      clientReportId,
      error: errorMsg,
      message: 'Falla atu haruka relatóriu. Relatóriu sei kontinua pendente iha aparellu.'
    };
  }
}
