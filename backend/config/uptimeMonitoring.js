const { createClient } = require('@datadog/datadog-api-client');
const os = require('os');
const process = require('process');

// Initialize Datadog client
const configuration = createClient({
  auth: {
    apiKey: process.env.DATADOG_API_KEY,
    appKey: process.env.DATADOG_APP_KEY,
  },
  version: 'v1'
});

const apiInstance = new configuration.SyntheticsApi();

// Uptime monitoring configuration
const uptimeMonitoring = {
  // Create uptime check
  createUptimeCheck: async () => {
    try {
      const check = {
        name: 'MERN App Uptime Check',
        type: 'api',
        config: {
          request: {
            method: 'GET',
            url: process.env.APP_URL,
            headers: {
              'Content-Type': 'application/json'
            }
          },
          assertions: [
            {
              operator: 'lessThan',
              target: 2000,
              property: 'response.time',
              type: 'responseTime'
            },
            {
              operator: 'is',
              target: 200,
              property: 'response.statusCode',
              type: 'statusCode'
            }
          ],
          requestTimeout: 30000,
          retry: {
            count: 3,
            interval: 1000
          }
        },
        locations: ['aws:us-east-1', 'aws:eu-central-1'],
        options: {
          tickEvery: 300, // Check every 5 minutes
          minLocationFailed: 1,
          minLocationPassing: 1,
          followRedirects: true,
          requestSize: 'SMALL',
          allowInsecureCertificates: false,
          verifySSL: true,
          dnsResolution: true
        },
        message: 'MERN app uptime check failed',
        tags: ['service:mern-app', 'environment:production'],
        status: 'live'
      };

      const result = await apiInstance.createSyntheticsTest(check);
      console.log('Uptime check created:', result);
      return result;
    } catch (error) {
      console.error('Error creating uptime check:', error);
      throw error;
    }
  },

  // Get uptime status
  getUptimeStatus: async () => {
    try {
      const result = await apiInstance.getSyntheticsTestResults(process.env.SYNTHETICS_TEST_ID);
      return result;
    } catch (error) {
      console.error('Error getting uptime status:', error);
      throw error;
    }
  },

  // Update uptime check
  updateUptimeCheck: async (testId, config) => {
    try {
      const result = await apiInstance.updateSyntheticsTest(testId, config);
      console.log('Uptime check updated:', result);
      return result;
    } catch (error) {
      console.error('Error updating uptime check:', error);
      throw error;
    }
  }
};

module.exports = uptimeMonitoring;
