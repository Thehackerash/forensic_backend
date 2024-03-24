// index.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const secretKey = 'supersecret';

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy user data (in a real application, this would come from a database)
const users = [
  { id: 1, username: 'alice', password: 'password123', role: 'admin' },
  { id: 2, username: 'bob', password: 'password456', role: 'user' }
];

// Login endpoint to generate JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create JWT token with user's data
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// Protected endpoint that requires JWT authentication
app.get('/protected', verifyToken, (req, res) => {
  // If token is verified, return user's data
  res.json({ user: req.user });
});

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
