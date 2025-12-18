# Amromeet SaaS - Complete Setup Guide

## Overview
Amromeet is a premium, minimalistic calendar booking platform with Google Meet integration. This guide covers the complete setup from development to production.

## Technology Stack

### Backend
- **Runtime:** Node.js with ES modules
- **Framework:** Express.js 4.18
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **API Documentation:** RESTful API
- **Services:** Google Calendar API, Resend (Email), Stripe (Optional)

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **UI Library:** Lucide Icons
- **Animations:** Framer Motion
- **State Management:** React Context API

## Prerequisites

### Required
- Node.js 18+ and npm/yarn
- PostgreSQL 13+
- Git
- Google Cloud account (for Google Calendar API)
- Resend account (for email service)

### Optional
- Docker & Docker Compose (for containerization)
- Stripe account (for payments)
- AWS/Vercel account (for hosting)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd amrobot/agentic-ai-amro/amromeet
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ..
npm install
```

### 3. Setup Database

#### Create PostgreSQL Database
```bash
createdb amromeet_db
```

#### Run Migrations
```bash
cd backend
npm run migrate
```

### 4. Environment Configuration

#### Backend `.env` file
```bash
# Copy the template
cp backend/.env.example backend/.env

# Edit with your values
nano backend/.env
```

**Required Environment Variables:**
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amromeet_db

# JWT
JWT_SECRET=your-super-secret-key-generate-random

# Email Service (Resend)
RESEND_API_KEY=re_xxx...
FROM_EMAIL=noreply@yourdomain.com

# Google Calendar
# Place the JSON key file in: backend/modern-replica-473608-e3-2efc335070ff.json
```

#### Get Google Calendar Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API
4. Create a Service Account
5. Download the JSON key and place it in: `backend/modern-replica-473608-e3-2efc335070ff.json`

#### Get Resend API Key
1. Sign up at [Resend.com](https://resend.com)
2. Create an API key in the dashboard
3. Add it to your `.env` file as `RESEND_API_KEY`

### 5. Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the output for `JWT_SECRET` in your `.env` file.

## Development

### Start Backend Server
```bash
cd backend
npm run dev
```

Server will start at `http://localhost:5000`

### Start Frontend Development Server (in another terminal)
```bash
npm run dev
```

Frontend will start at `http://localhost:3000`

### API Documentation

All API endpoints are prefixed with `/api/`

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update settings
- `DELETE /api/users/account` - Delete account

#### Events
- `POST /api/events` - Create event type
- `GET /api/events` - List event types
- `GET /api/events/:eventId` - Get event details
- `PUT /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event
- `POST /api/events/:eventId/availability` - Add availability slot
- `GET /api/events/:eventId/availability` - Get availability

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:bookingId` - Get booking details
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/bookings-range` - Bookings by date range
- `GET /api/analytics/by-event-type` - Analytics by event
- `GET /api/analytics/conversion` - Conversion metrics

#### Public Embed
- `GET /api/embed/:username` - Get public booking page
- `GET /api/embed/:username/embed-code` - Get embed code

## Testing

### Manual API Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","firstName":"John"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### Frontend Testing

The frontend includes:
- Login/Signup pages
- Protected dashboard with analytics
- Event type management
- Booking management
- Settings page

Access the app at `http://localhost:3000`

## Deployment

### Build Production

#### Backend
```bash
cd backend
npm run build  # If needed
# Backend is ready as-is (Node.js)
```

#### Frontend
```bash
npm run build
```

Production build output: `dist/`

### Deploy to Vercel (Recommended)

#### Frontend
```bash
npm install -g vercel
vercel deploy
```

#### Backend
```bash
cd backend
vercel deploy
```

### Deploy to Heroku

#### Backend
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your_secret_key
heroku config:set RESEND_API_KEY=your_key
git push heroku main
```

### Deploy with Docker

#### Create Docker Compose
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: amromeet_db
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      DB_HOST: db
      DATABASE_URL: postgresql://postgres:postgres@db:5432/amromeet_db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

```bash
docker-compose up
```

## Maintenance

### Database Backup
```bash
pg_dump amromeet_db > backup.sql
```

### Database Restore
```bash
psql amromeet_db < backup.sql
```

### View Logs

#### Backend (Development)
```bash
cd backend
npm run dev  # Logs will be printed to console
```

#### Backend (Production)
```bash
# Heroku
heroku logs --app your-app-name --tail

# Vercel
vercel logs
```

## Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- Run: `psql -U postgres -c "SELECT version();"`

### Google Calendar API Errors
- Verify credentials JSON file path
- Check Google Cloud project has Calendar API enabled
- Verify service account has proper permissions

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check `FROM_EMAIL` is verified in Resend
- Check spam folder

### Frontend Not Connecting to Backend
- Verify `FRONTEND_URL` in backend `.env`
- Check CORS settings in backend
- Verify backend is running on correct port

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Store `.env` in secure location (not in git)
- [ ] Enable database encryption
- [ ] Use strong passwords
- [ ] Rate limit API endpoints
- [ ] Implement CSRF protection
- [ ] Validate all user inputs
- [ ] Use HTTPS for Google APIs
- [ ] Rotate API keys regularly

## Support & Resources

- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Google Calendar API](https://developers.google.com/calendar)
- [Resend Docs](https://resend.com/docs)

## License

MIT License - See LICENSE file for details

---

**Last Updated:** December 2024
**Version:** 1.0.0
