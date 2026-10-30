/**
 * Prototype Demo Data for HAMUTUK 2.0 Operational Dashboard & Interactive Map
 * Focused strictly on Municipio Viqueque (5 Postu Administrativu: Viqueque Vila, Ossu, Uato-Lari, Uatucarbau, Lacluta)
 * 
 * CRITICAL RULE:
 * Every record in this file is synthetic prototype data and is explicitly tagged:
 * - isDemo: true
 * - sourceLabel: "DEMO DATA"
 * - isSimulation: true (for SiteWatch telemetry)
 */

export const DEMO_INCIDENT_REPORTS = [
  // --- Postu 1: Viqueque Vila ---
  {
    id: 101,
    client_id: 'HMT-2026-0101',
    type: 'FLOOD',
    severity: 'CRITICAL',
    title: 'River Cuha overflow impacting 14 households',
    description: 'Cuha river embankment breached following persistent heavy rains. Water entered residential compounds along the lower basin.',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Caraubalo',
    aldeia: 'Mane-Hat',
    latitude: -8.8645,
    longitude: 126.3618,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // Today: 42 mins ago
    status: 'ACKNOWLEDGED',
    verification_status: 'NEEDS_VERIFICATION',
    reporter_role: 'Community Volunteer',
    reporter_name: 'Mateus Pinto',
    affected_households: 14,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },
  {
    id: 102,
    client_id: 'HMT-2026-0102',
    type: 'FLOOD',
    severity: 'HIGH',
    title: 'Main access culvert submerged on Route A03',
    description: 'Road access between Caraubalo and Uma Uain Craic blocked by 60cm running water. Small vehicles unable to cross.',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Caraubalo',
    aldeia: 'Lamaclar',
    latitude: -8.8680,
    longitude: 126.3650,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 95 * 60 * 1000).toISOString(), // Today: ~1.5h ago
    status: 'ACKNOWLEDGED',
    verification_status: 'VERIFIED',
    reporter_role: 'Suco Chief (Xefe Suco)',
    reporter_name: 'António da Silva',
    affected_households: 0,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },
  {
    id: 103,
    client_id: 'HMT-2026-0103',
    type: 'FLOOD',
    severity: 'HIGH',
    title: 'Well water contamination risk in Uma Uain Craic',
    description: 'Flood runoff inundated 3 community hand pumps. Clean drinking water supplies contaminated.',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Uma Uain Craic',
    aldeia: 'Lugassa',
    latitude: -8.8740,
    longitude: 126.3710,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), // Yesterday (1 day ago)
    status: 'OPEN',
    verification_status: 'NEEDS_VERIFICATION',
    reporter_role: 'Local Health Post Staff',
    reporter_name: 'Maria Soares',
    affected_households: 28,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },

  // --- Postu 2: Ossu ---
  {
    id: 104,
    client_id: 'HMT-2026-0104',
    type: 'LANDSLIDE',
    severity: 'CRITICAL',
    title: 'Road blocked by mountain mudslide in Ossu',
    description: 'Debris from ridge collapsed onto winding section of Ossu road. Power poles leaning dangerously.',
    municipality: 'Viqueque',
    posto: 'Ossu',
    suco: 'Ossu de Cima',
    aldeia: 'Beloi',
    latitude: -8.7360,
    longitude: 126.3715,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
    status: 'IN_PROGRESS',
    verification_status: 'VERIFIED',
    reporter_role: 'Civil Protection Focal Point',
    reporter_name: 'Domingos Gusmão',
    affected_households: 6,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },
  {
    id: 108,
    client_id: 'HMT-2026-0108',
    type: 'LANDSLIDE',
    severity: 'HIGH',
    title: 'Slope slippage near Liaruca coffee farm trail',
    description: 'Hillside earth shift threatening two residential dwellings along the coffee cooperative trail in Liaruca.',
    municipality: 'Viqueque',
    posto: 'Ossu',
    suco: 'Liaruca',
    aldeia: 'Bahatata',
    latitude: -8.7210,
    longitude: 126.3580,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
    status: 'OPEN',
    verification_status: 'NEEDS_VERIFICATION',
    reporter_role: 'Agricultural Officer',
    reporter_name: 'Gaspar Sarmento',
    affected_households: 2,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },

  // --- Postu 3: Uato-Lari ---
  {
    id: 105,
    client_id: 'HMT-2026-0105',
    type: 'FLOOD',
    severity: 'HIGH',
    title: 'River Sahe flood in Suco Macadique',
    description: 'River Sahe swollen by upland runoff. Submerged pedestrian crossing and adjacent farmland plots.',
    municipality: 'Viqueque',
    posto: 'Uato-Lari',
    suco: 'Macadique',
    aldeia: 'Namanei',
    latitude: -8.7750,
    longitude: 126.5650,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
    status: 'ACKNOWLEDGED',
    verification_status: 'VERIFIED',
    reporter_role: 'Xefe Aldeia',
    reporter_name: 'Armando dos Reis',
    affected_households: 18,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },

  // --- Postu 4: Uatucarbau ---
  {
    id: 106,
    client_id: 'HMT-2026-0106',
    type: 'MEDICAL',
    severity: 'CRITICAL',
    title: 'Emergency patient evacuation in Irabin de Cima',
    description: 'Elderly patient with acute respiratory distress isolated by impassable track. Needs immediate stretcher evacuation.',
    municipality: 'Viqueque',
    posto: 'Uatucarbau',
    suco: 'Irabin de Cima',
    aldeia: 'Marae',
    latitude: -8.7180,
    longitude: 126.6780,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), // 4 days ago
    status: 'IN_PROGRESS',
    verification_status: 'VERIFIED',
    reporter_role: 'Community Health Worker',
    reporter_name: 'Rosa de Jesus',
    affected_households: 1,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },
  {
    id: 111,
    client_id: 'HMT-2026-0111',
    type: 'OTHER',
    severity: 'LOW',
    title: 'Timber culvert bridge damaged by fallen tree',
    description: 'Fallen eucalyptus branch cracked wooden bridge beams in Bahatata. Light traffic only.',
    municipality: 'Viqueque',
    posto: 'Uatucarbau',
    suco: 'Bahatata',
    aldeia: 'Uani-Uma',
    latitude: null, // Centroid fallback
    longitude: null,
    hasGps: false,
    isApproximateOnly: true,
    reported_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), // 1 day ago
    status: 'ACKNOWLEDGED',
    verification_status: 'VERIFIED',
    reporter_role: 'Community Volunteer',
    reporter_name: 'Bernardino Alves',
    affected_households: 0,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },

  // --- Postu 5: Lacluta ---
  {
    id: 107,
    client_id: 'HMT-2026-0107',
    type: 'STRONG_WIND',
    severity: 'MEDIUM',
    title: 'Roof damage to school building in Dilor',
    description: 'Strong gusts detached zinc sheets from 2 classrooms at local basic school in Dilor.',
    municipality: 'Viqueque',
    posto: 'Lacluta',
    suco: 'Dilor',
    aldeia: 'Cai-Ualo',
    latitude: -8.8020,
    longitude: 126.1550,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
    status: 'ACKNOWLEDGED',
    verification_status: 'NEEDS_VERIFICATION',
    reporter_role: 'School Director',
    reporter_name: 'Joaquim Freitas',
    affected_households: 0,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },
  {
    id: 109,
    client_id: 'HMT-2026-0109',
    type: 'FIRE',
    severity: 'MEDIUM',
    title: 'Brush fire extinguished near Ahic farm edge',
    description: 'Controlled agricultural burning spread close to grain storage hut. Successfully put out by local volunteer team.',
    municipality: 'Viqueque',
    posto: 'Lacluta',
    suco: 'Ahic',
    aldeia: 'Borubau',
    latitude: -8.7850,
    longitude: 126.1350,
    hasGps: true,
    isApproximateOnly: false,
    reported_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(), // 6 days ago
    status: 'RESOLVED',
    verification_status: 'VERIFIED',
    reporter_role: 'Community Elder',
    reporter_name: 'Lucas Barreto',
    affected_households: 0,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  },

  // --- Approximate Centroid Demo in Viqueque Vila ---
  {
    id: 110,
    client_id: 'HMT-2026-0110',
    type: 'MEDICAL',
    severity: 'HIGH',
    title: 'Maternal health transfer awaiting vehicle in Bibileo',
    description: 'Expectant mother in active labor. Village ambulance fuel supply low. Hand-held phone has no GPS fix.',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Bibileo',
    aldeia: 'Hare Oan',
    latitude: null, // GPS unavailable -> Resolves to Bibileo centroid
    longitude: null,
    hasGps: false,
    isApproximateOnly: true,
    reported_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(), // 6 days ago
    status: 'OPEN',
    verification_status: 'NEEDS_VERIFICATION',
    reporter_role: 'Maternity Midwife',
    reporter_name: 'Filomena Amaral',
    affected_households: 1,
    origin: 'SERVER_ACKNOWLEDGED',
    isDemo: true,
    sourceLabel: 'DEMO DATA'
  }
];

