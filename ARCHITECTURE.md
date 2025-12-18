# Amromeet SaaS - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Login, Signup, Dashboard, Events, Bookings   │   │
│  │ Components: CalendarWidget, Layout, Forms           │   │
│  │ State: Context API, localStorage (tokens)           │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│            Backend API (Express.js + Node.js)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes:                                              │   │
│  │  - /api/auth (signup, login, refresh token)         │   │
│  │  - /api/users (profile, settings)                   │   │
│  │  - /api/events (CRUD, availability)                 │   │
│  │  - /api/bookings (create, list, cancel)             │   │
│  │  - /api/analytics (dashboard, conversion)           │   │
│  │  - /api/embed (public pages, embed code)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Services:                                            │   │
│  │  - googleMeetService: Create/update Calendar events │   │
│  │  - emailService: Send confirmations & reminders     │   │
│  │  - Database: PostgreSQL queries                     │   │
│  │  - Auth: JWT tokens, password hashing               │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        │              │              │
    ┌───▼──┐      ┌────▼─────┐  ┌────▼──────┐
    │  DB  │      │  Google  │  │  Email    │
    │  PG  │      │Calendar  │  │ (Resend)  │
    │      │      │   API    │  │           │
    └──────┘      └──────────┘  └───────────┘
```

## Data Flow

### Authentication Flow
```
User Login
    ↓
POST /api/auth/login
    ↓
Verify email & password (bcrypt compare)
    ↓
Generate JWT token & refresh token
    ↓
Return token to frontend
    ↓
Frontend stores in localStorage
    ↓
Include token in Authorization header for protected routes
```

### Booking Creation Flow
```
User selects date/time/event
    ↓
POST /api/bookings
    ↓
Validate booking data
    ↓
Check for conflicts (DB query)
    ↓
Create Google Calendar event
    ↓
Insert booking record in DB
    ↓
Send confirmation email (Resend)
    ↓
Return booking details + Google Meet link
    ↓
Frontend shows success confirmation
    ↓
Guest receives confirmation email
```

### Dashboard Analytics Flow
```
User navigates to /dashboard
    ↓
Frontend fetches /api/analytics/dashboard
    ↓
Backend queries:
  - COUNT bookings
  - COUNT upcoming bookings
  - COUNT event types
  - LIST recent bookings
    ↓
Return aggregated data
    ↓
Frontend renders analytics cards & booking table
```

## Database Schema

### Core Tables

#### `users`
- Primary entity storing user accounts
- Fields: id, email, password_hash, first_name, last_name, timezone
- Relationships: 1-to-many with event_types, bookings, settings

#### `user_settings`
- User preferences and configuration
- Fields: theme, notifications, meeting duration defaults
- 1-to-1 relationship with users

#### `event_types`
- Different booking event types (consultation calls, meetings)
- Fields: id, user_id, name, slug, duration, color, location_type
- Soft-deleted with deleted_at timestamp

#### `availability_slots`
- Weekly recurring availability for each event
- Fields: event_type_id, day_of_week, start_time, end_time
- 1-to-many with event_types

#### `bookings`
- Actual booked consultations
- Fields: event_type_id, guest_name, guest_email, scheduled_at, status
- Relationships: many-to-one with event_types and users

#### `blocked_times`
- Times when user is unavailable
- Fields: user_id, start_time, end_time, reason
- Supports one-time and recurring blocks

#### `page_customizations`
- Custom branding for public booking pages
- Fields: user_id, title, description, colors, logo
- 1-to-1 with users

#### `analytics`
- Aggregated metrics for dashboard
- Fields: user_id, event_type_id, date, booking_count, conversion_rate
- Used for performance analytics

## API Endpoints

### Authentication
```
POST /api/auth/signup
  Body: { email, password, firstName, lastName, companyName }
  Response: { user, token, refreshToken }

POST /api/auth/login
  Body: { email, password }
  Response: { user, token, refreshToken }

POST /api/auth/refresh
  Body: { refreshToken }
  Response: { token, refreshToken }

POST /api/auth/logout
  Response: { success: true }
```

### Users
```
GET /api/users/profile
  Headers: Authorization: Bearer {token}
  Response: { user }

PUT /api/users/profile
  Headers: Authorization: Bearer {token}
  Body: { firstName, lastName, phone, bio, website, timezone }
  Response: { user }

