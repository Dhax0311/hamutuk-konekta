// HAMUTUK 2.0 - Realistic DEMO DATA (Viqueque Pilot)
// All data in this file is strictly for demonstration of the prototype.

export const DEMO_ADMINISTRATIVE_AREAS = {
  municipality: 'Viqueque',
  posts: [
    {
      id: 'viqueque-villa',
      name: 'Viqueque Villa',
      sucos: ['Caraubalo', 'Uma Uain Craic', 'Uma Quic', 'Bahalarauain', 'Bibileo', 'Luca', 'Uma Uain Leten']
    },
    {
      id: 'uato-lari',
      name: 'Uato-Lari',
      sucos: ['Afaloicai', 'Babulo', 'Macadique', 'Matai', 'Vessoru', 'Uaitame']
    },
    {
      id: 'ossu',
      name: 'Ossu',
      sucos: ['Ossu de Cima', 'Ossu de Baixo', 'Liaruca', 'Uabubo', 'Loihuno', 'Nahareca', 'Wai-Bua']
    },
    {
      id: 'lacluta',
      name: 'Lacluta',
      sucos: ['Ahic', 'Dilor', 'Laline', 'Uma Tolu']
    },
    {
      id: 'uato-carbau',
      name: 'Uato-Carbau',
      sucos: ['Afaloicai', 'Bahatata', 'Irabin de Baixo', 'Irabin de Cima', 'Uani Uma', 'Bualale']
    }
  ]
};

export const INITIAL_DEMO_REPORTS = [
  {
    client_report_id: 'rep-demo-001',
    category: 'flooding',
    municipality: 'Viqueque',
    administrative_post: 'Uato-Lari',
    suco: 'Macadique',
    aldeia: 'Namanei',
    location_description: 'Besik mota Sahe, ponte provizóriu hetan estragus',
    coordinates: '-8.8951, 126.5412',
    incident_time: '2026-10-21T05:30:00Z',
    created_at: '2026-10-21T06:15:00Z',
    description: 'Be mota sae invade uma kain 18 iha aldeia Namanei. Estrada ligasaun ba sentru postu ladiak.',
    priority: 'HIGH',
    immediate_needs: ['water', 'shelter', 'food'],
    reporter_role: 'SUCO_OFFICER',
    reporter_name: 'Mateus da Costa',
    verification_status: 'VERIFIED',
    sync_status: 'SERVER_ACKNOWLEDGED',
    server_ack_at: '2026-10-21T06:45:00Z',
    follow_up_status: 'IN_PROGRESS',
    follow_up_notes: 'Ekipa protesaun sivíl munisípiu distribui ona lona provizóriu 15.',
    is_demo: true
  },
  {
    client_report_id: 'rep-demo-002',
    category: 'landslide',
    municipality: 'Viqueque',
    administrative_post: 'Ossu',
    suco: 'Liaruca',
    aldeia: 'Builale',
    location_description: 'Estrada nasionál km 34 entre Ossu no Viqueque',
    coordinates: '-8.7241, 126.3789',
    incident_time: '2026-10-20T22:00:00Z',
    created_at: '2026-10-21T01:10:00Z',
    description: 'Rai monu taka dalan tomak, kareta labele liu. Presiza pezadu hodi hamoos foer no fatuk.',
    priority: 'CRITICAL',
    immediate_needs: ['transport'],
    reporter_role: 'MUNICIPAL_COORDINATOR',
    reporter_name: 'Helena Pinto Soares',
    verification_status: 'VERIFIED',
    sync_status: 'SERVER_ACKNOWLEDGED',
    server_ack_at: '2026-10-21T01:30:00Z',
    follow_up_status: 'RESOLVED',
    follow_up_notes: 'Tratór munisípiu loke ona dalan provizóriu ba veíkulu kmaan.',
    is_demo: true
  },
  {
    client_report_id: 'rep-demo-003',
    category: 'strong_wind',
    municipality: 'Viqueque',
    administrative_post: 'Lacluta',
    suco: 'Dilor',
    aldeia: 'Cai-Ualo',
    location_description: 'Eskola filiál besik sede aldeia',
    coordinates: '-8.7901, 126.1345',
    incident_time: '2026-10-21T08:00:00Z',
    created_at: '2026-10-21T08:45:00Z',
    description: 'Anin boot sobu sala aula 2 nia kalen. Labarik sira labele tuir aula.',
    priority: 'MEDIUM',
    immediate_needs: ['shelter'],
    reporter_role: 'SUCO_OFFICER',
    reporter_name: 'António dos Santos',
    verification_status: 'UNVERIFIED',
    sync_status: 'SERVER_ACKNOWLEDGED',
    server_ack_at: '2026-10-21T09:12:00Z',
    follow_up_status: 'PENDING',
    follow_up_notes: 'Hein verifikasaun husi diretór edukasaun munisípiu.',
    is_demo: true
  },
  {
    client_report_id: 'rep-demo-004-offline',
    category: 'medical_emergency',
    municipality: 'Viqueque',
    administrative_post: 'Uato-Carbau',
    suco: 'Irabin de Cima',
    aldeia: 'Marae',
    location_description: 'Postu saúde aldeia izoladu',
    coordinates: '-8.7612, 126.6890',
    incident_time: '2026-10-21T09:30:00Z',
    created_at: '2026-10-21T10:00:00Z',
    description: 'Inan isin-rua presiza ambulánsia urjente maibé ponte mota kiik kotu.',
    priority: 'CRITICAL',
    immediate_needs: ['medicine', 'transport'],
    reporter_role: 'SUCO_OFFICER',
    reporter_name: 'Zulmira Ximenes',
    verification_status: 'PENDING_OFFLINE',
    sync_status: 'PENDING_SYNC',
    server_ack_at: null,
    follow_up_status: 'PENDING',
    follow_up_notes: 'Gravadu lokalmente iha telemóvel suco - seidauk to\'o servidor sentrál.',
    is_demo: true
  }
];

