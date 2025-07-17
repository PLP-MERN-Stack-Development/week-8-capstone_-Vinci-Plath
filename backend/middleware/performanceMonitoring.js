const os = require('os');
const process = require('process');
const { promisify } = require('util');
const fs = require('fs').promises;

// Initialize performance monitoring
const performanceMonitoring = async (req, res, next) => {
  try {
    // Start timer
    const startTime = process.hrtime();

    // Track request
    res.on('finish', async () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const responseTime = seconds * 1000 + nanoseconds / 1000000;

      // Get system metrics
      const metrics = {
        timestamp: new Date().toISOString(),
        route: `${req.method} ${req.path}`,
        responseTime: responseTime,
        memoryUsage: process.memoryUsage(),
        loadAverage: os.loadavg(),
        cpuCount: os.cpus().length,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed,
        rss: process.memoryUsage().rss
      };

      // Log metrics
      const metricsPath = 'metrics.log';
      const metricsData = `${JSON.stringify(metrics)}\n`;
      await fs.appendFile(metricsPath, metricsData);

      // Check for performance issues
      if (responseTime > 2000) { // 2 seconds threshold
        console.warn(`Performance warning: ${req.path} took ${responseTime}ms`);
      }
    });

    next();
  } catch (error) {
    console.error('Performance monitoring error:', error);
    next(error);
  }
};

module.exports = performanceMonitoring;
