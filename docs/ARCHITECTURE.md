# HAMUTUK 2.0 Architecture & Design Overview

## 1. System Vision
HAMUTUK 2.0 is an offline-first disaster coordination and network resilience dashboard prototype tailored for Timor-Leste (Viqueque pilot).
It enables suco-level officers to record incidents and community needs without Internet access, stores them securely in IndexedDB on the local device, and synchronises them idempotently once connectivity is restored.

## 2. Key Modules
1. **Disaster Reports**: Offline recording of floods, landslides, wind damage, road blocks, medical emergencies. Reports receive a stable UUID client ID (`client_report_id`).
2. **Community Needs**: Tracking water, food, medicine, shelter, and transport requests.
3. **SiteWatch**: Simulation-based telemetry monitoring of community Wi-Fi / connectivity sites (ONLINE, STALE / LAST SEEN, UNREACHABLE, UNKNOWN).
4. **Official Warnings**: Dissemination register for verified civil protection and meteorological alerts.
5. **Sync Queue**: Foreground & background synchronisation manager displaying clear local-only vs. server-acknowledged states.
6. **User & Roles**: Role-based access control for ADMIN, SUCO_OFFICER, and MUNICIPAL_COORDINATOR.

## 3. Technology Stack
- **Client**: React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), React Router DOM 7, Lucide React, Dexie (IndexedDB), Axios, vite-plugin-pwa.
- **Server**: Node.js, Express 5, MySQL (`mysql2` connection pool), Zod, bcryptjs, jsonwebtoken, Helmet, CORS, express-rate-limit.
