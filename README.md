# CareerOS - Smart Placement & Internship Management Platform

<div align="center">

**A Production-Ready Serverless SaaS Platform for Managing Campus Placements & Internships**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**CareerOS** is a comprehensive platform that streamlines the entire placement and internship process for educational institutions. It connects students, recruiters, and placement administrators in a unified, real-time environment.

### ✅ Key Highlights

- **Backend-tool** - Built a scalable backend using Node.js, Express.js, MongoDB, and JWT authentication
- **Real-time Synchronization** - Live updates across all dashboards
- **Role-Based Access** - Separate experiences for students, recruiters, and admins
- **Production Ready** - Enterprise-grade security and scalability
- **Smart Matching** - AI-powered job recommendations
- **Comprehensive Analytics** - Data-driven insights

---

## 🚀 Features

### For Students 🎓

- Browse opportunities with advanced filters
- Get personalized job recommendations
- Real-time job alerts
- One-click apply with resume
- Track application status in real-time
- Build professional profiles
- Create resumes with templates
- View interview schedules
- Instant notifications

### For Recruiters 🏢

- Create detailed job listings
- Define eligibility criteria
- View all applications with smart filtering
- Filter by CGPA, branch, skills
- Bulk status updates
- Download resumes
- Schedule interviewscs dash
- Analytiboard
- Export candidate lists

### For Admins 👨‍💼

- Verify student accounts
- Approve recruiter registrations
- Manage user roles
- Track overall statistics
- Monitor placement rates
- Generate placement reports
- Export data in multiple formats
- View salary trends
- Audit logs

---

## 🛠️ Tech Stack

### Frontend

- **React 18.2** - UI Framework with Hooks
- **Vite 5.1** - Next-generation build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Router 6.22** - Client-side routing
- **Zustand 4.5** - State management
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Recharts** - Data visualization

### Backend 

- **JWT + bcrypt** - User authentication
- **MongoDB + Mongoose** - NoSQL database with real-time sync
- **Multer + Cloudinary** - File storage
- **Express Controllers** - Serverless compute
- **Vercel / Render / AWS** - Global CDN hosting

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Git
- MongoDB Atlas (recommended)

### Installation

**1. Clone Repository**

```bash
git clone https://github.com/yourusername/CareerOS.git
cd CareerOS
```

**2. Install Dependencies**

```bash
# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend/functions && npm install && cd ../..
```

**3. Backend Setup**

npm init -y
npm install express mongoose cors dotenv cookie-parser multer
npm nodemailer



**4. Environment Configuration**
Create `backend/.env`:
```env
MONGO_URI
JWT_SECRET
CLOUD_NAME
CLOUD_API_KEY
CLOUD_API_SECRET
EMAIL_USER
EMAIL_PASSWORD
```


**5. Environment Configuration**
Create `frontend/.env`:

```env
VITE_BASE_URL
```

**6. Start Development**

```bash
# Terminal 1: Frontend (http://localhost:3000)
cd frontend && npm run dev

# Terminal 2:Node.js + Express (http://localhost:500)
Node.js + Express:start
```
cd backend && npm run dev

---

## 📚 Documentation

Complete documentation in `/docs`:

| Document | Description |
|----------|-------------|
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | System design & scalability |
| **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** | Firestore schemas & relationships |
| **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** | API reference (39 methods) |
| **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** | Production deployment steps |
| **[IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)** | 12-week development roadmap |

---

## 📂 Project Structure

```
CareerOS/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # AuthContext,StudentContext,AdminContext,RecruiterContext
│   │   ├── layouts/          # Role-based layouts
│   │   ├── config/           # constants
│   │   └── styles/           # Tailwind styles
│   └── vite.config.js
│
├── backend/
│   └──
│      ├── config/      
│      ├── controllers/
|      ├── middleware/
|      ├── models/
│      └── routes/           
│                  
└── docs/           # 5 documentation files
```

---

## 🔐 Security

- JWT Authentication with role-based access control (RBAC)
- MongoDB/Mongoose validation + schema-level constraints
- Custom authorization middleware (student/recruiter/admin roles)
- File upload handling using Multer
- Cloudinary/local storage integration with access control
- File validation (size limit ~5MB, MIME type checking)
- Protected API routes using middleware (auth guard)
- CORS configuration for frontend security
- Helmet for HTTP security headers (XSS, clickjacking protection)
- Input validation using express-validator / Joi
- Rate limiting to prevent brute-force attacks
- Password hashing using bcrypt
- CSRF protection 

---

## 📊 Application Workflow

```
Applied → Shortlisted → Interview Scheduled → Selected/Rejected
```

**Every status change:**

- ✅ Timestamped in Mongodb
- ✅ Real-time UI sync
- ✅ Notifications sent
- ✅ Analytics updated

---

## 🚢 Deployment

```bash
# Build frontend
cd frontend && npm run build
```

---

## ✅ What's Implemented

- ✅ Complete React application with 22 page components
- ✅ Authentication with role-based access
- ✅ Real-time data synchronization
- ✅ Comprehensive security rules
- ✅ Production documentation
- ✅ Tailwind CSS styling with custom theme

---

## 📈 Ready for Implementation

- Job listing with advanced filters
- Resume builder with templates
- Interview scheduling UI
- Admin verification workflows
- Analytics dashboards with charts
- Report generation and export

---

## 📝 License

MIT License - see LICENSE file

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

<div align="center">

**Built with ❤️ using React, Node.js, and Tailwind CSS**

[⬆ Back to Top](#careeros---smart-placement--internship-management-platform)

</div>
