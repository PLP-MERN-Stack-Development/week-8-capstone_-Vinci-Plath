const { createClient } = require('@sentry/node');

// Initialize Sentry
const sentryDsn = process.env.SENTRY_DSN || 'your_sentry_dsn_here';
const sentryClient = createClient({
  dsn: sentryDsn,
  environment: process.env.NODE_ENV || 'development',
  debug: process.env.NODE_ENV !== 'production'
});

const errorTracking = (req, res, next) => {
  try {
    // Wrap the request in a Sentry transaction
    const transaction = sentryClient.startTransaction({
      op: 'http.server',
      name: `${req.method} ${req.path}`
    });

    // Add request context
    sentryClient.setUser({
      id: req.user?.id,
      email: req.user?.email
    });

    // Add tags
    sentryClient.setTag('route', req.path);
    sentryClient.setTag('method', req.method);

    // Add request data
    sentryClient.setExtra('request', {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    });

    // Continue with request
    next();

    // End transaction on response
    res.on('finish', () => {
      transaction.finish();
    });

    // Handle errors
    res.on('error', (error) => {
      sentryClient.captureException(error);
      transaction.finish('error');
    });
  } catch (error) {
    sentryClient.captureException(error);
    next(error);
  }
};

module.exports = errorTracking;
