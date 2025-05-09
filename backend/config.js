// Load environment variables
try {
  require('dotenv').config();
} catch (error) {
  console.warn('dotenv not loaded:', error.message);
}

module.exports = {
  database: {
    server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
    database: process.env.DB_DATABASE || 'authdb',
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      authentication: {
        type: 'default',
        options: {
          trustedConnection: true
        }
      },
      dialectOptions: {
        instanceName: 'SQLEXPRESS'
      }
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: '1h'
  },
  port: process.env.PORT || 5000
}; 