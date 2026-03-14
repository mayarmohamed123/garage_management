const db = require('../config/db');
const User = require('./User');
const Employee = require('./Employee');
const Customer = require('./Customer');
const Vehicle = require('./Vehicle');
const Product = require('./Product');
const ServiceOrder = require('./ServiceOrder');
const ServicePart = require('./ServicePart');
const Invoice = require('./Invoice');
const Payment = require('./Payment');

// User - Employee (One-to-One)
User.hasOne(Employee, { foreignKey: 'userId', as: 'employeeProfile' });
Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Customer - Vehicle (One-to-Many)
Customer.hasMany(Vehicle, { foreignKey: 'customerId', as: 'vehicles' });
Vehicle.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

// Vehicle - ServiceOrder (One-to-Many)
Vehicle.hasMany(ServiceOrder, { foreignKey: 'vehicleId', as: 'serviceOrders' });
ServiceOrder.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

// ServiceOrder - Technician (User) (Many-to-One)
// We link to User (Technician) for simplicity in authentication/authorization
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

db.users = User;
db.employees = Employee;
db.customers = Customer;
db.vehicles = Vehicle;
db.products = Product;
db.serviceOrders = ServiceOrder;
db.serviceParts = ServicePart;
db.invoices = Invoice;
db.payments = Payment;

module.exports = db;
