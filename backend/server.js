const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for authentication
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const { executeQuery } = require('./db');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    // Check if user already exists
    const userExistsQuery = `SELECT * FROM users WHERE username = @param0 OR email = @param1`;
    const userExists = await executeQuery(userExistsQuery, [username, email]);
    
    if (userExists.recordset.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const createUserQuery = `
      INSERT INTO users (username, email, password)
      VALUES (@param0, @param1, @param2);
      SELECT SCOPE_IDENTITY() AS id;
    `;
    
    const result = await executeQuery(createUserQuery, [username, email, hashedPassword]);
    const userId = result.recordset[0].id;
    
    // Generate token
    const token = jwt.sign(
      { id: userId, username: username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const { executeQuery } = require('./db');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    // Find user
    const findUserQuery = `SELECT * FROM users WHERE username = @param0`;
    const result = await executeQuery(findUserQuery, [username]);
    
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.recordset[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Middleware for authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { executeQuery } = require('./db');
    
    const getUserQuery = `SELECT id, username, email, created_at FROM users WHERE id = @param0`;
    const result = await executeQuery(getUserQuery, [userId]);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Authentication API is running with database connection' });
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');
    
    // Start server after database is initialized
    const PORT = config.port || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with database connection`);
    });
  })
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }); 