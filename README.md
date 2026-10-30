# HAMUTUK 2.0 — Disaster Coordination & Network Resilience

**Vorakai Konekta Challenge 2026 · Timor-Leste**  
**Track:** BUILD  
**Grand Challenge:** C — Disaster Resilience & Early Warning  
**Pilot Context:** Viqueque Municipality, Timor-Leste  
**Primary Language:** Tetum-first, with English evaluation support

<p align="center">
  <strong>Offline-first disaster reporting and coordination for communities facing unreliable connectivity.</strong>
</p>

<p align="center">
  <a href="https://vorakai-konekta.daniloviana.com">
    <strong>🌐 Try the Live Demo</strong>
  </a>
</p>

---

## 1. About HAMUTUK

HAMUTUK 2.0 is an offline-first disaster coordination and network resilience prototype designed for communities in Viqueque Municipality, Timor-Leste.

In rural and remote areas, unstable internet connectivity, shared satellite connections, power interruptions, and limited digital literacy can make it difficult to report emergencies and coordinate responses.

HAMUTUK aims to help communities record incident reports even when internet connectivity is unavailable, then synchronize those reports with a central server when connectivity returns.

The platform also includes an administrative dashboard concept for reviewing reports, monitoring registered connectivity points, and supporting coordination between aldeia, suku, administrative post, and municipality levels.

### Key Objectives

- Enable incident reporting during temporary internet outages.
- Store reports locally and synchronize them when connectivity returns.
- Provide a simple, Tetum-first interface for community users.
- Support structured reporting and administrative coordination.
- Demonstrate network monitoring concepts through SiteWatch simulation.
- Design for limited bandwidth, shared satellite connections, and intermittent power.

> **Important Safety Disclosure**
>
> HAMUTUK is a disaster coordination prototype, not an official emergency dispatch system. It does not replace emergency services, clinical triage, or established emergency communication procedures. It does not independently generate meteorological forecasts. Reports created offline cannot reach authorities until a communication channel becomes available.

---

## 2. Live Demo

### Try HAMUTUK Online

**Live Demo:** https://vorakai-konekta.daniloviana.com

The online demo allows reviewers to explore the deployed application and evaluate its available features.

**Suggested evaluation flow:**

1. Open the live demo.
2. Explore the available interface and navigation.
3. Review the disaster reporting workflow.
4. Examine the administrative dashboard and map, if available.
5. Explore SiteWatch monitoring and identify which information is simulated.
6. Test offline functionality where supported by the deployed environment.

**Important:** Actual functionality depends on the current deployment and available configuration. Do not submit real personal information or sensitive emergency reports through a competition demo. Use demonstration data only.

---

## 3. Project Status

HAMUTUK is being developed as a prototype for the Vorakai Konekta Challenge.

The project includes an offline-first application architecture, a backend API, a database layer, and a SiteWatch monitoring simulation.

The implementation status of individual features should be verified against the deployed application and current code.

| Component | Purpose |
|---|---|
| Incident reporting | Record disaster incidents and community needs |
| Offline storage | Preserve reports locally when supported by the application |
| Synchronization | Transfer pending reports when connectivity returns |
| Administrative dashboard | Review and coordinate incident reports |
| Interactive map | Help visualize report locations |
| SiteWatch simulation | Demonstrate network monitoring states |
| Authentication and roles | Restrict access to authorized functions |

Some capabilities may require additional implementation, configuration, or testing before operational deployment.

---

## 4. Core Features

### 4.1 Offline-First Incident Reporting

HAMUTUK is designed to support report creation without requiring a continuous internet connection.

The intended workflow is:

1. A user creates an incident report.
2. The application validates the information.
3. The report is stored locally on the device.
4. The application marks the report as pending synchronization.
5. When connectivity returns, the application attempts to synchronize the report.
6. The application updates the report status after receiving a server acknowledgement.

The local-first architecture uses IndexedDB through Dexie.

#### Report Synchronization Status

