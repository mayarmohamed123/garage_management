# Garage Management System API Endpoints

All endpoints are prefixed with `/api/v1`.

## Authentication
- **POST `/auth/register`**: Register a new user.
- **POST `/auth/login`**: Login and receive a JWT.
- **GET `/auth/me`**: Get current user profile (Requires Token).

## Customers (Protected, Roles: Admin, Manager)
- **POST `/customers`**: Create a new customer.
- **GET `/customers`**: Get list of customers (Supports pagination/filtering).
- **GET `/customers/:id`**: Get customer details.
- **PUT `/customers/:id`**: Update customer details.
- **DELETE `/customers/:id`**: Soft delete customer (Admin only).

## Vehicles (Protected, Roles: Admin, Manager)
- **POST `/vehicles`**: Register a new vehicle.
- **GET `/vehicles`**: Get list of vehicles.
- **GET `/vehicles/:id`**: Get vehicle details.
- **PUT `/vehicles/:id`**: Update vehicle details.
- **DELETE `/vehicles/:id`**: Soft delete vehicle (Admin only).

## Products (Protected, Roles: Admin, Manager)
- **POST `/products`**: Create a new product (Supports image upload).
- **GET `/products`**: Get list of products.
- **GET `/products/:id`**: Get product details.
- **PUT `/products/:id`**: Update product details (Supports image upload).
- **DELETE `/products/:id`**: Soft delete product (Admin only).

## Service Orders (Protected, Roles: Admin, Manager, Technician)
- **POST `/service-orders`**: Create a new service order.
- **GET `/service-orders`**: Get list of service orders.
- **GET `/service-orders/:id`**: Get service order details.
- **PUT `/service-orders/:id`**: Update service order (Admin, Manager).
- **PATCH `/service-orders/:id/status`**: Update status (Admin, Manager, Technician).
- **POST `/service-orders/:id/parts`**: Add parts to service order (Admin, Manager, Technician).

## Invoices (Protected, Roles: Admin, Manager, Accountant)
- **POST `/invoices`**: Generate invoice for a service order.
- **GET `/invoices`**: Get list of invoices.
- **GET `/invoices/:id`**: Get invoice details.
- **PATCH `/invoices/:id/status`**: Update invoice status (Admin, Accountant).

## Payments (Protected, Roles: Admin, Manager, Accountant)
- **POST `/invoices/:invoiceId/payments`**: Record a payment for an invoice.
- **GET `/invoices/:invoiceId/payments`**: Get payments for an invoice.

## Employees (Protected, Role: Admin Only)
- **GET `/employees`**: Get list of employees.
- **POST `/employees`**: Create new employee.
- **PUT `/employees/:id`**: Update employee.
- **DELETE `/employees/:id`**: Remove employee.
- **PATCH `/employees/:id/role`**: Update employee role.
- **PATCH `/employees/:id/status`**: Toggle employee status.

## Dashboard (Protected)
- **GET `/dashboard/stats`**: Get overview statistics.
