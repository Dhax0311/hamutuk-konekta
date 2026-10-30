# HAMUTUK 2.0 — REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
Protected endpoints require a standard Bearer token in the request header:
`Authorization: Bearer <JWT_TOKEN>`

Roles: `ADMIN`, `MUNICIPAL_COORDINATOR`, `SUCO_OFFICER`

---

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Access**: Public
- **Response**:
```json
{
  "status": "UP",
  "name": "HAMUTUK 2.0 Disaster Coordination API",
  "version": "2.0.0",
  "context": "Viqueque Pilot, Timor-Leste",
  "timestamp": "2026-10-21T07:15:00.000Z",
  "database": "CONNECTED"
}
```

---

### 2. Authentication
#### `POST /api/auth/login`
- **Rate Limit**: 20 requests per 15 minutes.
- **Payload**:
```json
{
  "email": "admin@hamutuk.local",
  "password": "<YOUR_SECURE_ADMIN_PASSWORD>"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Autentikasaun ho susesu",
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "HAMUTUK Administrator",
    "email": "admin@hamutuk.local",
    "role": "ADMIN",
    "administrative_area": "Munisípiu Viqueque (Sentrál)"
  }
}
```

#### `GET /api/auth/me`
- **Access**: Authenticated

---

### 3. Disaster Reports & Idempotent Sync
#### `GET /api/reports`
- **Query Params**: `category`, `post`, `priority`, `verification_status`, `limit`
- **Access**: Authenticated

#### `POST /api/reports`
- **Access**: Authenticated
- **Payload**:
```json
{
  "client_report_id": "rep-1729501234-x8f2a",
  "category": "flooding",
  "municipality": "Viqueque",
  "administrative_post": "Uato-Lari",
  "suco": "Macadique",
  "aldeia": "Namanei",
  "description": "Be mota sae invade uma kain 18.",
  "priority": "HIGH",
  "immediate_needs": ["water", "shelter"],
  "reporter_name": "Mateus da Costa",
  "reporter_role": "SUCO_OFFICER"
}
```

#### `POST /api/reports/sync` (Batch Idempotent Synchronisation)
- **Access**: Authenticated
- **Payload**:
```json
{
  "reports": [
    {
      "client_report_id": "rep-1729501234-x8f2a",
      "category": "flooding",
      "administrative_post": "Uato-Lari",
      "suco": "Macadique",
      "description": "Mota Sahe sa'e...",
      "priority": "HIGH",
      "reporter_name": "Mateus da Costa"
    }
  ]
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Sincronizasaun finalizada. Total 1 relatóriu prosesa.",
  "synced_count": 1,
  "newly_saved": 1,
  "duplicates_recognized": 0,
  "acknowledged": [
    {
      "client_report_id": "rep-1729501234-x8f2a",
      "status": "STORED",
      "server_ack_at": "2026-10-21T07:15:30.000Z"
    }
  ]
}
```

#### `PATCH /api/reports/:id/verify`
- **Access**: `ADMIN` or `MUNICIPAL_COORDINATOR` only

---

### 4. Community Needs
- `GET /api/needs`: List needs
- `POST /api/needs`: Record community need
- `PATCH /api/needs/:id/status`: Update need status (`PENDING`, `IN_PROGRESS`, `RESOLVED`)

---

### 5. Official Warnings
- `GET /api/warnings`: List official warnings
- `POST /api/warnings`: Publish warning (`ADMIN` or `MUNICIPAL_COORDINATOR` only)

---

### 6. SiteWatch Network Resilience (Simulation)
- `GET /api/sitewatch/sites`: Get list of participating sites
- `GET /api/sitewatch/sites/:id/history`: Get heartbeat history
- `POST /api/sitewatch/sites/:id/heartbeat`: Post telemetry heartbeat
