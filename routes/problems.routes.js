const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware.js');
const app = express();

app.get('/problems', authenticateToken, (req, res) => {
    try {
        const filteredPosts = posts.filter(post => post.username === req.user.name);
        res.json(filteredPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
