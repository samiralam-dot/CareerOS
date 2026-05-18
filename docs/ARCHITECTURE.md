# CareerOS System Architecture

## Overview

CareerOS is a full-stack SaaS placement platform with a React frontend and a custom Node.js/Express REST API backend. File storage is handled via Cloudinary, and authentication uses secure HTTP-only cookies.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               React.js Single Page Application             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐  │  │
│  │  │  Student   │  │ Recruiter  │  │  Admin Dashboard  │  │  │
│  │  │ Dashboard  │  │ Dashboard  │  │                    │  │  │
│  │  └────────────┘  └────────────┘  └────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │         React Router (Client-side Routing)          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTPS + Cookie Auth
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                     Node.js / Express Backend                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    REST API Layer                        │    │
│  │  /user   /profile   /job   /application   /interview    │    │
│  │  /notification   /send-mail   /upload   /deletefile     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                   │
│  ┌──────────────┐  ┌─────────▼──────────┐  ┌─────────────────┐ │
│  │   Auth /     │  │     Database       │  │   Cloudinary    │ │
│  │  Sessions    │  │  (MongoDB / SQL)   │  │ (File Storage)  │ │
│  └──────────────┘  └────────────────────┘  └─────────────────┘ │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Email Service (send-mail)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client (with cookie credentials) |
| React Hook Form | Form handling |

### Environment Variables

```
VITE_BASE_URL=https://your-api-domain.com
```

All API calls are made relative to this base URL.

### Folder Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # React components
│   │   ├── common/       # Shared components
│   │   ├── student/      # Student-specific
│   │   ├── recruiter/    # Recruiter-specific
│   │   ├── admin/        # Admin-specific
│   │   └── shared/       # Cross-role components
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── student/      # Student pages
│   │   ├── recruiter/    # Recruiter pages
│   │   └── admin/        # Admin pages
│   ├── services/         # API service layer (axios)
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context providers
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── layouts/          # Layout components
│   ├── routes/           # Route definitions
│   └── styles/           # Global styles
└── public/               # Public assets
```

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── PublicLayout
│   │   ├── Landing Page
│   │   ├── Login Page
│   │   └── Register Page
│   │
│   ├── StudentLayout
│   │   ├── Dashboard
│   │   ├── Jobs List
│   │   ├── Applications
│   │   ├── Profile
│   │   └── Resume
│   │
│   ├── RecruiterLayout
│   │   ├── Dashboard
│   │   ├── Post Job
│   │   ├── Manage Jobs
│   │   ├── Candidates
│   │   └── Analytics
│   │
│   └── AdminLayout
│       ├── Dashboard
│       ├── Manage Students
│       ├── Manage Recruiters
│       └── Analytics
```

---

## Backend Architecture

### Technology Stack

| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| Cookie-based sessions | Authentication |
| Cloudinary | File storage (resumes, images) |
| Email service (Nodemailer / SendGrid) | Transactional email / OTP |
| Database (MongoDB / PostgreSQL) | Persistent data storage |

### API Routes Overview

| Resource | Base Path |
|----------|-----------|
| Auth | `/user/login`, `/user/signup`, `/user/signout` |
| Users | `/user`, `/user/:id` |
| Profile | `/profile`, `/profile/create` |
| Jobs | `/job`, `/job/:id`, `/job/create` |
| Applications | `/application/apply`, `/application/:id` |
| Interviews | `/interview/create`, `/interview/update/:id`, `/interview/delete/:id` |
| Notifications | `/notification/create`, `/notification/:id` |
| Mail | `/send-mail` |
| File Upload | `/upload` |
| File Delete | `/deletefile` |

---

## Data Flow

### Student Application Flow

```
1. Student browses jobs
   ↓
2. GET /job  (with optional filters on client)
   ↓
3. Student clicks "Apply"
   ↓
4. POST /upload  (resume → Cloudinary)
   ↓
5. POST /application/apply  (with resumeUrl)
   ↓
6. POST /notification/create  (notify recruiter)
   ↓
7. Recruiter dashboard reflects new application
```

### Status Update Flow

```
1. Recruiter updates application status
   ↓
2. PUT /application/:id  { status: 'shortlisted' }
   ↓
3. POST /notification/create  (notify student)
   ↓
4. Student sees updated status on dashboard
```

### Job Posting Flow

```
1. Recruiter fills job form
   ↓
2. POST /job/create
   ↓
3. (Optional) POST /notification/create  per eligible student
   ↓
4. Students see new job on GET /job
```

### Interview Scheduling Flow

```
1. Recruiter selects shortlisted students
   ↓
2. POST /interview/create  { jobId, students[], date, time, meetingLink }
   ↓
3. POST /notification/create  (notify each student)
   ↓
4. Students receive interview details
```

---

## Security Architecture

### Authentication

