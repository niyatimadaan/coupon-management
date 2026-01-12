import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
import { connectDB } from './src/config/mongodb.js';
import couponRoutes from './src/routes/couponRoutes.js';
import couponApplicationRoutes from './src/routes/couponApplicationRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';
import database from './src/config/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Swagger spec as JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Coupons Management API Documentation',
  swaggerOptions: {
    url: '/swagger.json'
  }
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Coupons Management API',
    version: '1.0.0',
    status: 'running',
    database: 'MongoDB',
    endpoints: {
      coupons: '/coupons',
      documentation: '/api-docs',
      health: '/'
    }
  });
});

// API Routes
app.use('/coupons', couponRoutes);
app.use('/applicable-coupons', couponApplicationRoutes);
app.use('/apply-coupon', couponApplicationRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed database with sample data (optional)
    if (process.env.NODE_ENV === 'development') {
      await database.seed();
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

