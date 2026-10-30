# HAMUTUK 2.0 — Database Guide & Schema Architecture

## Database Engine
- MySQL 8.0+
- Character Set: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`

## Setup & Migration
1. Ensure your MySQL server service is running locally.
2. In PowerShell or MySQL command line:
   ```bash
   mysql -u root -p < server/database/schema.sql
   ```
3. Update `server/.env` with your MySQL user and password:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=hamutuk_db
   DB_USER=root
   DB_PASSWORD=your_actual_password
   ```
4. Run the seed script:
   ```bash
   cd server
   npm run seed
   ```

## Schema Relational Structure
```
+--------------------+       +----------------------+
|       users        |<------|   disaster_reports   |
+--------------------+       +----------------------+
| id (PK)            |       | id (PK)              |
| name               |       | client_report_id (UQ)|  <-- Idempotency key
| email (UQ)         |       | category             |
| password_hash      |       | administrative_post  |
| role               |       | suco                 |
| administrative_area|       | priority             |
+--------------------+       | server_ack_at        |
          ^                  +----------------------+
          |
+--------------------+       +----------------------+
| official_warnings  |       |   sitewatch_sites    |
+--------------------+       +----------------------+
| id (PK)            |       | id (PK)              |
| title              |       | name                 |
| severity           |       | status (ONLINE/etc)  |
| valid_until        |       | last_heartbeat       |
+--------------------+       +----------------------+
                                        ^
                                        |
                             +----------------------+
                             | sitewatch_heartbeats |
                             +----------------------+
                             | id (PK)              |
                             | site_id (FK)         |
                             | status               |
                             | received_at          |
                             +----------------------+
```