export const DEMO_SITEWATCH_NODES = [
  {
    id: 'SITE-01',
    name: 'MikroTik Core Gateway (Viqueque Vila)',
    node_type: 'COMMUNITY_GATEWAY',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Caraubalo',
    latitude: -8.8575,
    longitude: 126.3647,
    status: 'ONLINE',
    last_seen_at: new Date(Date.now() - 45 * 1000).toISOString(),
    latency_ms: 18,
    uptime_str: '45d 14h',
    power_source: 'Grid (Stable 230V)',
    battery_charge: '100%',
    firmware_version: 'RouterOS 7.15',
    isSimulation: true,
    simulationBadge: 'SIMULATION',
    history: [
      { timestamp: '10:15', status: 'ONLINE', latency: 18 },
      { timestamp: '10:00', status: 'ONLINE', latency: 19 },
      { timestamp: '09:45', status: 'ONLINE', latency: 22 },
      { timestamp: '09:30', status: 'ONLINE', latency: 17 }
    ]
  },
  {
    id: 'SITE-02',
    name: 'HAMUTUK Local Edge Server (Caraubalo)',
    node_type: 'LOCAL_SERVER',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Caraubalo',
    latitude: -8.8620,
    longitude: 126.3610,
    status: 'ONLINE',
    last_seen_at: new Date(Date.now() - 80 * 1000).toISOString(),
    latency_ms: 2,
    uptime_str: '28d 06h',
    power_source: 'Smart UPS + Solar',
    battery_charge: '96%',
    firmware_version: 'Debian 12 / Node v20 LTS',
    isSimulation: true,
    simulationBadge: 'SIMULATION',
    history: [
      { timestamp: '10:15', status: 'ONLINE', latency: 2 },
      { timestamp: '10:00', status: 'ONLINE', latency: 2 },
      { timestamp: '09:45', status: 'ONLINE', latency: 3 },
      { timestamp: '09:30', status: 'ONLINE', latency: 2 }
    ]
  },
  {
    id: 'SITE-03',
    name: 'Bibileo Health Post Wireless Node',
    node_type: 'HEALTH_POST',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Bibileo',
    latitude: -8.9110,
    longitude: 126.3320,
    status: 'STALE',
    last_seen_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    latency_ms: 140,
    uptime_str: '12d 02h',
    power_source: 'Solar Off-Grid',
    battery_charge: '48%',
    firmware_version: 'OpenWrt 23.05',
    isSimulation: true,
    simulationBadge: 'SIMULATION',
    history: [
      { timestamp: '10:00', status: 'STALE', latency: 140 },
      { timestamp: '09:45', status: 'ONLINE', latency: 85 },
      { timestamp: '09:30', status: 'ONLINE', latency: 62 },
      { timestamp: '09:15', status: 'ONLINE', latency: 58 }
    ]
  },
  {
    id: 'SITE-04',
    name: 'Uato-Lari Community School PtP Link',
    node_type: 'SCHOOL',
    municipality: 'Viqueque',
    posto: 'Uato-Lari',
    suco: 'Babulo',
    latitude: -8.7690,
    longitude: 126.5580,
    status: 'UNREACHABLE',
    last_seen_at: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
    latency_ms: null,
    uptime_str: '0h 0m',
    power_source: 'Solar (Telemetry Lost)',
    battery_charge: 'Unknown',
    firmware_version: 'airOS 8.7',
    isSimulation: true,
    simulationBadge: 'SIMULATION',
    history: [
      { timestamp: '09:30', status: 'UNREACHABLE', latency: null },
      { timestamp: '09:15', status: 'STALE', latency: 280 },
      { timestamp: '09:00', status: 'ONLINE', latency: 45 },
      { timestamp: '08:45', status: 'ONLINE', latency: 41 }
    ]
  },
  {
    id: 'SITE-05',
    name: 'Ossu Mountain Wireless Repeater',
    node_type: 'COMMUNITY_GATEWAY',
    municipality: 'Viqueque',
    posto: 'Ossu',
    suco: 'Ossu de Cima',
    latitude: -8.7380,
    longitude: 126.3760,
    status: 'ONLINE',
    last_seen_at: new Date(Date.now() - 110 * 1000).toISOString(),
    latency_ms: 32,
    uptime_str: '89d 19h',
    power_source: 'Solar + LiFePO4 Array',
    battery_charge: '91%',
    firmware_version: 'RouterOS 7.14',
    isSimulation: true,
    simulationBadge: 'SIMULATION',
    history: [
      { timestamp: '10:15', status: 'ONLINE', latency: 32 },
      { timestamp: '10:00', status: 'ONLINE', latency: 30 },
      { timestamp: '09:45', status: 'ONLINE', latency: 34 }
    ]
  },
  {
    id: 'SITE-06',
    name: 'Lacluta Administrative PtP Link',
    node_type: 'LOCAL_SERVER',
    municipality: 'Viqueque',
    posto: 'Lacluta',
    suco: 'Dilor',
    latitude: -8.8020,
    longitude: 126.1550,
    status: 'ONLINE',
    last_seen_at: new Date(Date.now() - 25 * 1000).toISOString(),
    latency_ms: 12,
    uptime_str: '64d 08h',
    power_source: 'Solar + Battery Bank',
    battery_charge: '98%',
    firmware_version: 'Debian 12',
    isSimulation: true,
    simulationBadge: 'SIMULATION',
    history: [
      { timestamp: '10:15', status: 'ONLINE', latency: 12 },
      { timestamp: '10:00', status: 'ONLINE', latency: 12 },
      { timestamp: '09:45', status: 'ONLINE', latency: 14 }
    ]
  },
  {
    id: 'SITE-07',
    name: 'Uatucarbau Coastal Telemetry Node',
    node_type: 'COMMUNITY_GATEWAY',
    municipality: 'Viqueque',
    posto: 'Uatucarbau',
    suco: 'Irabin de Cima',
    latitude: -8.7180,
    longitude: 126.6780,
    status: 'STALE',
    last_seen_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    latency_ms: 195,
    uptime_str: '6d 11h',
    power_source: 'Solar Array',
    battery_charge: '54%',
    firmware_version: 'RouterOS 7.15',
    isSimulation: true,
    simulationBadge: 'SIMULATION',
    history: [
      { timestamp: '10:00', status: 'STALE', latency: 195 },
      { timestamp: '09:45', status: 'ONLINE', latency: 195 },
      { timestamp: '09:30', status: 'ONLINE', latency: 88 }
    ]
  }
];

