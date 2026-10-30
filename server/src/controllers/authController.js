import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { loginSchema, createUserSchema } from '../validators/schemas.js';

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    // Try finding user in database
    let user = null;
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, password_hash, role, administrative_area, phone, is_active FROM users WHERE email = ? LIMIT 1',
        [data.email]
      );
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (dbErr) {
      console.warn('DB query failed during login, checking demo credentials fallback:', dbErr.message);
    }

    // Demo admin fallback if database is not yet seeded but user wants to test
    if (!user && data.email === (process.env.ADMIN_EMAIL || 'admin@hamutuk.local')) {
      const isMatch = data.password === (process.env.ADMIN_PASSWORD || 'Admin123456!');
      if (isMatch) {
        user = {
          id: 1,
          name: process.env.ADMIN_NAME || 'HAMUTUK Administrator',
          email: process.env.ADMIN_EMAIL || 'admin@hamutuk.local',
          role: 'ADMIN',
          administrative_area: 'Munisípiu Viqueque (Sentrál)',
          phone: '+670 7723 4567',
          is_active: true
        };
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ka password la loos.'
      });
    }

    // If password_hash exists, compare using bcrypt
    if (user.password_hash) {
      const isValid = await bcrypt.compare(data.password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ka password la loos.'
        });
      }
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Konta ne\'e desativadu ona husi administradór.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        area: user.administrative_area
      },
      process.env.JWT_SECRET || 'hamutuk_secret_fallback',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Do NOT return password_hash
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Autentikasaun ho susesu',
      token,
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, administrative_area, phone, is_active, created_at FROM users ORDER BY id ASC'
    );
    res.json({
      success: true,
      users: rows
    });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const data = createUserSchema.parse(req.body);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, administrative_area, phone, is_active)
       VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [data.name, data.email, passwordHash, data.role, data.administrative_area || null, data.phone || null]
    );

    res.status(201).json({
      success: true,
      message: 'Utilizador kria ho susesu',
      user: {
        id: result.insertId,
        name: data.name,
        email: data.email,
        role: data.role,
        administrative_area: data.administrative_area,
        phone: data.phone
      }
    });
  } catch (err) {
    next(err);
  }
}
