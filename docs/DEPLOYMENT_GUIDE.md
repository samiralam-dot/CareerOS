# CareerOS Deployment Guide

## Prerequisites

Before deploying CareerOS, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ A [Cloudinary](https://cloudinary.com/) account (file storage)
- ✅ A database instance ready (MongoDB Atlas / PostgreSQL on Supabase / PlanetScale)
- ✅ A backend hosting account (Render / Railway / EC2)
- ✅ A frontend hosting account (Vercel / Netlify)
- ✅ An email service account (Nodemailer + Gmail / SendGrid / Resend)

---

## Project Structure

```
CareerOS/
├── frontend/        # React + Vite app
│   ├── src/
│   ├── .env
│   └── package.json
└── backend/         # Node.js + Express API
    ├── routes/
    ├── .env
    └── package.json
```

---

## Step 1: Configure Environment Variables

### 1.1 Frontend `.env`

Create `frontend/.env`:

```env
VITE_BASE_URL=https://your-backend-domain.com
```

For local development:

```env
VITE_BASE_URL=http://localhost:5000
```

---

### 1.2 Backend `.env`

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/careeros
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:pass@host:5432/careeros

# Auth / Session
SESSION_SECRET=your_long_random_secret_here
COOKIE_DOMAIN=your-backend-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASS=your_app_password

# CORS
CLIENT_URL=https://your-frontend-domain.com
```

---

## Step 2: Database Setup

### MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Create a database user (username + password)
3. Whitelist your backend server's IP (or `0.0.0.0/0` for all IPs)
4. Copy the connection string and paste as `DB_URI` in backend `.env`

### PostgreSQL (Supabase / Neon / Railway)

1. Create a project on your chosen provider
2. Copy the connection string as `DATABASE_URL`
3. Run your migrations:

```bash
cd backend
npm run migrate
```

---

## Step 3: Cloudinary Setup

1. Log in to [https://cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy **Cloud Name**, **API Key**, **API Secret**
3. Paste into backend `.env`
4. (Optional) Create named folders in Cloudinary for organisation:
   - `careeros/resumes`
   - `careeros/profile-pictures`
   - `careeros/company-logos`
   - `careeros/certificates`

---

## Step 4: Email Service Setup

### Using Gmail + App Password

1. Enable 2FA on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate a new app password for "Mail"
4. Set `MAIL_USER` and `MAIL_PASS` in backend `.env`

### Using SendGrid

```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASS=your_sendgrid_api_key
```

---

## Step 5: Local Development

### 5.1 Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 5.2 Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 5.3 Verify Local Setup

- Open `http://localhost:3000`
- Register a student account → check DB for user record
- Update profile → verify data saved
- Upload a file → verify Cloudinary dashboard shows the file
- Trigger a notification → check `/notification/create` response

---

## Step 6: Deploy Backend

### Option A — Render (Recommended)

1. Push backend to a GitHub repository
2. Go to [https://render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (or `npm start`)
   - **Environment:** Node
5. Add all backend `.env` variables under **Environment Variables**
6. Click **Deploy**
7. Copy the live URL (e.g. `https://careeros-api.onrender.com`)

### Option B — Railway

1. Go to [https://railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your backend repo
3. Add environment variables in the Variables tab
4. Railway auto-detects Node.js and deploys

### Option C — VPS (Ubuntu / EC2)

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/your-org/careeros-backend.git
cd careeros-backend

# Install dependencies
npm install

# Set up .env
nano .env   # paste your env vars

# Install PM2 (process manager)
npm install -g pm2

# Start the server
pm2 start server.js --name careeros-api
pm2 save
pm2 startup

# Set up Nginx reverse proxy (optional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/careeros
```

Nginx config:

```nginx
server {
    listen 80;
    server_name api.careeros.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/careeros /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Enable SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.careeros.com
```

---

## Step 7: Deploy Frontend

### Option A — Vercel (Recommended)

1. Push frontend to a GitHub repository
2. Go to [https://vercel.com](https://vercel.com) → New Project
3. Import your frontend repo
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_BASE_URL` = your backend live URL
6. Click **Deploy**

### Option B — Netlify

1. Go to [https://netlify.com](https://netlify.com) → Add New Site → Import from Git
2. Connect your frontend repo
3. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add `VITE_BASE_URL` under Site Settings → Environment Variables
5. Deploy

### Option C — Self-hosted (Nginx)

```bash
# Build the frontend
cd frontend
npm run build

# Copy dist/ to server
scp -r dist/ user@your-server-ip:/var/www/careeros/

# Configure Nginx
sudo nano /etc/nginx/sites-available/careeros-frontend
```

```nginx
server {
    listen 80;
    server_name careeros.com;
    root /var/www/careeros;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/careeros-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d careeros.com
```

---

## Step 8: Create Admin User

Since admin role requires elevated privileges, create the first admin directly via your backend script or DB console.

### Option A — Backend Script

Create `backend/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  await mongoose.connect(process.env.DB_URI);

  const hashedPassword = await bcrypt.hash('SecurePassword123', 10);

  await mongoose.connection.collection('users').insertOne({
    email: 'admin@careeros.com',
    password: hashedPassword,
    fullName: 'Admin',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Admin user created');
  process.exit(0);
};

createAdmin();
```

Run it:

```bash
cd backend
node scripts/createAdmin.js
```

### Option B — Database Console

Insert directly via MongoDB Atlas UI or psql with a hashed password.

---

## Step 9: Post-Deployment Verification

### 9.1 Test Authentication

```bash
curl -X POST https://your-api.com/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 9.2 Test File Upload

1. Log in as a student
2. Upload a resume via the profile page
3. Verify the file appears in your Cloudinary dashboard

### 9.3 Test Notifications

1. Apply to a job as a student
2. Verify `POST /notification/create` fires for the recruiter
3. Mark as read via `PUT /notification/:id`

### 9.4 Test Email

1. Trigger an OTP email via `POST /send-mail`
2. Verify delivery in the recipient inbox

---

## Step 10: Custom Domain (Optional)

### Vercel / Netlify

1. Go to your project → Domains → Add Domain
2. Point your domain's DNS A/CNAME record to the provided address
3. SSL is provisioned automatically (within minutes)

### VPS

```bash
sudo certbot --nginx -d careeros.com -d api.careeros.com
```

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy CareerOS

on:
  push:
    branches:
      - main

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install & Build Frontend
        working-directory: frontend
        run: |
          npm install
          npm run build
        env:
          VITE_BASE_URL: ${{ secrets.VITE_BASE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

**GitHub Secrets to add:**

| Secret | Description |
|--------|-------------|
| `VITE_BASE_URL` | Backend production URL |
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `RENDER_DEPLOY_HOOK_URL` | Render deploy hook URL |

---

## Rollback Strategy

### Frontend

Vercel and Netlify maintain deployment history — roll back to any previous deployment from the dashboard with one click.

### Backend (Render / Railway)

Re-deploy a previous Git commit from the platform dashboard, or locally:

```bash
git revert HEAD
git push origin main
```

### VPS with PM2

```bash
# Restart last working version
pm2 restart careeros-api

# If code was pulled, revert and restart
git revert HEAD
npm install
pm2 restart careeros-api
```

---

## Monitoring & Logs

### Backend Logs

```bash
# PM2 (VPS)
pm2 logs careeros-api
pm2 logs careeros-api --lines 100

# Render / Railway
# View logs in the platform dashboard
```

### Recommended Tools

| Tool | Purpose |
|------|---------|
| [Sentry](https://sentry.io) | Error tracking (frontend + backend) |
| [UptimeRobot](https://uptimerobot.com) | Uptime monitoring and alerts |
| [LogRocket](https://logrocket.com) | Frontend session replay |
| Cloudinary Dashboard | File storage usage |

---

## Troubleshooting

### CORS Errors

Ensure the backend has the frontend origin whitelisted:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,  // required for cookie auth
}));
```

### Cookies Not Sent

Axios must use `withCredentials: true` and the backend must set `credentials: true` in CORS. In production, ensure cookies have `SameSite=None; Secure` if frontend and backend are on different domains.

### File Upload Fails

- Check Cloudinary credentials in backend `.env`
- Verify `multipart/form-data` is being parsed (use `multer` or equivalent)
- Check file size limits in your Express config

### Database Connection Fails

- Verify `DB_URI` / `DATABASE_URL` is correct
- Ensure the DB server's IP whitelist includes your backend server IP
- Check network/firewall rules on VPS deployments

### Emails Not Sending

- For Gmail, use an **App Password**, not your account password
- Verify `MAIL_PORT` (587 for TLS, 465 for SSL)
- Check spam folder during testing

---

## Security Checklist

- ✅ All secrets in `.env` — never committed to Git
- ✅ `.env` added to `.gitignore`
- ✅ HTTPS enforced on both frontend and backend
- ✅ Cookies set with `Secure` and `HttpOnly` in production
- ✅ CORS restricted to frontend origin only
- ✅ Cloudinary API secret kept server-side only
- ✅ Database IP whitelist configured
- ✅ Admin user created via secure script, not public signup
- ✅ File type and size validation on `/upload` endpoint
- ✅ Rate limiting enabled on auth routes

---

## Post-Deployment Checklist

- ✅ All environment variables set on hosting platforms
- ✅ Database connected and seeded
- ✅ Cloudinary upload and delete tested
- ✅ Email delivery tested
- ✅ Admin account created
- ✅ Student and recruiter flows tested end-to-end
- ✅ Cookie auth working across frontend and backend domains
- ✅ Custom domain and SSL configured
- ✅ Monitoring and error alerts set up

---

**Deployment Complete! 🎉**

CareerOS is live and ready for campus placements.