export const INITIAL_DEMO_NEEDS = [
  {
    id: 'need-001',
    category: 'water',
    location: 'Uato-Lari, Macadique (Namanei)',
    quantity: '2,000 Litros be\'e moos',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    notes: 'Presiza tanki mobíl be\'e moos ba komunidade afectadu inundasaun.',
    is_demo: true
  },
  {
    id: 'need-002',
    category: 'shelter',
    location: 'Lacluta, Dilor (Cai-Ualo)',
    quantity: '10 Lona tarpaulins',
    urgency: 'MEDIUM',
    status: 'PENDING',
    notes: 'Hodi taka sala aula eskola ne\'ebé anin sobu kalen.',
    is_demo: true
  },
  {
    id: 'need-003',
    category: 'transport',
    location: 'Uato-Carbau, Irabin de Cima',
    quantity: 'Ambulánsia 4WD ka evakuasaun',
    urgency: 'CRITICAL',
    status: 'PENDING',
    notes: 'Ba emerjénsia maternidade iha área izoladu.',
    is_demo: true
  },
  {
    id: 'need-004',
    category: 'food',
    location: 'Viqueque Villa, Caraubalo',
    quantity: 'Saku foos 50 no nesesidade báziku',
    urgency: 'LOW',
    status: 'RESOLVED',
    notes: 'Distribui ona husi Sentru Apoiu Solidaridade.',
    is_demo: true
  }
];

