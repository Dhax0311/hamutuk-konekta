# HAMUTUK 2.0 — Production Deployment & Resilience Plan

## 1. System Architecture
```
                               +-----------------------------+
                               |     Civil Protection Hub    |
                               |    (Municipal Dashboard)    |
                               +--------------+--------------+
                                              |
                                     HTTPS / TLS 1.3
                                              |
     +----------------------------------------+---------------------------------------+
     |                                        |                                       |
+----+--------------------+      +------------+------------+             +------------+------------+
|  Viqueque Villa Hub     |      |  Postu Uato-Lari Site   |             |    Postu Ossu Site      |
|  Fiber + Solar Fallback |      |  Long-range Wi-Fi Mesh  |             |  Point-to-Point Radio   |
+----+--------------------+      +------------+------------+             +------------+------------+
     |                                        |                                       |
     | [Local Wi-Fi AP]                       | [Local Wi-Fi AP]                      | [Local Wi-Fi AP]
     v                                        v                                       v
[ Suco Officer Device ]          [ Suco Officer Device ]                 [ Suco Officer Device ]
(PWA / IndexedDB Offline)        (PWA / IndexedDB Offline)               (PWA / IndexedDB Offline)
```

## 2. Infrastructure Requirements
- **Web App / PWA**:
  - Requires HTTPS / TLS 1.3 certificate (mandatory for Service Worker registration and PWA installation).
  - Hosted via Nginx or edge CDN.
- **Backend API**:
  - Node.js (v18+ or v20 LTS) running under `pm2` process manager.
  - Reverse proxy via Nginx with rate limiting, SSL termination, and request timeouts.
- **Database**:
  - MySQL 8.0+ with InnoDB storage engine.
  - Connection pooling with keep-alive.
  - UTF8MB4 character encoding.

## 3. Offline Data & Client Storage Resilience
- **Persistent Storage Request**:
  The application utilizes IndexedDB via Dexie. In production browsers, the app invokes `navigator.storage.persist()` to request that browser storage not be cleared automatically under storage pressure.
- **Storage Quota & Eviction Warnings**:
  Operational personnel are instructed not to manually clear browser site data during active disaster response until all queued reports are acknowledged by the server.
- **Offline Session Security & Limitations**:
  - Token metadata is stored in encrypted local storage for previously authenticated personnel.
  - Offline sessions are restricted to read/create field incident reports and community needs.
  - Administrative tasks (account provisioning, modifying user roles) and publishing official warnings are strictly disabled while offline to prevent spoofing or unauthorized dissemination.

## 4. Environment Variables Checklist
### Server (`server/.env`)
| Variable | Description | Example / Production Value |
|---|---|---|
| `PORT` | Listening HTTP port | `5000` |
| `CLIENT_ORIGIN` | Allowed CORS origin | `https://hamutuk.viqueque.gov.tl` |
| `DB_HOST` | MySQL host | `127.0.0.1` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `hamutuk_db` |
| `DB_USER` | MySQL user | `hamutuk_app` |
| `DB_PASSWORD` | Strong password | `[REDACTED_SECURE_PASSWORD]` |
| `JWT_SECRET` | 64+ char random secret | `[REDACTED_SECURE_JWT_SECRET]` |
| `JWT_EXPIRES_IN` | Token validity | `8h` |

### Client (`client/.env`)
| Variable | Description | Example / Production Value |
|---|---|---|
| `VITE_API_BASE_URL` | Full API URL | `https://api.hamutuk.viqueque.gov.tl/api` |

## 5. Deployment Step-by-Step
1. **Clone repository**:
   ```bash
   git clone https://github.com/vorakai-challenge/hamutuk-konekta.git
   cd hamutuk-konekta
   ```
2. **Database Provisioning**:
   ```bash
   cd server
   npm install --production
   cp .env.example .env
   # Edit .env with real credentials
   npm run seed  # Automatically runs migration and seeds initial admin
   ```
3. **Start Backend Service**:
   ```bash
   pm2 start src/server.js --name hamutuk-api
   ```
4. **Build Frontend**:
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit VITE_API_BASE_URL
   npm run build
   # Serve dist/ via Nginx
   ```

## 6. Disclaimers & Operational Scope
- HAMUTUK is an early warning, disaster coordination, and network resilience prototype.
- It does **not** replace national emergency services (112 / 115) or medical dispatch triage.
- SiteWatch provides heartbeat monitoring for participating prototype nodes; it does not replace core telecom network management.
