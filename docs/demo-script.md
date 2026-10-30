# HAMUTUK 2.0 — Live Demonstration Script (Konekta Challenge)

> **Context**: Vorakai Konekta Challenge — Grand Challenge C: Disaster Resilience & Early Warning  
> **Pilot Focus**: Viqueque Municipality, Timor-Leste  
> **Key Value**: Offline-first disaster incident recording, idempotent synchronization, and network resilience monitoring (SiteWatch).

---

### Step 1: Introduction & Brand Context (30 seconds)
- Open application at `http://localhost:5173`.
- Highlight Tetum-first interface: *"Hamutuk, Preparadu. Ligadu Bainhira Bele."*
- Point out the language toggle in the top bar: switches between **Tetum (TET)** and **English (EN)** for international competition evaluation.
- Note the label: **DEMO DATA** and **SIMULASAUN** to ensure complete transparency.

---

### Step 2: Sign In as Suco Officer (30 seconds)
1. On the login screen, point to the security disclaimer: *"For authorised response personnel only. No public self-registration."*
2. Click the quick demo account: **1. Mateus da Costa (Ofisiál Suku — Postu Uato-Lari)**.
3. Click **Tama Agora (Sign In)**.
4. Arrive at the **Vizaun Jerál (Overview Dashboard)**.

---

### Step 3: Online Incident Reporting (1 minute)
1. Notice the green **ONLINE** status badge in the top bar.
2. Click **Kria Relatóriu Foun (Create Report)**.
3. Select:
   - Category: **Be'e Sa'e / Inundasaun (Flooding)**
   - Priority: **Urxente Liu (Critical)**
   - Post: **Uato-Lari**, Suco: **Macadique**, Aldeia: **Namanei**
   - Click **Foti Pozisaun (Get Location)** to populate GPS coordinates.
   - Enter description: *"Mota Sahe sa'e tanba udan boot, invade uma kain 12."*
   - Check immediate needs: *Be'e Moos (Water)* and *Lona (Shelter)*.
4. Click **Rai Relatóriu Dezastre (Save Report)**.
5. Point out the instant server acknowledgement:
   - Green confirmation banner: *"Simu no rekonhese ona husi servidor sentrál!"*
   - Generated unique stable ID: `rep-...`.

---

### Step 4: Simulating Internet Disruption (Offline Flow) (2 minutes)
1. Click the **ONLINE** pill in the top header (or disconnect Wi-Fi / use Chrome DevTools Offline mode).
2. The persistent amber offline banner immediately appears:
   - *"MODU OFFLINE ACTIVU — Relatóriu sei rai seguru iha aparellu ne'e."*
3. Click **Kria Relatóriu Foun (Create Report)** while offline.
4. Select:
   - Category: **Rai Monu / Rai Halai (Landslide)**
   - Priority: **Aas (High)**
   - Post: **Ossu**, Suco: **Liaruca**
   - Description: *"Estrada nasionál km 32 taka husi rai halai, kareta ambulánsia labele liu."*
5. Click **Rai Relatóriu Dezastre (Save Report)**.
6. **Key Competition Criteria**:
   - Point out that the system **NEVER** says "Sent successfully".
   - Instead, it explicitly says: *"Rai ona iha aparellu ne'e — Seidauk to'o servidor sentrál."* (Saved on device — not yet received by server).

---

### Step 5: Reload Verification & Persistence across Browser Sessions (1 minute)
1. While still offline, press **F5 (Reload)** or close the browser tab and reopen `http://localhost:5173`.
2. Notice the offline state is retained.
3. Navigate to **Fila Sincronizasaun (Sync Queue)**.
4. The landslide report is present with status: **"Rai ona iha aparellu ne'e" (Saved on this device)** with attempt count 0.
5. In the Overview Dashboard, emphasize that local-only reports are **strictly separated** from server-acknowledged reports.

---

### Step 6: Connectivity Restored & Idempotent Sync (1.5 minutes)
1. Click the amber banner toggle: **Koneka Fali (Reconnect)**.
2. The system detects connection restoration and offers the **Sincroniza Agora (Synchronise Now)** button.
3. Click **Sincroniza Agora**.
4. The pending report transitions to **"Simu ona husi servidor sentrál" (Received by central server)**.
5. Click the retry button again to demonstrate **Idempotency**:
   - The server recognizes the stable client UUID, returns the original acknowledgement timestamp, and does **not** create a duplicate record in MySQL!

---

### Step 7: SiteWatch Network Telemetry Simulation (2 minutes)
1. Navigate to **SiteWatch**.
2. Point out the mandatory ethical banner:
   - *"Heartbeat ne'ebé la to'o la hatudu prova loloos katak router aat ka ahi-mate. Labele bolu simulasaun ne'e hanesan telemetria router Mikrotik reál."*
3. Show **DEMO Suco A** (ONLINE) and **DEMO Suco B** (STALE).
4. Change the **Stale Threshold** from 15 min to 5 min to show live re-evaluation of heartbeat health.
5. Click **Para (Stop)** on DEMO Suco A:
   - Site transitions to **UNREACHABLE** and an open ticket is generated.
6. Click **Komesa (Resume)**:
   - Sends a fresh heartbeat, site returns to **ONLINE**, and latency is recorded.

---

### Step 8: Community Needs & Official Warnings (1 minute)
1. Show **Nesesidade Komunidade (Community Needs)**:
   - Shows urgent water and shelter coordination.
   - Emphasize disclaimer: Coordinates information, does not claim automatic supply dispatch.
2. Show **Avizu Ofisiál (Official Warnings)**:
   - Meteorological alerts from DNMG and Civil Protection.
   - Show how expired warnings display a prominent outdated warning banner.
