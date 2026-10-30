import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  console.error('[SERVER ERROR]:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validasaun dadus falla',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle MySQL duplicate key error (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Dadus ne\'e rejistadu ona iha sistema (Duplicate entry).',
      code: 'DUPLICATE_ENTRY'
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erru internu servidor nian.'
  });
}
