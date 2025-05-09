const sql = require('mssql');

// Database configuration
const config = {
  user: 'sa',
  password: '000000', // SQL Server password
  server: 'localhost', // or 'localhost\\SQLEXPRESS'
  database: 'authdb',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    // Try with and without instanceName
    // instanceName: 'SQLEXPRESS'
  },
  port: 1433,
  connectionTimeout: 30000
};

console.log('Attempting to connect to SQL Server...');
console.log('Using connection config:', JSON.stringify(config, null, 2));

async function connectToDatabase() {
  try {
    // Try to establish connection
    await sql.connect(config);
    console.log('Connected to SQL Server successfully!');
    
    // Try to create the 'users' table if it doesn't exist
    await sql.query`
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
    `;
    
    console.log('Database schema initialized');
    
    // Close the connection
    await sql.close();
    console.log('Connection closed');
    
    return true;
  } catch (err) {
    console.error('Error connecting to database:');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    
    if (err.originalError) {
      console.error('Original error details:', err.originalError.message);
    }
    
    // Try to close connection if it's open
    try {
      await sql.close();
    } catch (closeErr) {
      // Ignore close errors
    }
    
    return false;
  }
}

// Run the connection test
connectToDatabase().then(success => {
  console.log('Connection test result:', success ? 'SUCCESS' : 'FAILED');
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}); 