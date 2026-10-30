import pool from '../config/db.js';
import { createReportSchema, syncReportsSchema } from '../validators/schemas.js';

export async function getReports(req, res, next) {
  try {
    const { category, post, priority, verification_status, limit = 50 } = req.query;

    let query = 'SELECT * FROM disaster_reports WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (post) {
      query += ' AND administrative_post = ?';
      params.push(post);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (verification_status) {
      query += ' AND verification_status = ?';
      params.push(verification_status);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      count: rows.length,
      reports: rows
    });
  } catch (err) {
    next(err);
  }
}

export async function getReportById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM disaster_reports WHERE client_report_id = ? OR id = ? LIMIT 1',
      [id, isNaN(id) ? -1 : Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Relatóriu la hetan iha servidor.'
      });
    }

    res.json({
      success: true,
      report: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

export async function createReport(req, res, next) {
  try {
    const data = createReportSchema.parse(req.body);
    const now = new Date();

    // Check if client_report_id already exists (idempotent guarantee)
    const [existing] = await pool.query(
      'SELECT id, client_report_id, server_ack_at FROM disaster_reports WHERE client_report_id = ? LIMIT 1',
      [data.client_report_id]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        is_duplicate: true,
        message: 'Relatóriu ne\'e simu no rekonhese ona uluk (Idempotent acknowledge).',
        client_report_id: data.client_report_id,
        server_ack_at: existing[0].server_ack_at
      });
    }

    const [result] = await pool.query(
      `INSERT INTO disaster_reports (
        client_report_id, category, municipality, administrative_post, suco, aldeia,
        location_description, coordinates, incident_time, description, immediate_needs,
        priority, reporter_user_id, reporter_role, reporter_name, verification_status,
        follow_up_status, server_ack_at, is_demo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UNVERIFIED', 'PENDING', ?, TRUE)`,
      [
        data.client_report_id,
        data.category,
        data.municipality || 'Viqueque',
        data.administrative_post,
        data.suco,
        data.aldeia || null,
        data.location_description || null,
        data.coordinates || null,
        data.incident_time ? new Date(data.incident_time) : now,
        data.description,
        data.immediate_needs ? JSON.stringify(data.immediate_needs) : null,
        data.priority,
        req.user?.id || null,
        data.reporter_role || 'SUCO_OFFICER',
        data.reporter_name,
        now
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Relatóriu simu no rekonhese ho susesu husi servidor sentrál.',
      id: result.insertId,
      client_report_id: data.client_report_id,
      server_ack_at: now.toISOString()
    });
  } catch (err) {
    next(err);
  }
}

export async function syncReports(req, res, next) {
  try {
    const { reports } = syncReportsSchema.parse(req.body);
    const now = new Date();
    const acknowledged = [];
    const duplicates = [];
    const failures = [];

    for (const rep of reports) {
      try {
        const [existing] = await pool.query(
          'SELECT id, client_report_id, server_ack_at FROM disaster_reports WHERE client_report_id = ? LIMIT 1',
          [rep.client_report_id]
        );

        if (existing.length > 0) {
          duplicates.push(rep.client_report_id);
          acknowledged.push({
            client_report_id: rep.client_report_id,
            status: 'ALREADY_EXISTS',
            server_ack_at: existing[0].server_ack_at || now.toISOString()
          });
        } else {
          await pool.query(
            `INSERT INTO disaster_reports (
              client_report_id, category, municipality, administrative_post, suco, aldeia,
              location_description, coordinates, incident_time, description, immediate_needs,
              priority, reporter_user_id, reporter_role, reporter_name, verification_status,
              follow_up_status, server_ack_at, is_demo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UNVERIFIED', 'PENDING', ?, TRUE)`,
            [
              rep.client_report_id,
              rep.category,
              rep.municipality || 'Viqueque',
              rep.administrative_post,
              rep.suco,
              rep.aldeia || null,
              rep.location_description || null,
              rep.coordinates || null,
              rep.incident_time ? new Date(rep.incident_time) : now,
              rep.description,
              rep.immediate_needs ? JSON.stringify(rep.immediate_needs) : null,
              rep.priority,
              req.user?.id || null,
              rep.reporter_role || 'SUCO_OFFICER',
              rep.reporter_name,
              now
            ]
          );

          acknowledged.push({
            client_report_id: rep.client_report_id,
            status: 'STORED',
            server_ack_at: now.toISOString()
          });
        }
      } catch (itemErr) {
        console.error(`Error syncing report ${rep.client_report_id}:`, itemErr.message);
        failures.push({
          client_report_id: rep.client_report_id,
          error: itemErr.message
        });
      }
    }

    res.json({
      success: true,
      message: `Sincronizasaun finalizada. Total ${reports.length} relatóriu prosesa.`,
      synced_count: acknowledged.length,
      failed_count: failures.length,
      newly_saved: acknowledged.length - duplicates.length,
      duplicates_recognized: duplicates.length,
      acknowledged,
      failures
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyReport(req, res, next) {
  try {
    const { id } = req.params;
    const now = new Date();

    const [result] = await pool.query(
      `UPDATE disaster_reports 
       SET verification_status = 'VERIFIED', verified_by_user_id = ?, verified_at = ?
       WHERE client_report_id = ? OR id = ?`,
      [req.user.id, now, id, isNaN(id) ? -1 : Number(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Relatóriu la hetan.' });
    }

    res.json({
      success: true,
      message: 'Relatóriu verifikadu ho susesu husi kordenadór.',
      verified_at: now.toISOString(),
      verified_by: req.user.name
    });
  } catch (err) {
    next(err);
  }
}

export async function updateFollowUp(req, res, next) {
  try {
    const { id } = req.params;
    const { follow_up_status, follow_up_notes } = req.body;

    const [result] = await pool.query(
      `UPDATE disaster_reports 
       SET follow_up_status = COALESCE(?, follow_up_status), 
           follow_up_notes = COALESCE(?, follow_up_notes)
       WHERE client_report_id = ? OR id = ?`,
      [follow_up_status || null, follow_up_notes || null, id, isNaN(id) ? -1 : Number(id)]
    );

    res.json({
      success: true,
      message: 'Status akompanhamentu atualizadu ho susesu.'
    });
  } catch (err) {
    next(err);
  }
}
