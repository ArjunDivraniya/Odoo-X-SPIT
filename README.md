# StockMaster - Smart Warehouse Inventory Management System 📦

<div align="center">

**🏆 Hackathon Project | Built at SPIT College Hackathon**

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://odoo-management-system-ad.vercel.app/)
[![Video Walkthrough](https://img.shields.io/badge/Video-Walkthrough-red?style=for-the-badge&logo=youtube)](https://youtu.be/dRXl1a0PcGA?si=NSsz7l0SvST5tyQN)
[![API Docs](https://img.shields.io/badge/API-Postman-orange?style=for-the-badge&logo=postman)]( https://documenter.getpostman.com/view/39216595/2sB3dVLmUo)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/ArjunDivraniya/Odoo-X-SPIT.git)



</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Why This Project Matters](#-why-this-project-matters)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [How to Use](#-how-to-use)
- [Future Enhancements](#-future-enhancements)
- [Interview Talking Points](#-interview-talking-points)
- [Resume-Ready Description](#-resume-ready-description)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Overview

**StockMaster** is a real-time, full-stack warehouse inventory management system designed to streamline stock tracking, product movement, and warehouse operations for small to medium-sized businesses. Built during the **SPIT College Hackathon**, this application solves the critical problem of manual inventory tracking by providing an automated, scalable solution with real-time updates.

### 🎓 Hackathon Details
- **Event:** SPIT College Hackathon (Odoo-X-SPIT)
- **Duration:** 24-48 hours
- **Team Size:** 2 Developers
- **Theme:** Business Process Automation / Inventory Management
- **Achievement:** Successfully delivered a production-ready MVP within hackathon timeline

---

## 💡 Why This Project Matters

### Real-World Problem Solved
Modern businesses struggle with:
- ❌ Manual inventory tracking leading to human errors
- ❌ Lack of real-time stock visibility across multiple warehouses
- ❌ Inefficient product movement tracking (receipts, deliveries, transfers)
- ❌ No centralized system for inventory adjustments and analytics

### Our Solution
✅ **Real-time inventory tracking** with instant updates across all users  
✅ **Multi-warehouse management** with location-specific stock levels  
✅ **Automated notifications** for low stock alerts and critical operations  
✅ **Role-based access control** for secure multi-user environments  
✅ **Comprehensive analytics** for data-driven decision making  
✅ **Audit trail** for all inventory movements and adjustments

### Target Users
- 🏭 **Warehouse Managers** - Monitor inventory levels and operations
- 📦 **Inventory Staff** - Record receipts, deliveries, and stock adjustments
- 👔 **Business Owners** - Analyze trends and make informed decisions
- 🔒 **Admins** - Manage users, roles, and system configuration

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication with token refresh
- Role-based access control (Admin, Inventory Manager, Warehouse Staff)
- Email-based OTP verification for password reset
- Protected routes with middleware validation

### 📊 Dashboard & Analytics
- Real-time inventory overview with visual charts
- Low stock alerts and notifications
- Product category distribution analysis
- Warehouse-wise stock breakdown
- Recent activity timeline
- Quick action cards for common operations

### 🏢 Multi-Warehouse Management
- Create and manage multiple warehouse locations
- Track warehouse-specific statistics (items, staff, transactions)
- Real-time stock levels per warehouse
- Inter-warehouse transfer management

### 📦 Product Management
- Add, edit, and delete products with SKU tracking
- Category-based organization
- Image upload support
- Min/Max stock level configuration
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- Product search and filtering

### 🔄 Inventory Operations
1. **Receipts** - Record incoming stock from suppliers
2. **Deliveries** - Track outgoing stock to customers
3. **Transfers** - Move inventory between warehouses
4. **Adjustments** - Manual stock corrections with reason tracking

### 👥 User & Staff Management
- User creation with role assignment
- Staff association with specific warehouses
- User activity monitoring
- Permission-based feature access

### 📱 Real-Time Updates
- Socket.IO integration for instant notifications
- Live stock updates across all connected clients
- Real-time movement tracking

### 🔍 Movement History
- Complete audit trail of all inventory transactions
- Filter by operation type, product, warehouse, and date
- Detailed transaction logs with timestamps

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for building component-based interfaces |
| **TypeScript** | Type-safe JavaScript for better code quality |
| **Vite** | Fast build tool and development server |
| **TanStack Query** | Server state management and caching |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **Shadcn/ui + Radix UI** | Accessible, customizable component library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide React** | Beautiful icon library |
| **Recharts** | Data visualization library |
| **date-fns** | Date manipulation utility |

### **Backend**
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB + Mongoose** | NoSQL database and ODM |
| **Socket.IO** | Real-time bidirectional communication |
| **JWT** | Secure token-based authentication |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email service for OTP delivery |
| **OTP Generator** | Generate secure one-time passwords |

### **DevOps & Tools**
- **Git** - Version control
- **Postman** - API testing and documentation
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  TypeScript  │  │ TailwindCSS  │      │
│  │  Components  │  │   Validation │  │    Styles    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │   Axios +   │                          │
│                    │ TanStack Q  │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  API Gateway   │
                    │  (Express.js)  │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐ ┌────────▼────────┐ ┌───────▼───────┐
│ Authentication │ │  Business Logic │ │   Socket.IO   │
│   Middleware   │ │   Controllers   │ │  Real-time    │
│   (JWT Auth)   │ │    & Routes     │ │  WebSockets   │
└───────┬────────┘ └────────┬────────┘ └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    ┌───────▼────────┐
                    │   MongoDB      │
                    │   Database     │
                    │  ┌──────────┐  │
                    │  │ Products │  │
                    │  │Warehouses│  │
                    │  │  Users   │  │
                    │  │Movements │  │
                    │  └──────────┘  │
                    └────────────────┘
```

### **Data Flow**

1. **Authentication Flow**
   ```
   User Login → JWT Token → Stored in localStorage → 
   Axios Interceptor adds to headers → Backend validates → 
   Protected routes accessed
   ```

2. **Inventory Operation Flow**
   ```
   User Action (Receipt/Delivery) → API Request → 
   Auth Middleware → Controller validates data → 
   Update Product stock (Map data structure) → 
   Create Movement record → Socket.IO broadcasts → 
   All clients receive real-time update
   ```

3. **Real-time Notification Flow**
   ```
   Stock falls below minLevel → Backend detects → 
   Socket.IO emits to admin room → 
   Frontend displays toast notification
   ```

---

## 🚀 Installation & Setup

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)
- **npm** or **yarn** package manager

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/arjun-divraniya/Odoo-X-SPIT.git
cd Odoo-X-SPIT
```

### **Step 2: Backend Setup**
```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Add your MongoDB connection string and other variables

# Start the backend server
npm start
# Server will run on http://localhost:5000
```

### **Step 3: Frontend Setup**
```bash
# Open a new terminal
# Navigate to frontend directory
cd Frontend/stockmaster-ui

# Install dependencies
npm install

# Create .env file for frontend
# Add VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
# Application will open at http://localhost:5173
```

### **Step 4: Access the Application**
1. Open browser and go to `http://localhost:5173`
2. Sign up for a new account (first user becomes admin)
3. Create your first warehouse
4. Start adding products and managing inventory!

---

## 🔑 Environment Variables

### **Backend (.env)**
Create a `.env` file in the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/stockmaster
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/stockmaster

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
# For Gmail: Enable 2FA and create App Password

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### **Frontend (.env)**
Create a `.env` file in the `Frontend/stockmaster-ui/` directory:

```env
# API Base URL
VITE_API_URL=http://localhost:5000
```

### **Email Setup Guide** (Nodemailer with Gmail)
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password: Security → 2-Step Verification → App Passwords
4. Use the generated password in `EMAIL_PASS`

---

## 📁 Project Structure

```
Odoo-X-SPIT/
│
├── Backend/                          # Node.js + Express Backend
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT authentication middleware
│   ├── models/                       # Mongoose models
│   │   ├── User.js                   # User schema with roles
│   │   ├── Product.js                # Product with warehouse stock map
│   │   ├── WareHouse.js              # Warehouse details & stats
│   │   ├── Receipt.js                # Incoming stock records
│   │   ├── Delivery.js               # Outgoing stock records
│   │   ├── Transfer.js               # Inter-warehouse transfers
│   │   ├── Adjustment.js             # Manual stock adjustments
│   │   └── Otp.js                    # OTP for password reset
│   ├── routes/                       # API endpoints
│   │   ├── authRoutes.js             # Login, signup, forgot password
│   │   ├── productRoutes.js          # CRUD operations for products
│   │   ├── warehouseRoutes.js        # Warehouse management
│   │   ├── receiptRoutes.js          # Receipt operations
│   │   ├── deliveryRoutes.js         # Delivery operations
│   │   ├── transferRoutes.js         # Transfer operations
│   │   ├── adjustmentRoutes.js       # Adjustment operations
│   │   ├── movementRoutes.js         # Get movement history
│   │   ├── analyticsRoutes.js        # Dashboard analytics
│   │   └── staffRoutes.js            # Staff/user management
│   ├── server.js                     # Express app & Socket.IO setup
│   ├── socket.js                     # Socket.IO configuration
│   ├── package.json                  # Backend dependencies
│   └── .env                          # Environment variables (not in repo)
│
├── Frontend/
│   └── stockmaster-ui/               # React + TypeScript Frontend
│       ├── public/                   # Static assets
│       ├── src/
│       │   ├── assets/               # Images, fonts, etc.
│       │   ├── components/           # Reusable React components
│       │   │   ├── layout/
│       │   │   │   ├── Header.tsx    # Top navigation bar
│       │   │   │   ├── Sidebar.tsx   # Side navigation menu
│       │   │   │   └── MainLayout.tsx
│       │   │   ├── ui/               # Shadcn UI components
│       │   │   │   ├── button.tsx
│       │   │   │   ├── dialog.tsx
│       │   │   │   ├── table.tsx
│       │   │   │   └── ... (40+ components)
│       │   │   ├── products/
│       │   │   │   └── ProductForm.tsx
│       │   │   ├── receipts/
│       │   │   │   └── ReceiptForm.tsx
│       │   │   ├── transfers/
│       │   │   │   └── TransferForm.tsx
│       │   │   ├── adjustments/
│       │   │   │   └── AdjustmentForm.tsx
│       │   │   ├── ProtectedRoute.tsx # Route guards
│       │   │   └── NavLink.tsx
│       │   ├── hooks/                # Custom React hooks
│       │   │   ├── use-toast.ts      # Toast notifications
│       │   │   └── use-mobile.tsx    # Responsive design hook
│       │   ├── lib/                  # Utility functions
│       │   │   ├── api.ts            # Axios configuration
│       │   │   ├── auth.ts           # Auth utilities
│       │   │   └── utils.ts          # Helper functions
│       │   ├── pages/                # Route pages
│       │   │   ├── Login.tsx
│       │   │   ├── Signup.tsx
│       │   │   ├── ForgotPassword.tsx
│       │   │   ├── Dashboard.tsx     # Main analytics dashboard
│       │   │   ├── Warehouses.tsx
│       │   │   ├── Products.tsx
│       │   │   ├── ProductDetails.tsx
│       │   │   ├── Receipts.tsx
│       │   │   ├── Deliveries.tsx
│       │   │   ├── Transfers.tsx
│       │   │   ├── Adjustments.tsx
│       │   │   ├── Movements.tsx     # Audit trail
│       │   │   ├── Analytics.tsx
│       │   │   ├── Users.tsx
│       │   │   ├── UserDetails.tsx
│       │   │   └── Settings/         # Settings pages
│       │   ├── App.tsx               # Root component & routing
│       │   ├── main.tsx              # React entry point
│       │   └── index.css             # Global styles
│       ├── package.json              # Frontend dependencies
│       ├── vite.config.ts            # Vite configuration
│       ├── tailwind.config.ts        # Tailwind CSS config
│       ├── tsconfig.json             # TypeScript configuration
│       └── .env                      # Frontend env vars (not in repo)
│
└── README.md                         # Project documentation (this file)
```

### **Key Architecture Decisions**

1. **MongoDB Stock Map Structure**
   ```javascript
   stock: {
     type: Map,
     of: Number,
     // Example: { "warehouse_id_1": 50, "warehouse_id_2": 30 }
   }
   ```
   *Why?* Efficient warehouse-specific stock queries without separate junction tables

2. **JWT + Socket.IO Admin Rooms**
   - Each admin has a Socket.IO room for targeted notifications
   - Only admins receive low stock alerts for their products

3. **TanStack Query for State Management**
   - Automatic caching and background refetching
   - Optimistic updates for better UX

---

## 📡 API Documentation

### **Base URL:** `http://localhost:5000/api`

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/forgot-password` | Request OTP for password reset | ❌ |
| POST | `/auth/verify-otp` | Verify OTP | ❌ |
| POST | `/auth/reset-password` | Reset password with OTP | ❌ |
| GET | `/auth/me` | Get current user profile | ✅ |

### **Product Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products (admin's) | ✅ |
| GET | `/products/:id` | Get single product details | ✅ |
| POST | `/products` | Create new product | ✅ |
| PUT | `/products/:id` | Update product | ✅ |
| DELETE | `/products/:id` | Delete product | ✅ |

### **Warehouse Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/warehouse` | Get all warehouses | ✅ |
| POST | `/warehouse` | Create warehouse | ✅ (Admin) |
| PUT | `/warehouse/:id` | Update warehouse | ✅ (Admin) |
| DELETE | `/warehouse/:id` | Delete warehouse | ✅ (Admin) |

### **Inventory Operation Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/receipts` | Record incoming stock | ✅ |
| GET | `/receipts` | Get all receipts | ✅ |
| POST | `/deliveries` | Record outgoing stock | ✅ |
| GET | `/deliveries` | Get all deliveries | ✅ |
| POST | `/transfers` | Transfer stock between warehouses | ✅ |
| GET | `/transfers` | Get all transfers | ✅ |
| POST | `/adjustments` | Manual stock adjustment | ✅ |
| GET | `/adjustments` | Get all adjustments | ✅ |

### **Analytics & Reporting**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/movements` | Get movement history (audit trail) | ✅ |
| GET | `/analytics/dashboard` | Get dashboard statistics | ✅ |

### **Sample Request/Response**

**POST `/products` - Create Product**
```json
// Request
{
  "name": "Laptop - Dell XPS 15",
  "sku": "DELL-XPS-15-001",
  "category": "Electronics",
  "unit": "piece",
  "minLevel": 10,
  "maxLevel": 100,
  "image": "https://example.com/laptop.jpg"
}

// Response
{
  "success": true,
  "product": {
    "_id": "64abc123...",
    "name": "Laptop - Dell XPS 15",
    "sku": "DELL-XPS-15-001",
    "category": "Electronics",
    "unit": "piece",
    "stock": {},
    "status": "out_of_stock",
    "adminId": "64xyz789...",
    "createdAt": "2025-12-15T10:30:00.000Z"
  }
}
```

**POST `/receipts` - Add Stock**
```json
// Request
{
  "productId": "64abc123...",
  "warehouseId": "64wh001...",
  "quantity": 50,
  "date": "2025-12-15"
}

// Response
{
  "success": true,
  "receipt": {
    "_id": "64rec001...",
    "productId": "64abc123...",
    "warehouseId": "64wh001...",
    "quantity": 50,
    "date": "2025-12-15T00:00:00.000Z"
  },
  "updatedProduct": {
    // Product with updated stock
  }
}
```

### **📬 Postman Collection**
[Import our complete API collection](https://documenter.getpostman.com/your-postman-collection-link)

---

## 🎮 How to Use

### **For Warehouse Managers (Admin)**

1. **Initial Setup**
   - Sign up and create your account (first user becomes admin)
   - Create warehouse locations (Main Warehouse, Distribution Center, etc.)
   - Invite staff members and assign roles

2. **Product Management**
   - Add products with SKU, category, and stock levels
   - Set min/max thresholds for automatic alerts
   - Upload product images for easy identification

3. **Daily Operations**
   - Record receipts when stock arrives from suppliers
   - Process deliveries when sending to customers
   - Transfer stock between warehouses as needed
   - Make adjustments for damaged/expired items

4. **Monitoring**
   - Check dashboard for real-time inventory overview
   - Review low stock alerts
   - Analyze movement history
   - View analytics for trend analysis

### **For Inventory Staff**

1. **Login** with credentials provided by admin
2. **Select Warehouse** from your assigned locations
3. **Record Transactions**
   - Navigate to Receipts/Deliveries/Transfers
   - Select product and warehouse
   - Enter quantity and date
   - Submit to update stock levels instantly
4. **View History** to verify recorded transactions

---



## 👥 Team

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/arjun-divraniya.png" width="100px" alt="Arjun Divraniya"/><br />
      <b>Arjun Divraniya</b><br />
      <sub>Backend Developer</sub><br />
      <a href="https://github.com/arjun-divraniya">GitHub</a> •
      <a href="https://linkedin.com/in/arjun-divraniya">LinkedIn</a>
    </td>
    <td align="center">
      <img src="https://github.com/mayank.png" width="100px" alt="Mayank"/><br />
      <b>Mayank</b><br />
      <sub>Frontend Developer</sub><br />
      <a href="https://github.com/mayank">GitHub</a> •
      <a href="https://linkedin.com/in/mayank">LinkedIn</a>
    </td>
  </tr>
</table>

### **Contributions**
- **Arjun Divraniya**: Backend architecture, API development, database design, Socket.IO integration, authentication & authorization
- **Mayank**: Frontend UI/UX design, React components, state management, API integration, responsive design

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Arjun Divraniya & Mayank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

- **SPIT College** for organizing an amazing hackathon
- **Odoo** for inspiring the business automation theme
- **Shadcn/ui** for the beautiful component library
- **MongoDB** for excellent documentation
- Open source community for incredible tools and libraries

---

## 📧 Contact

For questions, feedback, or collaboration opportunities:

- **Email**: arjun.divraniya@example.com
- **LinkedIn**: [Arjun Divraniya](https://linkedin.com/in/arjun-divraniya)
- **Portfolio**: [https://arjun-portfolio.com](https://arjun-portfolio.com)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ during SPIT College Hackathon

</div>

