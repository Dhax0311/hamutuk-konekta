# HAMUTUK 2.0 — Disaster Coordination & Network Resilience

**Vorakai Konekta Challenge 2026 · Timor-Leste**  
**Track:** BUILD  
**Grand Challenge:** C — Disaster Resilience & Early Warning  
**Pilot Context:** Viqueque Municipality, Timor-Leste  
**Primary Language:** Tetum-first, with English evaluation support

<p align="center">
  <a href="https://vorakai-konekta.daniloviana.com">
    <strong>🌐 Open HAMUTUK Live Demo</strong>
  </a>
</p>

<p align="center">
  <em>Teknolojia ne'ebé ajuda komunidade kontinua relata no organiza informasaun importante, maski internet la estável.</em>
</p>

---

## 1. About HAMUTUK

**HAMUTUK 2.0** mak protótipu digital ida ba disaster coordination no network resilience, ho focus ba komunidade rurál iha Viqueque Municipality, Timor-Leste.

Iha área remota, internet bele fraku ka interrompe tanba weather conditions, shared satellite connectivity, power outages, ka limitasaun infraestrutura. Bainhira situasaun hanesan ne'e akontese, komunidade bele hasoru difikuldade atu haruka informasaun kona-ba incident reports no urgent needs ba autoridade.

HAMUTUK nia objetivu mak dezenvolve sistema **offline-first** ne'ebé bele ajuda utilizadór rejista informasaun lokalmente, depois synchronize ba central server bainhira koneksaun fila fali, se offline functionality ne'e disponivel no funsiona iha deployment atual.

Sistema ne'e mós inklui SiteWatch monitoring simulation atu demonstra oinsá network status bele organiza no monitoriza iha dashboard.

### Our Mission

> **Komunidade bele rejista informasaun importante maski internet la iha, no sistema tenke hatudu klaru se informasaun ne'e rai de'it iha device ka server simu ona.**

HAMUTUK nia design konsidera:
- Shared Starlink or satellite connectivity.
- Limited bandwidth no unstable internet.
- Power interruptions.
- Tetum-first users ho basic digital skills.
- Disaster reporting no community urgent needs.
- Network visibility no accountable information handling.

> **Important Safety Disclosure**
>
> HAMUTUK mak disaster coordination prototype, la'ós official emergency dispatch system. Nia la substitui ambulance, medical services, clinical triage, ka established emergency response procedures. Nia mós la produz meteorological predictions rasik. Bainhira connectivity la iha, offline reports la bele to'o ba authority to'o communication channel ida disponivel.

---

## 2. 🌐 Live Demo

**Test HAMUTUK Online:**  
https://vorakai-konekta.daniloviana.com

Ita bele asesu protótipu online liuhusi browser atu explora interface no feature sira ne'ebé disponivel iha deployment atual.

### Suggested Demo Flow

1. Open HAMUTUK Live Demo.
2. Explore the application interface.
3. Haree incident reporting no community needs features, se disponivel.
4. Explore administrative dashboard no map, se implementadu iha deployment.
5. Test SiteWatch monitoring simulation, se disponivel.
6. Se offline functionality disponivel, koko kria report bainhira offline no verifica synchronization depois internet fila fali.

**Testing note:** Uza demo data de'it. Labele hatama real personal information, medical information, passwords, ka confidential emergency reports iha public demo.

---

## 3. The Problem

Iha komunidade rurál no área remota iha Timor-Leste, reliable connectivity bele sai desafio, liuliu durante bad weather, power interruptions, ka disaster situations.

Bainhira internet la estável:
- Community reports bele atrasa.
- Informasaun importante bele difisil atu organiza.
- Autoridade bele falta visibility kona-ba incident reports ne'ebé seidauk verified.
- Network outages bele hamenus ability atu synchronize informasaun.
- Utilizadór ho basic digital skills presiza interface simples no klaru.

HAMUTUK foka ba problema ida ne'e liuhusi offline-first reporting concept no disaster coordination workflow.

**Pilot context:** Viqueque Municipality, Timor-Leste.