export const INITIAL_DEMO_SITES = [
  {
    id: 'site-demo-suco-a',
    name: 'DEMO Suco A (Uato-Lari)',
    post: 'Uato-Lari',
    location: 'Sede Suku Afaloicai - Postu Remotu',
    status: 'ONLINE',
    ip_address: '192.168.100.10',
    connection_type: 'Solar + VHF / Wi-Fi Mesh',
    last_heartbeat: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    uptime_percentage: '99.8%',
    operator_notes: 'DEMO Suco A: Heartbeat ativu, bateria solar 100%. Simulasaun pronta.',
    open_tickets: 0,
    is_simulation: true,
    is_demo: true,
    simulation_active: true
  },
  {
    id: 'site-demo-suco-b',
    name: 'DEMO Suco B (Ossu)',
    post: 'Ossu',
    location: 'Sede Suku Liaruca - Área Foho',
    status: 'STALE',
    ip_address: '192.168.100.20',
    connection_type: 'Point-to-Point Long Range Radio',
    last_heartbeat: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    uptime_percentage: '92.5%',
    operator_notes: 'DEMO Suco B: Heartbeat tarde liu minutu 20. Antena provizóriu.',
    open_tickets: 1,
    is_simulation: true,
    is_demo: true,
    simulation_active: false
  },
  {
    id: 'site-vq-01',
    name: 'Postu Sentrál Viqueque Hub',
    post: 'Viqueque Villa',
    location: 'Edifísiu Administrasaun Munisípiu',
    status: 'ONLINE',
    ip_address: '192.168.10.1',
    connection_type: 'Solar + Fiber / VHF Fallback',
    last_heartbeat: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    uptime_percentage: '99.4%',
    operator_notes: 'Ligasaun fibra estável, bateria solar 98%.',
    open_tickets: 0,
    is_simulation: true
  },
  {
    id: 'site-vq-02',
    name: 'Sentru Komunitáriu Uato-Lari',
    post: 'Uato-Lari',
    location: 'Sede Suku Babulo',
    status: 'STALE',
    ip_address: '192.168.12.1',
    connection_type: 'Long-range Wi-Fi Bridge',
    last_heartbeat: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
    uptime_percentage: '94.2%',
    operator_notes: 'Heartbeat tarde minutu 38. Posibilidade intervensaun udan ka antena nakdoko.',
    open_tickets: 1,
    is_simulation: true
  },
  {
    id: 'site-vq-03',
    name: 'Postu Saúde Lacluta Point',
    post: 'Lacluta',
    location: 'Sentru Saúde Dilor',
    status: 'UNREACHABLE',
    ip_address: '192.168.14.1',
    connection_type: 'VSAT Satellite Link',
    last_heartbeat: new Date(Date.now() - 190 * 60 * 1000).toISOString(),
    uptime_percentage: '81.5%',
    operator_notes: 'La simu heartbeat durante oras 3. Razaun seidauk konfirmadu (solar/bateria ka ekipamentu).',
    open_tickets: 1,
    is_simulation: true
  },
  {
    id: 'site-vq-04',
    name: 'Eskola Ensinu Báziku Ossu',
    post: 'Ossu',
    location: 'Sentru Juventude Ossu de Cima',
    status: 'ONLINE',
    ip_address: '192.168.16.1',
    connection_type: 'Point-to-Point Radio',
    last_heartbeat: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    uptime_percentage: '98.8%',
    operator_notes: 'Funkisiona normál. Laténsia 42ms.',
    open_tickets: 0,
    is_simulation: true
  },
  {
    id: 'site-vq-05',
    name: 'Sentru Resiliénsia Uato-Carbau',
    post: 'Uato-Carbau',
    location: 'Sede Postu Uato-Carbau',
    status: 'UNKNOWN',
    ip_address: '192.168.18.1',
    connection_type: 'Cellular 3G/4G + VHF',
    last_heartbeat: new Date(Date.now() - 720 * 60 * 1000).toISOString(),
    uptime_percentage: '67.0%',
    operator_notes: 'Ekipamentu foun seidauk finaliza konfigurasaun telemetria sentrál.',
    open_tickets: 0,
    is_simulation: true
  }
];

export const INITIAL_DEMO_WARNINGS = [
  {
    id: 'warn-001',
    source: 'Diretoria Nasionál Meteorolojia no Jeofízika (DNMG)',
    title: 'Avizu Udan Boot no Risku Mota Sae iha Kosta Súl',
    category: 'METEOROLOGICAL',
    severity: 'WARNING',
    issued_at: '2026-10-21T04:00:00Z',
    valid_until: '2026-10-22T18:00:00Z',
    target_area: 'Munisípiu Viqueque (Uato-Lari, Lacluta, Viqueque Villa)',
    verification_status: 'OFFICIALLY_VERIFIED',
    dissemination_status: 'DISSEMINATED',
    description: 'Prezensa presaun kiik provoka udan boot ho intensidade 80-120mm/dia. Populasaun besik mota presiza kuidadu.',
    is_demo: true
  },
  {
    id: 'warn-002',
    source: 'Autoridade Protesaun Sivíl Munisípiu Viqueque',
    title: 'Kautela Estrada Nasionál Ossu - Dalan Nakdoko',
    category: 'INFRASTRUCTURE',
    severity: 'CAUTION',
    issued_at: '2026-10-20T23:30:00Z',
    valid_until: '2026-10-22T12:00:00Z',
    target_area: 'Postu Administrativu Ossu',
    verification_status: 'OFFICIALLY_VERIFIED',
    dissemination_status: 'ACTIVE',
    description: 'Risku rai monu adisionál tanba rai mamuk no udan tuir-tuir malu. Veíkulu todan labele liu.',
    is_demo: true
  }
];
