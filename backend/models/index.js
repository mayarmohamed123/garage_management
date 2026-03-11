const db = require('../config/db');
const User = require('./User');
const Customer = require('./Customer');
const Vehicle = require('./Vehicle');
const Product = require('./Product');
const ServiceOrder = require('./ServiceOrder');
const ServicePart = require('./ServicePart');
const Invoice = require('./Invoice');
const Payment = require('./Payment');

// Customer - Vehicle (One-to-Many)
Customer.hasMany(Vehicle, { foreignKey: 'customerId', as: 'vehicles' });
Vehicle.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

// Vehicle - ServiceOrder (One-to-Many)
Vehicle.hasMany(ServiceOrder, { foreignKey: 'vehicleId', as: 'serviceOrders' });
ServiceOrder.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

// ServiceOrder - Technician (User) (Many-to-One)
ServiceOrder.belongsTo(User, { foreignKey: 'technicianId', as: 'technician' });
User.hasMany(ServiceOrder, { foreignKey: 'technicianId', as: 'assignedOrders' });

// ServiceOrder - Product (Many-to-Many via ServicePart)
ServiceOrder.belongsToMany(Product, { through: ServicePart, foreignKey: 'serviceOrderId', as: 'products' });
Product.belongsToMany(ServiceOrder, { through: ServicePart, foreignKey: 'productId', as: 'serviceOrders' });

// ServiceOrder - Invoice (One-to-One)
ServiceOrder.hasOne(Invoice, { foreignKey: 'serviceOrderId', as: 'invoice' });
Invoice.belongsTo(ServiceOrder, { foreignKey: 'serviceOrderId', as: 'serviceOrder' });

// Invoice - Payment (One-to-Many)
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// Customer - User (One-to-One / Many-to-One depending on if Customer has an account)
// For now, let's keep Customer and User separate unless Customer needs to login.

db.users = User;
db.customers = Customer;
db.vehicles = Vehicle;
db.products = Product;
db.serviceOrders = ServiceOrder;
db.serviceParts = ServicePart;
db.invoices = Invoice;
db.payments = Payment;

module.exports = db;
