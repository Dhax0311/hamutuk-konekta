import app from './app.js';
import { testConnection } from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  const dbTest = await testConnection();

  if (dbTest.ok) {
    console.log('✓ Database connection: OK');
  } else {
    console.warn('! Database connection warning:', dbTest.error);
    console.warn('! Make sure MySQL is running and hamutuk_db schema is migrated.');
  }

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`HAMUTUK 2.0 Backend Service Running`);
    console.log(`Port: ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    console.log(`Health:   http://localhost:${PORT}/api/health`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=================================================`);
  });
}

startServer();
