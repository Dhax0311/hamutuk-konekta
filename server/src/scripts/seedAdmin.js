import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from '../config/db.js';
import { runMigration } from './migrate.js';

dotenv.config();

async function seedAdmin() {
  console.log('--- HAMUTUK 2.0 Database Seeder ---');

  const adminName = process.env.ADMIN_NAME || 'HAMUTUK Administrator';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hamutuk.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456!';

  try {
    // 0. Automatically ensure database schema and tables exist first
    await runMigration();

    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash(adminPassword, salt);
    const demoPasswordHash = await bcrypt.hash('password123', salt);

    const usersToSeed = [
      {
        name: adminName,
        email: adminEmail,
        password_hash: adminHash,
        role: 'ADMIN',
        area: 'Munisípiu Viqueque (Sentrál)',
        phone: '+670 7723 4567'
      },
      {
        name: 'Mateus da Costa',
        email: 'mateus.suco@hamutuk.local',
        password_hash: demoPasswordHash,
        role: 'SUCO_OFFICER',
        area: 'Postu Uato-Lari, Suku Macadique',
        phone: '+670 7789 1234'
      },
      {
        name: 'Helena Pinto Soares',
        email: 'helena.coord@hamutuk.local',
        password_hash: demoPasswordHash,
        role: 'MUNICIPAL_COORDINATOR',
        area: 'Munisípiu Viqueque',
        phone: '+670 7812 9988'
      }
    ];

    for (const u of usersToSeed) {
      const [existing] = await pool.query('SELECT id, email FROM users WHERE email = ? LIMIT 1', [u.email]);
      if (existing.length === 0) {
        const [res] = await pool.query(
          `INSERT INTO users (name, email, password_hash, role, administrative_area, phone, is_active)
           VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
          [u.name, u.email, u.password_hash, u.role, u.area, u.phone]
        );
        console.log(`✓ Created user: ${u.name} (${u.email}) [${u.role}] (ID: ${res.insertId})`);
      } else {
        console.log(`Notice: User ${u.email} already exists (ID: ${existing[0].id}).`);
      }
    }

    // Seed demo SiteWatch simulation sites if empty
    const [siteCountRows] = await pool.query('SELECT COUNT(*) AS total FROM sitewatch_sites');
    if (siteCountRows[0].total === 0) {
      console.log('Seeding initial simulation SiteWatch sites...');
      const sites = [
        ['site-demo-suco-a', 'DEMO Suco A (Uato-Lari)', 'Uato-Lari', 'Sede Suku Afaloicai - Postu Remotu', 'ONLINE', '192.168.100.10', 'Solar + VHF / Wi-Fi Mesh', '99.8%', 'DEMO Suco A: Heartbeat ativu, bateria solar 100%. Simulasaun pronta.'],
        ['site-demo-suco-b', 'DEMO Suco B (Ossu)', 'Ossu', 'Sede Suku Liaruca - Área Foho', 'STALE', '192.168.100.20', 'Point-to-Point Long Range Radio', '92.5%', 'DEMO Suco B: Heartbeat tarde liu minutu 20. Antena provizóriu.'],
        ['site-vq-01', 'Postu Sentrál Viqueque Hub', 'Viqueque Villa', 'Edifísiu Administrasaun Munisípiu', 'ONLINE', '192.168.10.1', 'Solar + Fiber / VHF Fallback', '99.4%', 'Ligasaun fibra estável, bateria solar 98%.'],
        ['site-vq-02', 'Sentru Komunitáriu Uato-Lari', 'Uato-Lari', 'Sede Suku Babulo', 'STALE', '192.168.12.1', 'Long-range Wi-Fi Bridge', '94.2%', 'Heartbeat tarde minutu 38. Posibilidade udan ka antena.'],
        ['site-vq-03', 'Postu Saúde Lacluta Point', 'Lacluta', 'Sentru Saúde Dilor', 'UNREACHABLE', '192.168.14.1', 'VSAT Satellite Link', '81.5%', 'Missing heartbeat. Causa seidauk konfirmadu.'],
        ['site-vq-04', 'Eskola Ensinu Báziku Ossu', 'Ossu', 'Sentru Juventude Ossu de Cima', 'ONLINE', '192.168.16.1', 'Point-to-Point Radio', '98.8%', 'Funkisiona normál. Laténsia 42ms.'],
        ['site-vq-05', 'Sentru Resiliénsia Uato-Carbau', 'Uato-Carbau', 'Sede Postu Uato-Carbau', 'UNKNOWN', '192.168.18.1', 'Cellular 3G/4G + VHF', '67.0%', 'Ekipamentu foun seidauk finaliza telemetria.']
      ];

      for (const s of sites) {
        await pool.query(
          `INSERT INTO sitewatch_sites (id, name, post, location, status, ip_address, connection_type, last_heartbeat, uptime_percentage, operator_notes, is_simulation)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, TRUE)`,
          s
        );
      }
      console.log('✓ Seeded simulation SiteWatch sites.');
    }

    console.log('✓ Database seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeder execution error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