export const DEMO_COMMUNITY_NEEDS = [
  {
    id: 'NEED-01',
    emergency_report_id: 'HMT-2026-0103',
    type: 'WATER',
    priority: 'CRITICAL',
    quantity: '500 Liters drinking water + purification tablets',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Uma Uain Craic',
    status: 'REQUESTED',
    created_at: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    contact: 'Maria Soares (Health Post)',
    isDemo: true
  },
  {
    id: 'NEED-02',
    emergency_report_id: 'HMT-2026-0101',
    type: 'SHELTER',
    priority: 'HIGH',
    quantity: '20 Emergency family tarpaulins & rope kits',
    municipality: 'Viqueque',
    posto: 'Viqueque Vila',
    suco: 'Caraubalo',
    status: 'IN_TRANSIT',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    contact: 'Mateus Pinto (Community Volunteer)',
    isDemo: true
  },
  {
    id: 'NEED-03',
    emergency_report_id: 'HMT-2026-0104',
    type: 'LOGISTICS',
    priority: 'CRITICAL',
    quantity: 'Excavator heavy machinery for debris clearance',
    municipality: 'Viqueque',
    posto: 'Ossu',
    suco: 'Ossu de Cima',
    status: 'ASSIGNED',
    created_at: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
    contact: 'Domingos Gusmão (Civil Protection)',
    isDemo: true
  },
  {
    id: 'NEED-04',
    emergency_report_id: 'HMT-2026-0106',
    type: 'MEDICAL',
    priority: 'CRITICAL',
    quantity: 'Medical evacuation vehicle & 2 emergency oxygen cylinders',
    municipality: 'Viqueque',
    posto: 'Uatucarbau',
    suco: 'Irabin de Cima',
    status: 'REQUESTED',
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    contact: 'Rosa de Jesus (CHW)',
    isDemo: true
  }
];

export const DEMO_COMMUNITY_POSTS = [
  {
    id: 'POST-01',
    author: 'Mateus Pinto (Caraubalo)',
    role: 'Volunteer Responder',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    content: 'Ami instala ona ponto distribuisaun be moos provizóriu iha sede aldeia Mane-Hat. Komunidade bele mai foti ho jerigen.',
    likes: 8,
    comments: 3,
    isLocal: true,
    isDemo: true
  },
  {
    id: 'POST-02',
    author: 'Civil Protection Viqueque Command',
    role: 'Municipal Authority',
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    content: 'Avizu Tránzitu: Estrada Ossu - Viqueque Vila sei taka provizoriamente tanba rai halai. Ekipa operasaun hala’o hela limpeza.',
    likes: 24,
    comments: 7,
    isLocal: false,
    isDemo: true
  }
];
