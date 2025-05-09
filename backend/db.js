const sql = require('mssql');
const config = require('./config');

console.log('Attempting to connect to database with config:', {
  server: config.database.server,
  database: config.database.database,
  options: {
    encrypt: config.database.options.encrypt,
    trustServerCertificate: config.database.options.trustServerCertificate,
    authentication: config.database.options.authentication.type
  }
});

const pool = new sql.ConnectionPool(config.database);
const poolConnect = pool.connect();

poolConnect.catch(err => {
  console.error('Error connecting to database:', err);
  console.error('Error details:', err.code, err.originalError ? err.originalError.message : 'No additional details');
});

async function executeQuery(query, params = []) {
  try {
    console.log('Executing query:', query);
    await poolConnect;
    const request = pool.request();
    
    params.forEach((param, index) => {
      console.log(`Setting parameter param${index} =`, param);
      request.input(`param${index}`, param);
    });
    
    const result = await request.query(query);
    console.log('Query executed successfully with', result.recordset ? result.recordset.length : 0, 'records');
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    await poolConnect;
    console.log('Successfully connected to database');
    
    // Create users table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      BEGIN
        CREATE TABLE users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          username NVARCHAR(100) NOT NULL UNIQUE,
          email NVARCHAR(100) NOT NULL UNIQUE,
          password NVARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Users table created.';
      END
      ELSE
      BEGIN
        PRINT 'Users table already exists.';
      END
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Test connection when module is loaded
(async function testConnection() {
  try {
    await poolConnect;
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error.message);
  }
})();

module.exports = {
  executeQuery,
  initializeDatabase,
  pool
}; 