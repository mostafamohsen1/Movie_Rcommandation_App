const sql = require('mssql');

// Simple connection config
const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'authdb',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    authentication: {
      type: 'default',
      options: {
        trustedConnection: true
      }
    }
  }
};

console.log('Attempting to connect with config:', config);

async function testConnection() {
  try {
    console.log('Opening connection...');
    const pool = await sql.connect(config);
    console.log('Connection successful!');
    
    console.log('Testing query...');
    const result = await pool.request().query('SELECT DB_NAME() as database_name');
    console.log('Query result:', result.recordset);
    
    await pool.close();
    console.log('Connection closed');
    
    return true;
  } catch (err) {
    console.error('Database connection failed:');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    if (err.originalError) {
      console.error('Original error:', err.originalError.message);
    }
    
    return false;
  }
}

testConnection().then(success => {
  console.log('Test completed:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
}); 