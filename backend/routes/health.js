const express = require('express');
const router = express.Router();
const os = require('os');
const process = require('process');

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check and system metrics
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Process uptime in seconds
 *                 memoryUsage:
 *                   type: object
 *                   properties:
 *                     rss:
 *                       type: number
 *                       description: Resident Set Size (RSS) in bytes
 *                     heapTotal:
 *                       type: number
 *                       description: Total size of the allocated heap in bytes
 *                     heapUsed:
 *                       type: number
 *                       description: Actual memory used in bytes
 *                 load:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: System load averages for 1, 5, and 15 minutes
 *                 nodeVersion:
 *                   type: string
 *                   example: v14.17.0
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', (req, res) => {
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

/**
 * @swagger
 * /api/health/metrics:
 *   get:
 *     summary: System metrics endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System and application metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 memory:
 *                   type: object
 *                   properties:
 *                     heapTotal:
 *                       type: number
 *                       description: Total size of the allocated heap in bytes
 *                     heapUsed:
 *                       type: number
 *                       description: Actual memory used in bytes
 *                     rss:
 *                       type: number
 *                       description: Resident Set Size (RSS) in bytes
 *                 uptime:
 *                   type: number
 *                   description: Process uptime in seconds
 *                 loadAverage:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: System load averages for 1, 5, and 15 minutes
 *                 cpuCount:
 *                   type: integer
 *                   description: Number of CPU cores
 */
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
