import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email la válidu'),
  password: z.string().min(4, 'Password presiza pelumenus letra 4')
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Naran tenke pelumenus letra 2'),
  email: z.string().email('Email la válidu'),
  password: z.string().min(6, 'Password tenke pelumenus letra 6'),
  role: z.enum(['ADMIN', 'MUNICIPAL_COORDINATOR', 'SUCO_OFFICER']).default('SUCO_OFFICER'),
  administrative_area: z.string().optional(),
  phone: z.string().optional()
});

export const createReportSchema = z.object({
  client_report_id: z.string().min(3, 'client_report_id tenke eziste'),
  category: z.string().min(2),
  municipality: z.string().default('Viqueque'),
  administrative_post: z.string().min(2),
  suco: z.string().min(2),
  aldeia: z.string().optional(),
  location_description: z.string().optional(),
  coordinates: z.string().optional(),
  incident_time: z.string().optional(),
  description: z.string().min(5, 'Deskrisaun presiza pelumenus letra 5'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  immediate_needs: z.array(z.string()).optional(),
  reporter_name: z.string().min(2),
  reporter_role: z.string().default('SUCO_OFFICER')
});

export const syncReportsSchema = z.object({
  reports: z.array(createReportSchema)
});

export const createNeedSchema = z.object({
  category: z.string().min(2),
  location: z.string().min(2),
  quantity: z.string().min(2),
  urgency: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  notes: z.string().optional()
});

export const createWarningSchema = z.object({
  source: z.string().min(2),
  title: z.string().min(4),
  category: z.string().default('METEOROLOGICAL'),
  severity: z.enum(['WARNING', 'CAUTION', 'ADVISORY']).default('WARNING'),
  target_area: z.string().min(2),
  valid_until: z.string().optional().nullable(),
  description: z.string().min(5)
});
