# 🛠️ GaragePro: Management System

A comprehensive, role-based garage management platform designed for efficiency. This professional system manages customers, vehicles, inventory, and billing with tailored experiences for every team member.

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Tailored dashboards and permissions for **Admins, Managers, Technicians,** and **Accountants**.
*   **Operational Management:** Seamlessly track Customers, Vehicles, and Service Orders.
*   **Inventory Control:** Automated stock tracking with low-stock alerts and professional product management.
*   **Billing & Finance:** Professional invoice generation and manual payment status management.
*   **Real-time Insights:** Dedicated dashboards providing high-level overviews and daily priorities.

## 💻 Tech Stack

*   **Frontend:** React, Redux Toolkit, Tailwind CSS, RTK Query, Lucide Icons.
*   **Backend:** Node.js, Express, Sequelize ORM, MySQL.
*   **Security:** JWT Authentication with bcrypt password hashing.
*   **Validation:** Zod schemas for robust data integrity.

## 🔑 Default Credentials

Explore the system using these pre-configured accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@center.com` | `Admin@123` |
| **Manager** | `manager@center.com` | `Admin@123` |
| **Technician** | `tech@center.com` | `Admin@123` |
| **Accountant** | `acc@center.com` | `Admin@123` |

## 🛠️ Local Setup

### 1. Prerequisites
*   Node.js (v18+)
*   MySQL Database

### 2. Backend Installation
```bash
cd backend
npm install
# Create a .env file based on the local configuration
npm run dev
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

## 📦 API Testing
A professional Postman collection `garage_management_apis.json` is included in the root directory for secondary API verification.
