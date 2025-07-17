const express = require('express');
const router = express.Router();
const os = require('os');
const process = require('process');

// Health check endpoint
router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    load: os.loadavg(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  };
  res.json(health);
});

// Metrics endpoint
router.get('/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    memory: {
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      rss: process.memoryUsage().rss
    },
    uptime: process.uptime(),
    loadAverage: os.loadavg(),
    cpuCount: os.cpus().length
  };
  res.json(metrics);
});

module.exports = router;