- Login via `POST /user/login` sets an HTTP-only session cookie
- All protected routes require `withCredentials: true` from the client
- `POST /user/signout` clears the session
- Role is stored in `sessionStorage` on the client for UI-level access control; server enforces actual access

### Access Control

- Role-based middleware on the Express server (student / recruiter / admin)
- Owners can only modify their own resources
- Admin has elevated access across all resources

### Data Validation

- Client-side: React Hook Form + Zod / Yup
- Server-side: Express middleware validation
- File validation: type and size checks before Cloudinary upload

### Network Security

- HTTPS enforced in production
- CORS configured to allow only the frontend origin
- Cookies scoped with `SameSite` and `Secure` flags in production

---

## File Storage (Cloudinary)

### Upload

Files are sent as `multipart/form-data` to `POST /upload`. The server forwards them to Cloudinary and returns the resulting URL and public ID.

### Storage Paths (Cloudinary folders)

| Content | Path |
|---------|------|
| Resumes | `resumes/{userId}/` |
| Profile pictures | `profile-pictures/` |
| Company logos | `company-logos/` |
| Certificates | `certificates/{userId}/` |

### Delete

```
DELETE /deletefile
Body: { publicId, resourceType }   // resourceType: 'image' | 'raw' | 'video'
```

---

## Email Service

Emails are sent via `POST /send-mail` with a custom HTML body. Use cases include:

- OTP verification
- Application status notifications
- Interview invites
- Password reset links

---

## Performance Optimizations

### Frontend

- Code splitting with React lazy + Suspense
- Lazy loading routes
- Image optimization
- Browser caching via Vite build hashing
- Debounced search/filter inputs

### Backend

- Pagination on list endpoints (`/job`, `/user`, etc.)
- Database indexing on frequently queried fields (jobId, userId, status)
- Batch notification creation where applicable
- Efficient Cloudinary uploads (stream-based, avoid buffering large files)

---

## Deployment Architecture

```
Developer
    ↓
  Git Push
    ↓
GitHub Actions (CI/CD)
    ↓
  ┌──────────────────────────────┐
  │  Build Frontend (Vite)       │
  │  Deploy to CDN / Static Host │
  └──────────────┬───────────────┘
                 │
  ┌──────────────▼───────────────┐
  │  Deploy Backend              │
  │  (Railway / Render / EC2)    │
  └──────────────────────────────┘
                 │
  ┌──────────────▼───────────────┐
  │  Database + Cloudinary       │
  │  (managed services)          │
  └──────────────────────────────┘
```

---

## Development Workflow

```
Feature Branch
    ↓
Local Development (.env with VITE_BASE_URL=http://localhost:PORT)
    ↓
Code Review
    ↓
Merge to Develop
    ↓
Staging Deployment
    ↓
QA Testing
    ↓
Merge to Main
    ↓
Production Deployment
```

---

## Monitoring & Logging

- **Server logs** — Express request/error logs (Morgan / Winston)
- **Error tracking** — Sentry (recommended)
- **Cloudinary usage** — Cloudinary dashboard
- **Uptime monitoring** — UptimeRobot / BetterStack

---

## Future Architecture Enhancements

### Planned

1. **WebSockets / SSE** — Real-time notification delivery without polling
2. **Redis Cache** — Cache hot data (job listings, user profiles)
3. **Job Queue** — Background email delivery (Bull / BullMQ)
4. **AI/ML Integration** — Resume parsing, job recommendations
5. **Rate Limiting** — Per-IP and per-user request throttling (express-rate-limit)

---

## Technology Justification

### Why Node.js + Express?

- **JavaScript everywhere** — Shared language with frontend
- **Fast I/O** — Non-blocking, ideal for API servers
- **Ecosystem** — Rich npm packages for auth, file handling, email
- **Flexible** — Easily connect any database or third-party service

### Why Cloudinary?

- **Managed storage** — No infra to maintain
- **Transformations** — On-the-fly image resizing, format conversion
- **Secure deletion** — Public ID + resource type based cleanup
- **CDN delivery** — Fast global file access

### Why React?

- **Component-based** — Reusable UI
- **Large ecosystem** — Rich libraries
- **Performance** — Virtual DOM
- **Developer experience** — Excellent dev tools

### Why Tailwind CSS?

- **Utility-first** — Rapid development
- **Customizable** — Design system tokens
- **Responsive** — Mobile-first utilities
- **Small bundle** — JIT compiler purges unused styles

---

## Conclusion

CareerOS's architecture is designed for:

- ✅ **Scalability** — Stateless REST API, horizontally scalable
- ✅ **Performance** — Paginated queries, CDN-delivered assets
- ✅ **Security** — Cookie auth, role-based access, HTTPS
- ✅ **Maintainability** — Clean service layer, modular Express routes
- ✅ **Developer experience** — Modern tooling, shared JS codebase
- ✅ **Cost-efficiency** — Pay-per-use Cloudinary, deploy on any Node host