| Status | Tetum Label | Meaning |
|---|---|---|
| `SAVED_ON_DEVICE` | Rai ona iha aparellu ne'e | Saved locally on the device |
| `PENDING_SYNC` | Hein sincronizasaun | Waiting to synchronize |
| `SYNCING` | Sincroniza daudaun... | Synchronization in progress |
| `SERVER_ACKNOWLEDGED` | Simu ona husi servidor sentrál | Acknowledged by the server |
| `SYNC_FAILED` | Sincronizasaun falla — presiza koko fali | Synchronization failed and needs retrying |

These statuses are intended to help users understand whether a report is stored locally, waiting to be sent, or acknowledged by the server.

**Limitation:** Offline storage does not guarantee delivery. If a device loses power, is damaged, or has its browser storage cleared before synchronization, unsynchronized reports may be lost.

### 4.2 Disaster and Community Needs Reporting

The backend API includes endpoints intended to support:

- Disaster incident reports.
- Community urgent needs.
- Report verification.
- Official early-warning publication.

The system is designed to help authorized personnel review and coordinate information submitted by community members.

HAMUTUK does not independently verify every report. Reports must be reviewed by responsible personnel before being treated as confirmed incidents.

### 4.3 Administrative Coordination

HAMUTUK is designed around an administrative workflow connecting:

- Aldeia
- Suku
- Postu Administrativu
- Municipality

The objective is to help organize incoming reports, improve visibility, and support coordination between responsible personnel.

The workflow does not automatically guarantee that authorities receive or respond to reports during a complete communications outage.

### 4.4 SiteWatch Network Telemetry — Simulation

The prototype includes a SiteWatch monitoring simulation intended to demonstrate network resilience concepts.

The documented simulation includes:

- Five administrative-post hub entries.
- DEMO Suco A and DEMO Suco B.
- `ONLINE` status.
- `STALE / LAST SEEN` status.
- `UNREACHABLE` status.
- `UNKNOWN` status.
- Configurable stale thresholds of 5, 15, 30, and 60 minutes.
- Interactive Stop and Resume controls for simulation testing.

**Important:** SiteWatch telemetry in this prototype is simulated. It does not represent verified live monitoring of ISP routers, Starlink terminals, or physical network infrastructure.

A missing heartbeat does not automatically prove a router failure or power outage. Technical verification is required.

---

## 5. Technology Stack

The project uses the following technologies, according to its current documented architecture.

### Frontend

- React 19
- Vite 8
- Tailwind CSS v4
- `@tailwindcss/vite`
- Workbox / Vite PWA
- Dexie and IndexedDB for local data storage

### Backend

- Node.js
- Express.js
- JavaScript ES Modules
- MySQL
- `mysql2`
- Zod for validation
- `bcryptjs` for password hashing
- JWT for authentication
- Helmet for HTTP security headers
- Rate limiting

### Architecture Overview

```text
Community Users
      |
      v
React + Vite Progressive Web App
      |
      +------------------------------+
      |                              |
      v                              v
Local IndexedDB                 Backend API
(Dexie)                         (Express.js)
      |                              |
      |                              v
      |                          MySQL Database
      |
      +---- Synchronize when
            connectivity returns
```

The architecture aims to reduce dependence on continuous connectivity for report creation while using a central backend for synchronized records and administrative workflows.

---

## 6. Repository Structure

```text
hamutuk-konekta/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── database/
│   │   └── schema.sql
│   └── package.json
├── docs/
│   ├── deployment-plan.md
│   ├── demo-script.md
│   ├── qa-checklist.md
│   ├── API.md
│   └── DATABASE.md
├── .gitignore
├── AGENTS.md
└── README.md
```

This is a simplified overview. Exact files and subdirectories may vary with the current repository version.

---

## 7. Getting Started — Local Development

### Prerequisites

Install the following:

- Node.js v18 or later, preferably a supported LTS release compatible with the project dependencies.
- MySQL Server 8.0 or later.
- npm.
- Git.