Problema no proposed solution sei presiza field validation ho komunidade no autoridade relevante atu konfirma real-world needs no operational requirements.

---

## 4. The Solution

HAMUTUK propoin digital platform ida ne'ebé combina incident reporting, community needs recording, synchronization workflow, no network monitoring simulation.

### 4.1 Offline-First Reporting

Application nia intended workflow mak:

1. Utilizadór kria incident report.
2. Application valida informasaun.
3. Report rai iha local device storage, se offline storage feature funsiona.
4. Utilizadór haree status report.
5. Bainhira internet fila fali, application koko synchronize pending reports.
6. Server acknowledgement hatudu katak server simu report.

Offline-first design ajuda hamenus dependénsia ba continuous internet connection bainhira kria report.

### 4.2 Community Needs

System API documented support ba community urgent needs, atu bele rejista informasaun kona-ba nesesidade komunidade durante incident situations.

Relatóriu hotu-hotu tenke review no verify hosi authorized personnel antes konsidera hanesan confirmed information.

### 4.3 Administrative Coordination

HAMUTUK nia concept atu suporta information coordination entre administrative levels hanesan:

- Aldeia
- Suku
- Postu Administrativu
- Municipality

Objetivu mak ajuda responsible personnel organiza no review informasaun ne'ebé komunidade submete.

Workflow digital ne'e la garante automatic response hosi autoridade. Operational responsibilities no escalation procedures presiza define ho responsible institutions.

### 4.4 SiteWatch Network Monitoring Simulation

SiteWatch iha protótipu ne'e mak simulation atu demonstra network monitoring concepts.

Simulation states inklui:
- `ONLINE`
- `STALE / LAST SEEN`
- `UNREACHABLE`
- `UNKNOWN`

Simulation bele ajuda demonstra oinsá dashboard ida hatudu heartbeat status no identify monitoring points ne'ebé presiza investigation.

**Important:** SiteWatch telemetry iha protótipu ne'e mak simulated data. Nia la representa verified live monitoring hosi Starlink terminals, ISP routers, ka physical network infrastructure.

---

## 5. Core Features

| Feature | Purpose |
|---|---|
| Incident Reporting | Kria no rejista disaster incident reports |
| Offline-First Concept | Suporta local report storage bainhira offline, se feature implementadu no ativu |
| Report Synchronization | Synchronize pending reports bainhira connection fila fali |
| Community Needs | Rejista urgent community needs |
| Report Verification | Suporta verification workflow ba authorized personnel |
| Early Warnings | API support ba warning information |
| Administrative Dashboard | Central place atu review operational information, se disponivel |
| SiteWatch Simulation | Demonstra network monitoring states |
| Tetum-First Approach | Interface no status messages ne'ebé foka ba utilizadór Tetum |

Feature sira ne'ebé bele asesu depende ba current codebase, configuration, no live deployment.

---

## 6. Offline Synchronization Status

HAMUTUK nia documented design uza IndexedDB liuhusi Dexie ba local persistence.

Status labels ne'ebé dokumenta iha projetu:

| Technical Status | Tetum Label | Meaning |
|---|---|---|
| `SAVED_ON_DEVICE` | Rai ona iha aparellu ne'e | Report rai ona iha device |
| `PENDING_SYNC` | Hein sincronizasaun | Report hein atu synchronize |
| `SYNCING` | Sincroniza daudaun... | Synchronization prosesu hela |
| `SERVER_ACKNOWLEDGED` | Simu ona husi servidor sentrál | Server konfirma katak report simu ona |
| `SYNC_FAILED` | Sincronizasaun falla — presiza koko fali | Synchronization falla no presiza retry |

### Synchronization Principle

**Saved locally does not mean delivered.**

Bainhira report rai de'it iha device, authority seidauk simu report. Report bele konsidera simu hosi server depois confirmation ne'ebé loos.

### Offline Limitations

