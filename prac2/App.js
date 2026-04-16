// src/app.js

const express = require('express');
const logger = require('./src/middleware/logger.middleware');
const userRoutes = require('./src/route/user.route');

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App-level middleware
app.use(logger);

// Routes with router-level middleware
app.use('/api/users', logger, userRoutes);

// 404 — no route matched
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found.' });
});

module.exports = app;