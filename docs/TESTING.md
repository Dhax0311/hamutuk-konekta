# HAMUTUK 2.0 — Testing & Verification Guide

This document details the test procedures, acceptance criteria, and verification steps for both frontend and backend modules.

## 1. Acceptance Criteria Checklist

| # | Test Scenario | Expected Outcome | Verification Status |
|---|---|---|---|
| 1 | Frontend Production Build | `npm run build` succeeds without JSX/CSS/PWA bundle errors | Verified (`dist/` built cleanly) |
| 2 | Backend Health Endpoint | `GET /api/health` returns status without revealing database secrets | Verified |
| 3 | Admin Account Seed | `npm run seed` safely provisions administrator from `.env` without password leaks | Verified |
| 4 | Offline Persistence | Reports saved while offline persist in IndexedDB across browser reloads | Verified (Dexie schema) |
| 5 | Clear Offline/Sync States | UI displays distinct badges: `Device Local Only` vs `Server Acknowledged` | Verified |
| 6 | Idempotent Sync | Resending an existing `client_report_id` returns acknowledgement without creating duplicate records | Verified |
| 7 | SiteWatch Simulation | Interactive toggle triggers heartbeat arrival or outage and clearly marks telemetry as `SIMULATION` | Verified |
| 8 | Role-based Authorization | Suco officers cannot access Admin user management or publish official warnings | Verified |

---

## 2. Testing Frontend Offline Workflow
1. Start the client:
   ```bash
   cd client
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.
3. In the top navigation bar, click the **ONLINE / OFFLINE** toggle pill.
   - You will see the persistent amber banner: `MODU OFFLINE ACTIVU — SIMULASAUN`.
4. Click **Kria Relatóriu Foun (Create Report)**.
5. Fill the form (Category: *Be'e Sa'e / Inundasaun*, Post: *Uato-Lari*, Priority: *Urxente Liu*).
6. Click **Rai Relatóriu Dezastre**.
   - Notice the system immediately displays: `Rai ona iha aparellu ne'e — Seidauk to'o servidor sentrál.`
   - Never claims sent successfully before server confirmation!
7. Reload the page (F5).
   - Check **Fila Sincronizasaun (Sync Queue)**: the report is still safely preserved in Dexie IndexedDB.
8. Click **Koneka Fali (Reconnect)** on the top banner.
9. Click **Sincroniza Agora (Synchronise Now)**.
   - The report transitions to `SERVER_ACKNOWLEDGED` with an acknowledgement timestamp.

---

## 3. Testing Backend & MySQL API
### Database Setup
1. Open MySQL CLI or workbench and execute:
   ```sql
   SOURCE server/database/schema.sql;
   ```
2. Verify credentials in `server/.env`.
3. Seed the admin account:
   ```bash
   cd server
   npm run seed
   ```
4. Start backend:
   ```bash
   npm run dev
   ```
5. Test health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```
