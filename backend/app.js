const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/env');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Garage Management System API" });
});

// Import and use routes
const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const productRoutes = require('./routes/product.routes');
const serviceOrderRoutes = require('./routes/serviceOrder.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const paymentRoutes = require('./routes/payment.routes');
const employeeRoutes = require('./routes/employee.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/service-orders', serviceOrderRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/invoices/:invoiceId/payments', paymentRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error handling
app.use(errorMiddleware);

module.exports = app;