### 7.1 Clone the Repository

```bash
git clone https://github.com/Dhax0311/hamutuk-konekta.git
cd hamutuk-konekta
```

### 7.2 Configure the Backend

Open a terminal in the server directory:

```bash
cd server
npm install
```

Create a local `server/.env` file using the following template:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=hamutuk_db
DB_USER=hamutuk_app_user
DB_PASSWORD=replace_with_your_mysql_password

JWT_SECRET=replace_with_a_secure_random_secret

ADMIN_NAME=HAMUTUK Administrator
ADMIN_EMAIL=admin@hamutuk.local
ADMIN_PASSWORD=replace_with_a_secure_admin_password
```

Replace the example values with your local configuration.

**Security requirements:**

- Never commit `server/.env` to GitHub.
- Use a strong, randomly generated JWT secret.
- Use a strong administrator password.
- Use a dedicated MySQL account with only the permissions required by the application.
- Do not use development credentials in production.
- Do not expose database credentials or administrator passwords in screenshots or demo recordings.

### 7.3 Prepare the Database

Create the `hamutuk_db` database and configure the MySQL user according to your local environment.

Then run the project's seed command:

```bash
npm run seed
```

According to the project documentation, this command initializes the database schema, provisions the initial administrator account, and creates demonstration SiteWatch entries.

Check the actual seed implementation and database configuration before running it. Use a development database rather than a production database for testing.

### 7.4 Start the Backend

From the `server/` directory:

```bash
npm run dev
```

The documented local backend address is:

```text
http://localhost:5000
```

Health-check endpoint:

```text
http://localhost:5000/api/health
```

### 7.5 Start the Frontend

Open a second terminal from the repository root:

```bash
cd client
npm install
npm run dev
```

The documented local frontend address is:

```text
http://localhost:5173
```

### 7.6 Build for Production

From the `client/` directory:

```bash
npm run build
```

This generates the frontend production build according to the Vite configuration.

For deployment, configure the frontend API base URL, backend origin, HTTPS, database access, and environment variables according to the deployment environment.

---

## 8. API Endpoints

The following table summarizes the documented API contract. Actual behavior and authorization requirements should be verified against the current backend implementation.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service and database status | Public |
| `POST` | `/api/auth/login` | Authenticate a user | Public, rate-limited |
| `GET` | `/api/auth/me` | Retrieve the current user profile | Authenticated |
| `GET` | `/api/reports` | List disaster reports | Authenticated |
| `POST` | `/api/reports` | Create a disaster report | Authenticated |
| `POST` | `/api/reports/sync` | Synchronize pending reports | Authenticated |
| `PATCH` | `/api/reports/:id/verify` | Verify a report | Municipal Coordinator / Admin |
| `GET` | `/api/needs` | List community needs | Authenticated |
| `POST` | `/api/needs` | Record a community need | Authenticated |
| `GET` | `/api/warnings` | List early warnings | Public / Authenticated |
| `POST` | `/api/warnings` | Publish an official warning | Municipal Coordinator / Admin |
| `GET` | `/api/sitewatch/sites` | List registered monitoring points | Authenticated |
| `POST` | `/api/sitewatch/sites/:id/heartbeat` | Submit a monitoring heartbeat | Authenticated |
| `GET` | `/api/users` | List authorized personnel | Admin only |
| `POST` | `/api/users` | Create a staff account | Admin only |

For request payloads, response formats, validation rules, and error handling, see [`docs/API.md`](docs/API.md).

---

## 9. Security and Privacy

HAMUTUK is intended to handle disaster reports and community needs, which may contain sensitive information.

The prototype's security design includes authentication, role-based access expectations, request validation, password hashing, security headers, and rate limiting.

Before real-world deployment, the following areas require review and testing:

- Authentication and authorization for every protected endpoint.
- HTTPS configuration.
- Secure handling of JWTs and session credentials.
- Database access permissions.
- Input validation and error handling.
- Protection of sensitive information in logs.
- Retention and deletion policies for local and server-side data.
- Recovery procedures for unsynchronized reports.
- Backup and restoration procedures.
- Privacy protections for vulnerable people and emergency reports.

Offline data stored on a device may remain accessible to someone with access to that device or browser profile. Local storage must not be treated as automatically encrypted or fully secure.

Do not use the public demonstration environment to submit real medical information, sensitive personal details, or confidential incident reports.

---

## 10. Known Limitations

HAMUTUK is a prototype and has important operational limitations.

### Connectivity

If all communication channels are unavailable, reports created offline cannot reach the central server until connectivity returns or another communication method becomes available.

### Power

The application cannot operate on a device whose battery is completely depleted.

### Local Storage

Clearing browser storage before synchronization may delete pending reports.

### SiteWatch

Network telemetry is simulated and does not prove the live state of physical network equipment.

### Emergency Response

HAMUTUK does not replace official emergency dispatch, medical services, or established emergency response procedures.

### Operational Readiness

Real-world deployment would require further testing, coordination with responsible authorities, user training, security review, and operational procedures.

---

## 11. Testing and Quality Assurance

The repository includes a QA checklist:

[`docs/qa-checklist.md`](docs/qa-checklist.md)

Important test scenarios include:

- Creating reports with a working internet connection.
- Creating reports while offline.
- Restoring connectivity and synchronizing pending reports.
- Handling synchronization failures.
- Preventing duplicate report creation during retries.
- Checking authentication and access control.
- Testing the SiteWatch simulation.
- Verifying behavior when local storage is unavailable or cleared.

Only mark a test as passed after it has actually been executed and its result recorded.

---

## 12. Demo Guide

For a structured demonstration, see:

[`docs/demo-script.md`](docs/demo-script.md)

A recommended demonstration sequence is:

1. Open the live application.
2. Explain the connectivity challenge faced by rural communities.
3. Demonstrate the incident reporting interface.
4. If implemented and supported by the deployment, create a report while offline.
5. Restore connectivity and demonstrate synchronization.
6. Explore the administrative dashboard and map.
7. Demonstrate the SiteWatch simulation.
8. Explain the prototype's limitations and emergency fallback procedures.

If offline synchronization is not yet working in the deployed environment, explain this honestly and demonstrate the feature locally instead.

---

## 13. Future Development

Potential improvements include:

- More comprehensive offline synchronization testing.
- Stronger protection for locally stored sensitive information.
- Improved accessibility and Tetum-language support.
- Field testing with community representatives.
- More reliable administrative verification workflows.
- Better monitoring and operational reporting.
- Integration with authorized, real network monitoring systems where access is available.
- Documented procedures for emergency communication when internet connectivity fails.
- Performance and usability improvements for low-bandwidth environments.

These are development goals, not claims that all features are already implemented.

---

## 14. Documentation

Additional project documentation:

- [Deployment Plan](docs/deployment-plan.md)
- [Demo Script](docs/demo-script.md)
- [QA Checklist](docs/qa-checklist.md)
- [API Documentation](docs/API.md)
- [Database Documentation](docs/DATABASE.md)

---

## 15. Competition Information

**Competition:** Vorakai Konekta Challenge 2026  
**Track:** BUILD  
**Grand Challenge:** C — Disaster Resilience & Early Warning  
**Pilot Context:** Viqueque Municipality, Timor-Leste  
**Project:** HAMUTUK 2.0 — Disaster Coordination & Network Resilience

**Live Demo:** https://vorakai-konekta.daniloviana.com

---

## 16. Final Note

HAMUTUK aims to make disaster reporting and coordination more resilient when connectivity is unreliable.

Its central principle is simple: **communities should be able to record important information even when the internet is unavailable, while the system clearly communicates when that information has not yet reached the central server.**

The prototype is a step toward more resilient community coordination, not a replacement for emergency services or reliable communication infrastructure.
