import pool from '../config/db.js';
import { createNeedSchema, createWarningSchema } from '../validators/schemas.js';

// --- COMMUNITY NEEDS ---
export async function getNeeds(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM community_needs ORDER BY created_at DESC');
    res.json({
      success: true,
      needs: rows
    });
  } catch (err) {
    next(err);
  }
}

export async function createNeed(req, res, next) {
  try {
    const data = createNeedSchema.parse(req.body);
    const clientNeedId = `need-${Date.now().toString().slice(-4)}`;

    const [result] = await pool.query(
      `INSERT INTO community_needs (client_need_id, category, location, quantity, urgency, status, notes, is_demo)
       VALUES (?, ?, ?, ?, ?, 'PENDING', ?, TRUE)`,
      [clientNeedId, data.category, data.location, data.quantity, data.urgency, data.notes || null]
    );

    res.status(201).json({
      success: true,
      message: 'Nesesidade komunidade rejistadu ho susesu.',
      need: {
        id: result.insertId,
        client_need_id: clientNeedId,
        ...data
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateNeedStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      'UPDATE community_needs SET status = ? WHERE id = ? OR client_need_id = ?',
      [status, isNaN(id) ? -1 : Number(id), id]
    );

    res.json({
      success: true,
      message: 'Status nesesidade atualizadu.'
    });
  } catch (err) {
    next(err);
  }
}

// --- OFFICIAL WARNINGS ---
export async function getWarnings(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM official_warnings ORDER BY issued_at DESC');
    res.json({
      success: true,
      warnings: rows
    });
  } catch (err) {
    next(err);
  }
}

export async function createWarning(req, res, next) {
  try {
    const data = createWarningSchema.parse(req.body);
    const now = new Date();

    const [result] = await pool.query(
      `INSERT INTO official_warnings (
        source, title, category, severity, target_area, issued_at, valid_until,
        verification_status, dissemination_status, description, created_by_user_id, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'OFFICIALLY_VERIFIED', 'ACTIVE', ?, ?, TRUE)`,
      [
        data.source,
        data.title,
        data.category,
        data.severity,
        data.target_area,
        now,
        data.valid_until ? new Date(data.valid_until) : null,
        data.description,
        req.user?.id || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Avizu ofisiál publikadu ho susesu.',
      warning: {
        id: result.insertId,
        ...data,
        issued_at: now.toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
}

// --- SITEWATCH SITES & TELEMETRY ---
export async function getSites(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM sitewatch_sites ORDER BY id ASC');
    res.json({
      success: true,
      is_simulation: true,
      sites: rows
    });
  } catch (err) {
    next(err);
  }
}

export async function getSiteHistory(req, res, next) {
  try {
    const { id } = req.params;
    const [siteRows] = await pool.query('SELECT * FROM sitewatch_sites WHERE id = ? LIMIT 1', [id]);
    if (siteRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pontu rede la hetan.' });
    }

    const [hbRows] = await pool.query(
      'SELECT * FROM sitewatch_heartbeats WHERE site_id = ? ORDER BY received_at DESC LIMIT 20',
      [id]
    );

    res.json({
      success: true,
      is_simulation: true,
      site: siteRows[0],
      heartbeats: hbRows
    });
  } catch (err) {
    next(err);
  }
}

export async function recordHeartbeat(req, res, next) {
  try {
    const { id } = req.params;
    const { status = 'ONLINE', latency_ms = 45 } = req.body;
    const now = new Date();

    await pool.query(
      `UPDATE sitewatch_sites 
       SET status = ?, last_heartbeat = ?, operator_notes = 'Heartbeat foun simu husi telemetria.'
       WHERE id = ?`,
      [status, now, id]
    );

    await pool.query(
      'INSERT INTO sitewatch_heartbeats (site_id, status, latency_ms) VALUES (?, ?, ?)',
      [id, status, latency_ms]
    );

    res.json({
      success: true,
      message: 'Heartbeat gravadu ho susesu (Simulasaun).',
      timestamp: now.toISOString()
    });
  } catch (err) {
    next(err);
  }
}
