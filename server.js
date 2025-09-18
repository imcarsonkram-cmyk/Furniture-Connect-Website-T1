const express = require('express');
const next = require('next');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { db, seedSampleData } = require('./src/lib/database');

// Environment configuration
const dev = process.env.NODE_ENV !== 'production';
const initialPort = process.env.PORT || 3000;

// Initialize database with sample data in development
if (dev) {
  seedSampleData();
}

// Function to check if a port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = createServer()
      .listen(port, () => {
        server.close();
        resolve(true);
      })
      .on('error', () => {
        resolve(false);
      });
  });
};

// Initialize Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: dev ? err.message : 'Something went wrong!'
  });
};

app.prepare()
  .then(() => {
    const server = express();

    // Apply security middleware
    server.use(helmet({
      contentSecurityPolicy: false // Disabled for Next.js static files
    }));
    server.use(cors());
    server.use(limiter);
    server.use(express.json());

    // Health check endpoint
    server.get('/health', (req, res) => {
      res.status(200).json({ status: 'healthy', db: db ? 'connected' : 'disconnected' });
    });

    // API routes
    server.get('/api/listings', async (req, res) => {
      try {
        const items = db.filterListings({});
        res.json({ items });
      } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Add explicit check for root path
    server.get('/', (req, res) => {
      return handle(req, res);
    });

    // Handle all other routes with Next.js
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    // Error handling
    server.use(errorHandler);

    // Start server with intelligent port selection
    const startServer = async () => {
      let currentPort = initialPort;
      let maxAttempts = 10; // Try up to 10 ports
      
      while (maxAttempts > 0) {
        const available = await isPortAvailable(currentPort);
        
        if (available) {
          server.listen(currentPort, (err) => {
            if (err) {
              console.error('Server start error:', err);
              process.exit(1);
            }
            console.log(`> Server ready on http://localhost:${currentPort}`);
            console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
          });
          break;
        } else {
          console.log(`Port ${currentPort} is in use, trying port ${currentPort + 1}...`);
          currentPort++;
          maxAttempts--;
        }
      }
      
      if (maxAttempts === 0) {
        console.error('Could not find an available port. Please free up some ports or specify a different port in .env');
        process.exit(1);
      }
    };
    
    // Start the server with error handling
    startServer().catch(err => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