- Device presiza iha bateria.
- Browser storage presiza hela intact.
- Report ne'ebé seidauk synchronize bele lakon se utilizadór apaga browser storage.
- Bainhira connectivity hotu interrompe, central server la simu reports foun.
- Synchronization behavior presiza test iha actual deployment antes real-world use.

---

## 7. Technology Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS v4
- `@tailwindcss/vite`
- Workbox / Vite PWA
- Dexie
- IndexedDB

### Backend

- Node.js
- Express.js
- JavaScript ES Modules
- MySQL
- `mysql2`
- Zod
- `bcryptjs`
- JSON Web Tokens (JWT)
- Helmet
- Rate limiting

### Architecture Overview

```text
Community Users
       |
       v
React + Vite PWA
       |
       +----------------------------+
       |                            |
       v                            v
Local IndexedDB                 Backend API
(Dexie)                         (Express.js)
       |                            |
       |                            v
       |                       MySQL Database
       |
       +---- Synchronize pending
             reports when
             connectivity returns
```

Architecture ne'e atu suporta local data persistence no centralized data management. Offline storage la elimina dependénsia ba power, device availability, ka eventual connectivity.

---

## 8. Repository Structure

```text
hamutuk-konekta/
├── client/
│   └── Frontend application
├── server/
│   └── Backend API and database code
├── .gitignore
└── README.md
```

Estrutura ne'e mak overview simplifikadu. Folder no file sira iha `client/` no `server/` bele muda durante development.

---

## 9. Run HAMUTUK Locally

Se ita hakarak run HAMUTUK iha local computer, presiza setup frontend, backend, no database.

### Prerequisites

- Node.js compatible ho project dependencies.
- npm.
- MySQL Server.
- Git.

### 9.1 Clone the Repository

```bash
git clone https://github.com/Dhax0311/hamutuk-konekta.git
cd hamutuk-konekta
```

### 9.2 Configure Backend

Loke terminal iha server directory:

```bash
cd server
npm install
```

Kria `server/.env` no configura environment variables tuir ita-nia local setup.

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

**Security requirements:**
- Troka placeholder values ho secure local values.
- Labele upload `.env` ba GitHub.
- Labele uza development passwords iha production.
- Uza strong, randomly generated JWT secret.
- Uza dedicated MySQL user ho permissions ne'ebé presiza de'it.

### 9.3 Prepare the Database

Kria database no MySQL user tuir local environment.

Depois, se `server/package.json` define `seed` script hanesan dokumentadu, run iha `server/` directory:

```bash
npm run seed
```

Verifika seed script no database configuration antes executa. Uza development database de'it.

### 9.4 Start the Backend

Iha `server/` directory:

```bash
npm run dev
```

Documented local backend address:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

### 9.5 Start the Frontend

Loke terminal foun no run:

```bash
cd client
npm install
npm run dev
```

Documented local frontend address:

`http://localhost:5173`

### 9.6 Build the Frontend

Iha `client/` directory:

```bash
npm run build
```

Komandu ne'e depende ba script ne'ebé define iha `client/package.json`.

---

## 10. API Overview

Backend API documented support ba endpoints tuirmai. Behavior no access control tenke konfirma ho current implementation.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service and database status |
| `POST` | `/api/auth/login` | Login ho email no password |
| `GET` | `/api/auth/me` | Current authenticated user profile |
| `GET` | `/api/reports` | Lista disaster incident reports |
| `POST` | `/api/reports` | Kria disaster report |
| `POST` | `/api/reports/sync` | Synchronize pending reports |
| `PATCH` | `/api/reports/:id/verify` | Verify incident report |
| `GET` | `/api/needs` | Lista community urgent needs |
| `POST` | `/api/needs` | Rejista urgent community need |
| `GET` | `/api/warnings` | Lista early warnings |
| `POST` | `/api/warnings` | Publish early warning |
| `GET` | `/api/sitewatch/sites` | Lista monitoring points |
| `POST` | `/api/sitewatch/sites/:id/heartbeat` | Submit SiteWatch simulation heartbeat |
| `GET` | `/api/users` | Lista authorized personnel |
| `POST` | `/api/users` | Kria staff account |

