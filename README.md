# HAMUTUK 2.0 — Disaster Coordination & Network Resilience

**Vorakai Konekta Challenge 2026 · Timor-Leste**
**Track:** BUILD
**Grand Challenge:** C — Disaster Resilience & Early Warning
**Pilot Location:** Viqueque Municipality, Timor-Leste\


\<p align="center">
&#x20; \<strong>Sistema digital offline-first atu ajuda komunidade relata dezastre no hadi'a emergency coordination, maski internet la estável.\</strong>
\</p>

\<p align="center">
&#x20; \<a href="[https://vorakai-konekta.daniloviana.com](https://vorakai-konekta.daniloviana.com)">
&#x20;   \<strong>🌐 Test HAMUTUK Live Demo\</strong>
&#x20; \</a>
\</p>

---

## 1. About HAMUTUK

**HAMUTUK 2.0** mak protótipu digital ida ne'ebé dezenvolve atu ajuda komunidade iha Munisípiu Viqueque, Timor-Leste, atu relata incidentes, rejista nesesidade urgente, no hadi'a coordination durante disaster situations.

Iha área rurál no área remota sira, internet bele fraku ka interrompe, liuliu bainhira akontese udan boot, inundasaun, rai-halai, ka power outage. Bainhira koneksaun la iha, komunidade bele hasoru difikuldade atu haruka informasaun importante ba autoridade.

HAMUTUK uza **offline-first approach**, ne'ebé permite aplikasaun rai relatóriu lokalmente iha device no sincroniza ba server bainhira internet fila fali, se offline functionality ne'e disponivel no funsiona iha deployment ne'ebé uza.

### Main Objectives

- Permite komunidade atu kria disaster reports maski internet la iha.
- Rai relatóriu lokalmente no synchronize bainhira connectivity returns.
- Uza Tetum-first interface ne'ebé simples no fasil atu komprende.
- Ajuda autoridade organiza no review disaster reports.
- Hatudu network connectivity status liuhusi SiteWatch simulation.
- Design sistema ne'ebé konsidera shared Starlink connections, limited bandwidth, power interruptions, no basic digital literacy.

> **Important Safety Disclosure**
>
> HAMUTUK mak disaster coordination prototype, la'ós official emergency dispatch system. Nia la substitui ambulance, health services, clinical triage, ka emergency communication procedures. Sistema ne'e mós la produz meteorological forecasts rasik. Relatóriu ne'ebé kria offline sei la to'o ba autoridade to'o iha communication channel ne'ebé disponivel.

---

## 2. Live Demo

### Test HAMUTUK Online