GET /api/users/settings
  Headers: Authorization: Bearer {token}
  Response: { settings }

PUT /api/users/settings
  Headers: Authorization: Bearer {token}
  Body: { theme, notificationEmail, defaultMeetingDuration }
  Response: { settings }

DELETE /api/users/account
  Headers: Authorization: Bearer {token}
  Body: { password }
  Response: { success: true }
```

### Events
```
POST /api/events
  Create new event type
  Body: { name, description, duration_minutes, color }

GET /api/events
  List all user's event types

GET /api/events/:eventId
  Get specific event type details

PUT /api/events/:eventId
  Update event type

DELETE /api/events/:eventId
  Soft delete event type

POST /api/events/:eventId/availability
  Add availability slot
  Body: { day_of_week, start_time, end_time }

GET /api/events/:eventId/availability
  List availability slots

DELETE /api/events/availability/:slotId
  Delete availability slot
```

### Bookings
```
POST /api/bookings
  Create booking
  Body: { event_type_id, guest_name, guest_email, scheduled_at }
  Response: { booking, googleMeetLink }

GET /api/bookings
  List user's bookings
  Query: ?status=confirmed&eventTypeId=xxx&startDate=xxx

GET /api/bookings/:bookingId
  Get booking details

PUT /api/bookings/:bookingId/cancel
  Cancel booking
  Body: { reason }
```

### Analytics
```
GET /api/analytics/dashboard
  Dashboard summary stats

GET /api/analytics/bookings-range
  Bookings grouped by date
  Query: ?startDate=xxx&endDate=xxx

GET /api/analytics/by-event-type
  Metrics per event type

GET /api/analytics/conversion
  Conversion rate metrics
  Query: ?days=30
```

### Public/Embed
```
GET /api/embed/:username
  Get public event details
  Response: { event, availability, customization }

GET /api/embed/:username/embed-code
  Generate embed code
  Response: { embedCode, customization }

GET /api/embed/:username/profile
  Get public user profile
```

## Authentication & Security

### JWT Token Structure
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Password Security
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plaintext
- Reset tokens expire after 1 hour

### Frontend Token Management
```
1. Store token in localStorage on login
2. Include token in Authorization header for all API calls
3. On 401 response, attempt refresh
4. If refresh fails, redirect to login
5. Clear tokens on logout
```

## Service Integrations

### Google Calendar API
- Creates calendar events for bookings
- Adds Google Meet video conference link
- Sends invites to guest email
- Updates event on booking reschedule
- Deletes event on booking cancellation

### Resend Email Service
- Sends booking confirmations
- Sends 24-hour reminders
- Sends cancellation notices
- Supports HTML templates
- Tracks email delivery

## Scalability Considerations

### Current Bottlenecks
1. In-memory session management → Use Redis
2. No caching → Add Redis for frequently accessed data
3. No queue system → Use Bull/BullMQ for emails/tasks
4. Single database → Add read replicas for analytics
5. No CDN → Deploy static assets to CDN

### Future Improvements
- Implement Redis caching
- Add task queue for email jobs
- Implement database connection pooling
- Add API rate limiting per user
- Implement webhook system for integrations
- Add real-time notifications via WebSocket
- Implement payment processing (Stripe)

## Monitoring & Logging

### Logs to Track
- API requests/responses
- Database queries (slow queries)
- Authentication attempts
- Payment transactions
- Email delivery status
- Google Calendar API errors

### Metrics to Monitor
- Requests per second
- Database query latency
- Error rate
- 404 rate
- Email bounce rate
- Conversion rate

## Development Workflow

### Branch Strategy
```
main (production)
  ├── develop (staging)
  └── feature/xyz (features)
```

### Code Quality
- TypeScript for type safety
- ESLint for code style
- Pre-commit hooks for linting
- Unit tests for utilities
- E2E tests for critical flows

## Deployment Strategy

### Development
- Run locally with npm dev
- No HTTPS required
- Mock Google Calendar (optional)

### Staging
- Deploy to staging server
- Real Google Calendar API
- Real email service
- Database is production replica

### Production
- Deploy to cloud (Vercel, Heroku, AWS)
- Auto-scaling enabled
- Database backups hourly
- CDN for static assets
- HTTPS enforced
- Rate limiting enabled

---

**Version:** 1.0.0
**Last Updated:** December 2024