API access depende ba authentication, authorization, no server configuration.

---

## 11. Security & Privacy

Disaster-related information bele sensitive. HAMUTUK tenke trata informasaun ne'e ho cuidado.

Project stack inklui authentication, password hashing, validation, security headers, no rate limiting components.

Antes real deployment, security review tenke konsidera:

- Authentication no role-based authorization.
- HTTPS configuration.
- Secure password and JWT handling.
- Database access permissions.
- Validation ba user input.
- Protection ba sensitive data iha application logs.
- Data retention and deletion policies.
- Backup and recovery procedures.
- Local storage risks.
- Protection ba personal no medical information.

Local browser storage la garante encryption. Se device lakon, fahe, ka asesu hosi ema seluk, stored information bele iha risk.

**Labele uza public demo atu submete real medical records ka confidential emergency information.**

---

## 12. Known Limitations & Failure Scenarios

### Internet Outage

Bainhira internet la iha, reports ne'ebé rai lokalmente sei hein atu synchronize. Nia la bele to'o ba authority to'o communication channel ida disponivel.

### Power Failure

Application la bele funsiona se device nia bateria hotu no la iha power source.

### Lost Local Data

Se browser storage apaga antes synchronization, pending reports bele lakon.

### False Network Diagnosis

Heartbeat ne'ebé lakon la prova katak router estraga ka power outage akontese. Technician verification presiza atu identifika root cause.

### Unverified Reports

Community reports bele iha incomplete or incorrect information. Authorized personnel tenke verify reports antes halo operational decisions.

### Emergency Cases

HAMUTUK la'ós replacement ba ambulance, health workers, police, fire services, ka official emergency channels. Iha emergency situation, komunidade tenke uza available official emergency services no established procedures.

### Financial Sustainability

Long-term operation presiza hosting, database maintenance, security updates, backup, user training, no support. Sustainable operation presiza partnership no clear responsibility.

---

## 13. Testing

Testing tenke valida behavior iha local development no live deployment.

Suggested test scenarios:

- Create a report while online.
- Create a report while offline, if supported.
- Restore connectivity and check synchronization.
- Test retry after synchronization failure.
- Verify duplicate reports are handled correctly.
- Test login and protected routes.
- Verify user permissions.
- Test SiteWatch simulation states.
- Test behavior when local storage is unavailable.
- Test interface iha mobile screen.

Labele afirma katak test passed se seidauk executa no verify iha actual environment.

---

## 14. Future Improvements

Potential future development:

- Field testing ho community representatives iha Viqueque.
- Stronger offline data protection.
- Better low-bandwidth performance.
- Improved Tetum language support.
- More accessible interface ba users ho basic digital skills.
- Clear report verification and escalation procedures.
- Integration ho authorized real network monitoring systems.
- Better backup and recovery mechanisms.
- Training ba suco, postu, no municipality personnel.
- Defined operational ownership and maintenance plan.

Lista ne'e mak possible improvements, la'ós feature hotu implementadu ona.

---

## 15. Competition Information

**Competition:** Vorakai Konekta Challenge 2026  
**Track:** BUILD  
**Grand Challenge:** C — Disaster Resilience & Early Warning  
**Project:** HAMUTUK 2.0 — Disaster Coordination & Network Resilience  
**Pilot Context:** Viqueque Municipality, Timor-Leste

**Live Demo:** https://vorakai-konekta.daniloviana.com

**Source Code:** https://github.com/Dhax0311/hamutuk-konekta

---

## 16. Final Message

HAMUTUK 2.0 nia objetivu mak ajuda komunidade organiza no rai informasaun importante durante disaster situations, liuliu iha fatin ne'ebé internet la estável.

Offline-first design bele ajuda komunidade kria reports maski connectivity la iha, maibé sistema tenke comunica klaru kona-ba synchronization status no nia limitations.

**Our principle: Save locally. Synchronize when possible. Verify before action. Keep emergency fallback procedures available.**

**HAMUTUK — Teknolojia ba komunidade ne'ebé prontu, konektadu, no forte hamutuk.**
