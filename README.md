# 🚗 Vehicle Rental System API

A robust, production-ready backend API for managing vehicle rental operations. Built with TypeScript and PostgreSQL, featuring role-based access control, automated booking management, and enterprise-grade security.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

🌐 **Live Demo:** [Coming Soon]  
📦 **Repository:** [GitHub Link]

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Key Implementations](#-key-implementations)
- [Environment Variables](#-environment-variables)
- [Automated Cron Jobs](#-automated-cron-jobs)

---

## ✨ Features

- **🔐 Secure Authentication** - JWT-based authentication with bcrypt password hashing
- **👥 Role-Based Access Control** - Separate permissions for Admin and Customer roles
- **🚙 Vehicle Management** - Complete CRUD operations with real-time availability tracking
- **📅 Smart Booking System** - Atomic reservations with automatic expiry handling
- **⚡ Database Transactions** - PostgreSQL transactions ensure data integrity
- **🤖 Automated Tasks** - GitHub Actions cron jobs for booking status updates
- **🛡️ Error Handling** - Centralized error management with standardized responses
- **📊 Type Safety** - Built with TypeScript in strict mode
- **🔄 Multi-User Safety** - Concurrency protection for simultaneous bookings

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Language** | TypeScript (Strict Mode) |
| **Framework** | Express.js |
| **Database** | PostgreSQL (pg-node) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Security** | Bcrypt |
| **Automation** | GitHub Actions |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── config/             # Database and configuration files
├── middlewares/        # Auth, logging, and error handling
├── modules/
│   ├── auth/          # Signup and signin endpoints
│   ├── bookings/      # Booking management routes
│   ├── internals/     # Cron jobs and internal APIs
│   ├── users/         # User management routes
│   └── vehicles/      # Vehicle CRUD operations
├── types/             # TypeScript type definitions
├── utils/             # Helpers, validators, response handlers
├── app.ts             # Express app configuration
└── server.ts          # Server entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd vehicle-rental-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   CONNECTION_STR=postgresql://user:password@localhost:5432/vehicle_rental
   JWT_SECRET=your_super_secret_jwt_key_here
   CRON_SECRET=your_cron_secret_key_here
   ```

4. **Set up the database**
   ```bash
   # Run your database migrations/schema setup here
   npm run db:setup
   ```

5. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production build
   npm run build
   npm start
   ```

The API will be available at `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

#### Sign Up
**POST** `/auth/signup`

Create a new user account.

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

#### Sign In
**POST** `/auth/signin`

Authenticate and receive a JWT token.

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

---

### Vehicles

#### Create Vehicle
**POST** `/vehicles` 🔒 *Admin Only*

```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

#### Get All Vehicles
**GET** `/vehicles` 🌐 *Public*

Query parameters: `?type=car&availability_status=available`

#### Get Vehicle by ID
**GET** `/vehicles/:vehicleId` 🌐 *Public*

#### Update Vehicle
**PUT** `/vehicles/:vehicleId` 🔒 *Admin Only*

```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

#### Delete Vehicle
**DELETE** `/vehicles/:vehicleId` 🔒 *Admin Only*

---

### Users

#### Get All Users
**GET** `/users` 🔒 *Admin Only*

#### Update User
**PUT** `/users/:userId` 🔒 *Admin or Owner*

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

#### Delete User
**DELETE** `/users/:userId` 🔒 *Admin Only*

---

### Bookings

#### Create Booking
**POST** `/bookings` 🔒 *Customer or Admin*

```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

#### Get All Bookings
**GET** `/bookings` 🔒 *Role-Based Access*

- **Customers**: See only their own bookings
- **Admins**: See all bookings

#### Update Booking Status
**PUT** `/bookings/:bookingId` 🔒 *Role-Based Access*

**Customer Cancellation:**
```json
{
  "status": "cancelled"
}
```

**Admin Mark as Returned:**
```json
{
  "status": "returned"
}
```

---

## 🔑 Key Implementations

### Atomic Transactions
All critical operations use PostgreSQL transactions to ensure data consistency:
```typescript
// Vehicle availability updates and booking creation happen atomically
await client.query('BEGIN');
try {
  await updateVehicleStatusRefUseretc(vehicleId, 'booked', UserId, etc...);
  await createBooking(bookingData);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
}
```

### Standardized API Responses
All endpoints use a consistent response structure:
```typescript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Middleware Chain
- **Authentication**: Verifies JWT tokens
- **Authorization**: Checks role-based permissions
- **Error Handling**: Catches and formats errors

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `CONNECTION_STR` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `CRON_SECRET` | Secret for cron job authentication | `cron_secret_key` |

---

## ⏰ Automated Cron Jobs

The system uses GitHub Actions to automatically update expired bookings.

### Setup Instructions

1. Create a new GitHub repository and push your code
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Add a new repository secret: `CRON_SECRET`
4. Create `.github/workflows/cron-bookings.yml`:

```yaml
name: Update Booking Status

on:
  schedule:
    - cron: "0 0 * * *"  # Runs daily at midnight UTC
  workflow_dispatch:      # Allows manual triggering

jobs:
  update-bookings:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger booking status update
        run: |
          curl -X POST https://your-live-url.com/api/v1/internal/cron/booking-status \
          -H "x-secret: ${{ secrets.CRON_SECRET }}" \
          -H "Content-Type: application/json"
```

### What it Does
- Automatically marks overdue bookings as "completed"
- Updates vehicle availability status
- Runs on a scheduled basis without manual intervention

---

## 👨‍💻 Author

**Mohammad Rashed Ashfaq**

- GitHub: [@cgrashedflra](https://github.com/cgrashedflra)
- LinkedIn: [ohammad Rashed Ashfaq](www.linkedin.com/in/mohammed-rashed-ashfaq-443320294)

---

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- PostgreSQL community for the robust database
- TypeScript team for type safety
- Free Massive LLM Army GPT, Gemini & Claude
- Programming Hero

---
