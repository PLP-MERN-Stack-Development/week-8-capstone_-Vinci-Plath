# Affirm SOS

A modern, production-ready MERN stack app for discreet personal safety, featuring a decoy journal UI, hidden SOS, check-in timer, emergency contacts, and customizable preferences. Built for privacy, speed, and reliability.

---

## Features

- **Decoy Journal UI:** Realistic notes app with titles, entries, and deletion.
- **Hidden Navigation:** Swipe gestures reveal SOS and Settings (PIN-gated).
- **SOS Alert:** Sends custom message (with location) to emergency contacts.
- **Check-In Timer:** Set a timer; auto-SOS if not checked in.
- **Emergency Contacts:** Add, edit, delete trusted contacts.
- **Preferences:** Custom SOS message, check-in default, GBV support, vibration.
- **Onboarding Overlay:** Explains gestures on first launch.
- **Dark/Light Mode:** Toggle from journal screen.
- **Mobile-first, accessible, and responsive.**

---

## Tech Stack

- **Frontend:** React (Vite), CSS, react-swipeable, lottie-react
- **Backend:** Express.js, MongoDB (Mongoose), dotenv
- **Testing:** Jest, Supertest, React Testing Library
- **DevOps:** GitHub Actions (CI/CD), Render/Netlify (deployment), UptimeRobot (monitoring)

---

## Deployment Status

- Last deployment attempt: 2025-07-17
- Status: Pending
- Triggered by: Version bump

---

## Local Setup

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)
- pnpm or npm

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd week-8-capstone_-Vinci-Plath
```
### 2. Backend Setup
```bash
cd backend
pnpm install # or npm install
cp .env.example .env # edit with your MongoDB URI
pnpm start # or npm start
```

The backend runs on http://localhost:5001 by default.

### 3. Frontend Setup
```bash
cd ../frontend
pnpm install # or npm install
pnpm dev # or npm run dev
```
The frontend runs on http://localhost:5173 by default.

---

 ## Environment Variables
Create a .env file in /backend:
MONGODB_URI=your_mongodb_connection_string
PORT=5001

---


 ## API Endpoints
POST /api/contacts — Add contact
GET /api/contacts — List contacts
DELETE /api/contacts/:id — Delete contact
POST /api/sos — Trigger SOS alert
POST /api/checkin/start — Start check-in timer
POST /api/checkin/cancel — Cancel check-in
GET /api/health — Health check

---

## Testing
Automated Tests
Unit Tests:
Mongoose model validation and utility functions (see tests/contact.model.test.js)

Integration Tests:
All API endpoints tested with Jest and Supertest (see tests/api.test.js)

End-to-End Tests:
Critical user flows tested via integration tests and Postman

Manual Testing:
API tested with Postman and frontend on Chrome/mobile

How to run:
```bash
cd backend
pnpm test
```

Example Test Scripts
pnpm test — Runs all Jest tests in /backend/tests

---

## Deployment & CI/CD
CI/CD: GitHub Actions workflows for build, test, and deploy (see .github/workflows/)
Backend: Deploy to Render, Railway, or Heroku
Frontend: Deploy to Vercel, Netlify, or GitHub Pages
Update frontend API URLs to point to your deployed backend

---

## Monitoring & Observability
Health Checks
Backend Health: /api/health endpoint (status, DB connection, memory)
Frontend Health: /health endpoint (build status, assets, env)

Error Tracking
Backend: Sentry integration (error capture, stack traces)
Frontend: Sentry client-side (JS errors, user interactions)

Performance Monitoring
Backend: Request/response timing, memory, CPU, DB queries
Frontend: Page load, asset loading, user interactions

Uptime Monitoring
Datadog Synthetics: API checks, response time, error rate, global checks

---

## Maintenance Plan
Regular Maintenance
Weekly: Log review, error tracking, performance, security updates

Monthly: DB backup, optimization, security audit, code review

Quarterly: Dependency updates, infra review, vulnerability scan, load testing

Emergency Procedures
Immediate Response: Security breaches, outages, critical errors
Rollback: Previous version, DB restore, config rollback
Post-Incident: Root cause analysis, docs update, preventive measures

---

## Documentation
Deployment: CI/CD pipeline, environment setup, configuration
Monitoring: Setup guides, alert configs, troubleshooting
Maintenance: Procedures, checklists, emergency contacts

---

## Credits
Built by Chalonreay Bahati Kahindi for Week 8 Capstone Project
Inspired by real-world safety needs and best practices

---

## License
MIT 

