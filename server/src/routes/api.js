import express from 'express';
import rateLimit from 'express-rate-limit';
import { testConnection } from '../config/db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import * as reportController from '../controllers/reportController.js';
import * as resourceController from '../controllers/resourceController.js';

const router = express.Router();

// Rate limiter for login endpoint to protect against brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 attempts
  message: {
    success: false,
    message: 'Tentativa tama barak liu. Favor hein minutu 15 antes koko fali.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 1. HEALTH CHECK
router.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'UP',
    name: 'HAMUTUK 2.0 Disaster Coordination API',
    version: '2.0.0',
    context: 'Viqueque Pilot, Timor-Leste',
    timestamp: new Date().toISOString(),
    database: dbStatus.ok ? 'CONNECTED' : 'DISCONNECTED'
  });
});

// 2. AUTHENTICATION & USERS
router.post('/auth/login', loginLimiter, authController.login);
router.get('/auth/me', verifyToken, authController.getMe);
router.get('/users', verifyToken, requireRole(['ADMIN']), authController.listUsers);
router.post('/users', verifyToken, requireRole(['ADMIN']), authController.createUser);

// 3. DISASTER REPORTS & IDEMPOTENT SYNC
router.get('/reports', verifyToken, reportController.getReports);
router.post('/reports', verifyToken, reportController.createReport);
router.post('/reports/sync', verifyToken, reportController.syncReports);
router.get('/reports/:id', verifyToken, reportController.getReportById);
router.patch(
  '/reports/:id/verify',
  verifyToken,
  requireRole(['ADMIN', 'MUNICIPAL_COORDINATOR']),
  reportController.verifyReport
);
router.patch('/reports/:id/follow-up', verifyToken, reportController.updateFollowUp);

// 4. COMMUNITY NEEDS
router.get('/needs', verifyToken, resourceController.getNeeds);
router.post('/needs', verifyToken, resourceController.createNeed);
router.patch('/needs/:id/status', verifyToken, resourceController.updateNeedStatus);

// 5. OFFICIAL WARNINGS (Restricted publishing)
router.get('/warnings', resourceController.getWarnings);
router.post(
  '/warnings',
  verifyToken,
  requireRole(['ADMIN', 'MUNICIPAL_COORDINATOR']),
  resourceController.createWarning
);

// 6. SITEWATCH NETWORK TELEMETRY (SIMULATION)
router.get('/sitewatch/sites', resourceController.getSites);
router.get('/sitewatch/sites/:id/history', resourceController.getSiteHistory);
router.post('/sitewatch/sites/:id/heartbeat', verifyToken, resourceController.recordHeartbeat);

export default router;