🌐 **Live Demo:** [https://vorakai-konekta.daniloviana.com](https://vorakai-konekta.daniloviana.com)

Ita bele asesu live demo atu explora interface no feature sira ne'ebé disponivel iha deployment atual.

### Suggested Demo Flow

1. Open live demo iha browser.
2. Explore homepage no application navigation.
3. Haree incident reporting interface.
4. Explore administrative dashboard no interactive map, se disponivel.
5. Test SiteWatch monitoring simulation.
6. Se deployment suporta offline mode, koko kria relatóriu bainhira internet off no verifica synchronization bainhira internet fila fali.

**Important:** Feature sira ne'ebé ita bele testa depende ba implementasaun no configuration iha live server. Ba testing, uza demo data de'it. Labele hatama real personal information, medical information, ka confidential emergency reports.

---

## 3. Project Status

HAMUTUK 2.0 mak protótipu ne'ebé dezenvolve ba Vorakai Konekta Challenge 2026.

Projetu nia architecture inklui frontend application, backend API, database, no SiteWatch monitoring simulation.

Feature status tenke verifika tuir code no live deployment atual.

| Component                | Purpose                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| Incident Reporting       | Kria no rejista disaster incident reports                           |
| Offline Storage          | Rai relatóriu iha device bainhira offline, se implementadu no ativu |
| Synchronization          | Haruka pending reports bainhira internet fila fali                  |
| Administrative Dashboard | Ajuda authorized personnel review relatóriu                         |
| Interactive Map          | Visualiza report locations, se disponivel                           |
| SiteWatch Simulation     | Demonstra network monitoring states                                 |
| Authentication           | Kontrola asesu ba protected functions                               |

Feature balu bele presiza additional implementation, configuration, ka testing antes uza iha real-world operations.

---

## 4. Core Features

### 4.1 Offline-First Incident Reporting

HAMUTUK nia offline-first design atu permite utilizadór kria relatóriu maski internet la disponivel.

Intended workflow:

1. User kria incident report.
2. Application valida informasaun.
3. Report rai iha local device storage.
4. Application hatudu synchronization status.
5. Bainhira internet fila fali, application koko synchronize report ba backend.
6. Report status atualiza depois server fó acknowledgement.

Local persistence uza IndexedDB liuhusi Dexie, tuir projetu nia documented architecture.

### Report Synchronization Status

| Status                | Tetum Label                              | Meaning                                |
| --------------------- | ---------------------------------------- | -------------------------------------- |
| `SAVED_ON_DEVICE`     | Rai ona iha aparellu ne'e                | Report rai ona iha device              |
| `PENDING_SYNC`        | Hein sincronizasaun                      | Report hein atu synchronize            |
| `SYNCING`             | Sincroniza daudaun...                    | Synchronization la'o hela              |
| `SERVER_ACKNOWLEDGED` | Simu ona husi servidor sentrál           | Server konfirma katak report simu ona  |
| `SYNC_FAILED`         | Sincronizasaun falla — presiza koko fali | Synchronization falla no presiza retry |

Status sira-ne'e ajuda utilizadór komprende se report rai de'it iha device ka server simu ona.

**Limitation:** Offline storage la garante delivery. Se device mate bateria, estraga, ka browser storage apaga antes synchronization, relatóriu ne'ebé seidauk synchronize bele lakon.

### 4.2 Disaster Reports & Community Needs

Backend API inklui endpoints atu suporta:

- Disaster incident reports.
- Community urgent needs.
- Report verification.
- Official early warnings.

Sistema ne'e planeia atu ajuda authorized personnel review informasaun ne'ebé komunidade relata.

Maibé, relatóriu ida la sai automaticamente verified. Autoridade ka personnel responsavel tenke verifica informasaun antes konsidera hanesan confirmed incident.

### 4.3 Administrative Coordination

HAMUTUK nia administrative workflow planeia atu conecta:

- Aldeia
- Suku
- Postu Administrativu
- Municipality

Objetivu mak ajuda organiza reports, melhora visibility, no suporta coordination entre authorized personnel.

Workflow dijitál ne'e la garante katak autoridade sei simu ka responde ba report bainhira communication channels hotu interrompe.

### 4.4 SiteWatch Network Telemetry — Simulation

SiteWatch iha HAMUTUK mak prototype simulation atu demonstra network monitoring concepts.

Tuir dokumentasaun projetu, simulation inklui:

- Five administrative-post hub entries.
- DEMO Suco A no DEMO Suco B.
- `ONLINE` status.
- `STALE / LAST SEEN` status.
- `UNREACHABLE` status.
- `UNKNOWN` status.
- Configurable stale thresholds: 5, 15, 30, no 60 minutes.
- Stop no Resume controls ba live simulation testing.

**Important:** SiteWatch telemetry iha protótipu ne'e simulated data. Nia la representa verified live monitoring ba ISP routers, Starlink terminals, ka physical network infrastructure.

Missing heartbeat la signifika automaticamente katak router ka power failure akontese. Technician verification sei presiza atu konfirma problema.

---

## 5. Technology Stack

HAMUTUK uza teknolojia sira tuirmai, tuir projetu nia current documented architecture.

### Frontend

- React 19
- Vite 8
- Tailwind CSS v4
- `@tailwindcss/vite`
- Workbox / Vite PWA
- Dexie + IndexedDB ba local data storage

### Backend

- Node.js
- Express.js
- JavaScript ES Modules
- MySQL
- `mysql2`
- Zod ba data validation
- `bcryptjs` ba password hashing
- JWT ba authentication
- Helmet ba HTTP security headers
- Rate limiting

### System Architecture

```text
Community Users
       |
       v
React + Vite PWA
       |
       +-------------------------+
       |                         |
       v                         v
Local IndexedDB              Backend API
(Dexie)                      (Express.js)
       |                         |
       |                         v
       |                    MySQL Database
       |
       +---- Synchronize bainhira
             internet fila fali
```

Architecture ida-ne'e atu hamenus dependénsia ba continuous connectivity bainhira kria relatóriu, no uza central backend ba synchronized records no administrative workflows.

---

## 6. Project Structure

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

Ne'e simplified project structure. File no folder sira bele muda tuir development.

---

## 7. Getting Started — Local Development

Se ita hakarak download no run HAMUTUK iha ita-nia computer, tuir setup steps sira.

### Prerequisites

Instala:

- Node.js v18 ka liu, ho LTS version ne'ebé kompatível ho dependencies.
- MySQL Server 8.0 ka liu.
- npm.
- Git.

### 7.1 Clone Repository

```bash
git clone https://github.com/Dhax0311/hamutuk-konekta.git
cd hamutuk-konekta
```

### 7.2 Backend Setup

Loke terminal iha server directory:

```bash
cd server
npm install
```

Kria `server/.env` no configura ho ita-nia local environment.

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

Troka example values ho konfigurasaun lokal ne'ebé loos.

### Security Notes

- Labele commit `server/.env` ba GitHub.
- Uza strong, randomly generated JWT secret.
- Uza strong administrator password.
- Uza dedicated MySQL user ho required permissions de'it.
- Labele uza development credentials iha production.
- Labele hatudu passwords ka database credentials iha screenshot no demo video.

### 7.3 Database Setup

Kria `hamutuk_db` database no configura MySQL user tuir ita-nia local environment.

Depois, iha `server/` directory, run:

```bash
npm run seed
```

Tuir dokumentasaun projetu, komandu ida-ne'e prepara database schema, kria initial administrator account, no seed SiteWatch demonstration entries.

Verifika seed script no database configuration antes run. Ba testing, uza development database, la'ós production database.

### 7.4 Start Backend

Iha `server/` directory:

```bash
npm run dev
```

Documented backend address:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

### 7.5 Start Frontend

Loke terminal foun, fila ba repository root, no run:

```bash
cd client
npm install
npm run dev
```

Documented frontend address:

`http://localhost:5173`

### 7.6 Production Build

Iha `client/` directory:

```bash
npm run build
```

Komandu ne'e gera frontend production build tuir Vite configuration.

Ba production deployment, configura API base URL, backend origin, HTTPS, database access, no environment variables tuir server environment.

---

## 8. API Endpoints

Tabela ida-ne'e resume API endpoints ne'ebé dokumenta ona. Verifika backend implementation atu konfirma behavior no authorization.

| Method  | Endpoint                             | Description                 | Access                        |
| ------- | ------------------------------------ | --------------------------- | ----------------------------- |
| `GET`   | `/api/health`                        | Service and database status | Public                        |
| `POST`  | `/api/auth/login`                    | Login ho email no password  | Public, rate-limited          |
| `GET`   | `/api/auth/me`                       | Current user profile        | Authenticated                 |
| `GET`   | `/api/reports`                       | Lista disaster reports      | Authenticated                 |
| `POST`  | `/api/reports`                       | Kria disaster report        | Authenticated                 |
| `POST`  | `/api/reports/sync`                  | Synchronize pending reports | Authenticated                 |
| `PATCH` | `/api/reports/:id/verify`            | Verify report               | Municipal Coordinator / Admin |
| `GET`   | `/api/needs`                         | Lista community needs       | Authenticated                 |
| `POST`  | `/api/needs`                         | Rejista community need      | Authenticated                 |
| `GET`   | `/api/warnings`                      | Lista early warnings        | Public / Authenticated        |
| `POST`  | `/api/warnings`                      | Publika official warning    | Municipal Coordinator / Admin |
| `GET`   | `/api/sitewatch/sites`               | Lista monitoring points     | Authenticated                 |
| `POST`  | `/api/sitewatch/sites/:id/heartbeat` | Submit simulation heartbeat | Authenticated                 |
| `GET`   | `/api/users`                         | Lista authorized personnel  | Admin only                    |
| `POST`  | `/api/users`                         | Kria staff account          | Admin only                    |

Ba request payloads, response formats, validation rules, no error handling, haree [API Documentation](docs/API.md).

---

## 9. Security & Privacy

HAMUTUK bele involve disaster reports no community needs ne'ebé iha informasaun sensível. Tanba ne'e, security no privacy tenke sai prioridade.

Projetu nia documented security stack inklui authentication, password hashing, validation, security headers, no rate limiting.

Antes real-world deployment, presiza review no test:

- Authentication and authorization ba protected endpoints.
- HTTPS configuration.
- Secure JWT handling.
- Database permissions.
- Input validation and error handling.
- Protection of sensitive information in logs.
- Data retention and deletion policies.
- Recovery procedures ba unsynchronized reports.
- Backup and restoration procedures.
- Privacy protection ba vulnerable people.

Offline data iha device bele asesivel ba ema ne'ebé iha access ba device ka browser profile. Local storage la signifika katak data automaticamente encrypted ka fully secure.

Labele uza public demo atu submete real medical information, personal details, ka confidential emergency reports.

---

## 10. Known Limitations

HAMUTUK mak prototype no iha operational limitations.

### Connectivity

Se communication channels hotu la iha, offline reports la bele to'o ba central server to'o koneksaun ka dalan komunikasaun seluk disponivel.

### Power

Application la bele funsiona bainhira device nia bateria hotu no la bele liga.

### Local Storage

Se browser storage apaga antes synchronization, pending reports bele lakon.

### SiteWatch

Telemetry mak simulation; la konfirma real status hosi physical network equipment.

### Emergency Response

HAMUTUK la substitui official emergency dispatch, medical services, ka established emergency response procedures.

### Operational Readiness

Real deployment presiza additional testing, coordination ho responsible authorities, user training, security review, no operational procedures.

---

## 11. Testing & Quality Assurance

Projetu inklui QA checklist:

[QA Checklist](docs/qa-checklist.md)

Test scenarios ne'ebé importante:

- Kria report bainhira internet normal.
- Kria report bainhira offline.
- Restore connectivity no synchronize pending reports.
- Test synchronization failure.
- Prevent duplicate report creation during retries.
- Test authentication and access control.
- Test SiteWatch simulation.
- Test behavior bainhira local storage la disponivel ka apaga.

Marka test hanesan passed de'it depois ita executa duni no rejista rezultadu.

---

## 12. Demo Guide

Ba demonstration step-by-step, haree:

[Demo Script](docs/demo-script.md)

Suggested demo flow:

1. Open HAMUTUK live demo.
2. Esplika connectivity challenges iha komunidade rurál.
3. Demonstra incident reporting interface.
4. Se deployment suporta, kria report bainhira offline.
5. Restore internet no demonstra synchronization.
6. Explore administrative dashboard and map.
7. Demonstra SiteWatch simulation.
8. Esplika system limitations no emergency fallback procedures.

Se offline synchronization seidauk funsiona iha live deployment, esplika limitasaun ne'e ho honestidade no demonstra feature ne'e iha local environment se funsiona.

---

## 13. Future Development

Feature no improvement sira ne'ebé bele dezenvolve iha futuru:

- Comprehensive offline synchronization testing.
- Stronger protection ba sensitive local data.
- Improved Tetum language support and accessibility.
- Field testing ho community representatives.
- Better administrative verification workflow.
- Improved monitoring and operational reporting.
- Integration ho authorized real network monitoring systems, se access disponivel.
- Clear emergency communication fallback procedures.
- Performance improvements ba low-bandwidth environments.

Lista ida-ne'e mak future development goals, la'ós deklarasaun katak feature hotu implementa ona.

---

## 14. Documentation

Dokumentasaun projetu:

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
**Pilot Location:** Viqueque Municipality, Timor-Leste
**Project:** HAMUTUK 2.0 — Disaster Coordination & Network Resilience

**Live Demo:** [https://vorakai-konekta.daniloviana.com](https://vorakai-konekta.daniloviana.com)

---

## 16. Final Note

HAMUTUK nia objetivu mak ajuda komunidade rai no organiza informasaun importante maski internet la estável.

**Our principle:** Komunidade bele rejista informasaun importante maski internet la iha, no sistema tenke hatudu klaru se relatóriu rai de'it iha device ka server simu ona.

HAMUTUK mak step ida ba more resilient community coordination. Nia la substitui emergency services ka reliable communication infrastructure.
