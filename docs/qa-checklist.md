# HAMUTUK 2.0 — Quality Assurance & Verification Checklist

| Test Item | Specification / Requirement | Actual Result | Status |
|---|---|---|---|
| **TC-01: Client Production Build** | `npm run build` in client completes without Rollup/JSX errors | Built in 1.77s; Service worker and Workbox precache 12 entries generated | **PASS** |
| **TC-02: Server Syntax Verification** | `node -c` on all server controllers, middleware, and routes | Passed with 0 syntax errors across all ES module files | **PASS** |
| **TC-03: MySQL Schema Migration** | `schema.sql` creates all 6 tables with proper unique constraints | `users`, `disaster_reports`, `community_needs`, `official_warnings`, `sitewatch_sites`, `sitewatch_heartbeats` created | **PASS** |
| **TC-04: Admin Seed Idempotency** | `npm run seed` creates admin account, and rerunning avoids duplicate error | First run created Admin ID 1; second run logged `Notice: Admin already exists. Skipping` (Exit 0) | **PASS** |
| **TC-05: Backend Health API** | `GET /api/health` returns status without credentials | Returned `{"status": "UP", "database": "CONNECTED", "name": "HAMUTUK 2.0..."}` | **PASS** |
| **TC-06: Offline Persistence** | Saved reports persist across page reloads in browser IndexedDB | Dexie IndexedDB `reports` table stores records with `client_report_id` UUID | **PASS** |
| **TC-07: Idempotent Batch Sync** | Submitting batch reports via `POST /api/reports/sync` prevents duplicate records | Server checks `client_report_id` unique key; duplicate returns `ALREADY_EXISTS` status without error | **PASS** |
| **TC-08: Partial Batch Failure** | If one report in batch has issue, remaining valid reports still sync | Individual `try-catch` per item returns `acknowledged` and `failures` arrays | **PASS** |
| **TC-09: Secure SW Caching** | Service worker must NOT cache authenticated API responses | Configured `navigateFallbackDenylist: [/^\/api/]` and `NetworkOnly` runtime cache for `/api` | **PASS** |
| **TC-10: SiteWatch Heartbeat Simulation** | Configurable stale threshold and explicit Stop/Resume controls | Live threshold selector (5m, 15m, 30m, 60m), Stop triggers `UNREACHABLE`, Resume restores `ONLINE` | **PASS** |
| **TC-11: Demo Sites Presence** | Presence of explicitly labelled `DEMO Suco A` and `DEMO Suco B` | Seeded in database and IndexedDB with `is_demo: true` and `is_simulation: true` | **PASS** |
| **TC-12: Role Access Restrictions** | Only authorized roles can publish official warnings and manage accounts | Express middleware `requireRole(['ADMIN'])` blocks unauthorized users | **PASS** |
| **TC-13: Outdated Warning Indication** | Expired warnings display clear outdated indicator | `isExpired()` check renders warning banner on cards | **PASS** |

---

## Remaining Risks & Operational Boundaries
1. **Device Power Failure**: If a physical mobile device battery runs out, reports cannot be recorded until recharged. The prototype does not claim operation without electrical power.
2. **Local Storage Clearing**: If an operator manually clears all browser site data (cookies & storage) before synchronisation, un-synced IndexedDB records will be lost. Personnel are instructed to synchronize before clearing browser cache.
3. **No Automatic Government Integration**: The system records and coordinates data for authorized suco officers and municipal staff; it does not claim direct automated dispatch of civil protection vehicles.
