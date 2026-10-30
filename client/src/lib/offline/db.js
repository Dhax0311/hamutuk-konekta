import Dexie from 'dexie';

export const db = new Dexie('HamutukLocalDB');

db.version(1).stores({
  reports: 'client_report_id, category, administrative_post, suco, priority, sync_status, created_at',
  needs: 'id, category, location, urgency, status, created_at',
  warnings: 'id, category, target_area, severity, issued_at',
  sites: 'id, name, post, status, last_heartbeat',
  syncQueue: '++id, client_id, item_type, status, queued_at'
});

export default db;
