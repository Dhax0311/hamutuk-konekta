# HAMUTUK 2.0 — Disaster Coordination & Network Resilience

**Vorakai Konekta Challenge • Timor-Leste**  
**Track**: BUILD  
**Grand Challenge**: C — Disaster Resilience & Early Warning  
**Pilot Context**: Viqueque Municipality  
**Primary Language**: Tetum-first, with English evaluation fallback.

> **Important Disclosure**: HAMUTUK is an offline-first disaster coordination prototype and network resilience monitoring concept. It does not replace emergency dispatch (112/115) or clinical triage services, and does not generate meteorological predictions on its own.

---

## 1. Project Structure
- `client/`: React 19 + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`) + Workbox PWA + Dexie IndexedDB
- `server/`: Node.js + Express (ES Modules) + MySQL (`mysql2` pool) + Zod + bcryptjs + JWT + Helmet + Rate Limit
- `docs/`:
  - [docs/deployment-plan.md](docs/deployment-plan.md): Production architecture and security
  - [docs/demo-script.md](docs/demo-script.md): Step-by-step judge demonstration guide
  - [docs/qa-checklist.md](docs/qa-checklist.md): Verified test cases and acceptance criteria
  - [docs/API.md](docs/API.md): Complete REST API contract
  - [docs/DATABASE.md](docs/DATABASE.md): MySQL schema and relational structure

---

## 2. Getting Started & Setup

### Prerequisites
- Node.js (v18+ or v20 LTS)
- MySQL Server (v8.0+) running locally or on network

### Backend Setup (Server)
1. Open terminal in `server`:
   ```bash
   cd server
   npm install
   ```
2. Verify or update `server/.env`:
   ```env
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=hamutuk_db
   DB_USER=hamutuk_app_user
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_generated_random_secret_here
   ADMIN_NAME=HAMUTUK Administrator
   ADMIN_EMAIL=admin@hamutuk.local
   ADMIN_PASSWORD=your_secure_admin_password_here
   ```
3. Run the automated migration and admin seed:
   ```bash
   npm run seed
   ```
   *(This automatically creates the database tables from `database/schema.sql`, provisions the initial Administrator account, and seeds simulation SiteWatch sites including DEMO Suco A and DEMO Suco B)*.
4. Start the backend:
   ```bash
   npm run dev
   ```
   Runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

### Frontend Setup (Client)
1. Open a second terminal in `client`:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Runs at `http://localhost:5173`.
2. To build for production and verify PWA service worker precaching:
   ```bash
   npm run build
   ```

---

## 3. Core Operational Features & Workflow

### Offline-First Architecture
1. **Local-First Persistence**: Reports are validated and saved immediately to local IndexedDB (`Dexie`) on the device.
2. **Stable Client UUID**: Every report is assigned a persistent client-generated ID (`rep-<timestamp>-<uuid>`) ensuring idempotent synchronization.
3. **PWA Shell Caching**: VitePWA caches HTML, CSS, JavaScript, icons and fonts. Authenticated private `/api` endpoints are strictly excluded (`NetworkOnly`) to prevent data leakage.
4. **Foreground Synchronization**: When connection returns, reports sync via `POST /api/reports/sync`. Individual acknowledgements update each report independently.
5. **Clear Offline Status Badges**:
   - `SAVED_ON_DEVICE`: *"Rai ona iha aparellu ne'e"* (Saved on this device)
   - `PENDING_SYNC`: *"Hein sincronizasaun"* (Pending synchronisation)
   - `SYNCING`: *"Sincroniza daudaun..."* (Synchronising...)
   - `SERVER_ACKNOWLEDGED`: *"Simu ona husi servidor sentrál"* (Received by central server)
   - `SYNC_FAILED`: *"Sincronizasaun falla — presiza koko fali"* (Sync failed — retry required)

### SiteWatch Network Telemetry (Simulation)
- Prototype monitoring dashboard for 5 administrative post hubs plus **DEMO Suco A** and **DEMO Suco B**.
- Heartbeat states: `ONLINE`, `STALE / LAST SEEN`, `UNREACHABLE`, and `UNKNOWN`.
- Configurable stale threshold (5m, 15m, 30m, 60m).
- Interactive **Stop** and **Resume** buttons for live simulation testing.
- Missing heartbeats are never falsely attributed to router/power failure without technician verification.

---

## 4. API Endpoints Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service and database status | Public |
| `POST` | `/api/auth/login` | Sign in with email and password | Public (Rate Limited) |
| `GET` | `/api/auth/me` | Current authenticated user profile | Authenticated |
| `GET` | `/api/reports` | List disaster incident reports | Authenticated |
| `POST` | `/api/reports` | Create single report (idempotent) | Authenticated |
| `POST` | `/api/reports/sync` | Batch idempotent report synchronization | Authenticated |
| `PATCH` | `/api/reports/:id/verify`| Mark report verified | Municipal Coordinator / Admin |
| `GET` | `/api/needs` | List community urgent needs | Authenticated |
| `POST` | `/api/needs` | Record urgent community need | Authenticated |
| `GET` | `/api/warnings` | List official early warnings | Public / Authenticated |
| `POST` | `/api/warnings` | Publish official warning | Municipal Coordinator / Admin |
| `GET` | `/api/sitewatch/sites`| List participating network points | Authenticated |
| `POST` | `/api/sitewatch/sites/:id/heartbeat` | Send simulation heartbeat | Authenticated |
| `GET` | `/api/users` | List authorized personnel | Admin Only |
| `POST` | `/api/users` | Provision new staff account | Admin Only |

---

## 5. Known Limitations & Operational Boundaries
- **Power Reliance**: The system runs on field mobile phones or tablets; it cannot operate if physical batteries are completely depleted.
- **Manual Cache Deletion**: If an operator manually clears all browser storage before synchronizing, un-synced IndexedDB data on that device may be removed.
- **Simulation Telemetry**: SiteWatch telemetry is prototype simulation designed for the Konekta Challenge demonstration; it does not replace core ISP router infrastructure.
