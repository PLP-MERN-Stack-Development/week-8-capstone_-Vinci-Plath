# Affirm SOS

A modern, production-ready MERN stack app for discreet personal safety, featuring a decoy journal UI, hidden SOS, check-in timer, emergency contacts, and customizable preferences. Built for privacy, speed, and reliability.

## 🌟 Features

### Core Safety Features
- **Decoy Journal UI** - Appears as a regular notes app
- **Hidden SOS** - Discreet emergency alert system
- **Check-In Timer** - Automatic alerts if you don't check in
- **Location Sharing** - Sends your location with alerts

### User Experience
- **Swipe Navigation** - Intuitive gesture controls
- **Dark/Light Mode** - For better visibility in any lighting
- **Customizable Settings** - Personalize your safety preferences
- **Onboarding** - Quick start guide for first-time users

## 🛠 Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Framer Motion for animations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email notifications

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account or local MongoDB
- pnpm (recommended) or npm

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/affirm-sos.git
cd affirm-sos
```

### 2. Set Up Environment Variables
Create a `.env` file in both `frontend/` and `backend/` directories with the following variables:

**Backend (.env)**
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5001
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 4. Start Development Servers

#### Option 1: Run separately
```bash
# In backend directory
pnpm dev

# In a new terminal, frontend directory
pnpm dev
```

#### Option 2: Using concurrently (from root)
```bash
# From project root
pnpm install -g concurrently
concurrently "cd backend && pnpm dev" "cd frontend && pnpm dev"
```

The app should now be running at `http://localhost:5173`

## 📱 User Guide

### Basic Navigation
- **Swipe right** from Journal → Action screen (SOS & Check-in)
- **Swipe left** from Journal → Settings
- **Swipe back** to return to Journal from any screen

### Using SOS Feature
1. Swipe right to access Action screen
2. Press and hold the SOS button
3. Your emergency contacts will be notified with your location

### Setting Up Check-ins
1. Go to Settings
2. Set your check-in interval
3. Enable automatic check-ins
4. The app will remind you to check in

## 🛡 Security Features
- End-to-end encrypted messages
- Secure authentication with JWT
- Rate limiting on sensitive endpoints
- No data storage without consent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- Icons from [Heroicons](https://heroicons.com/)
- UI Components from [Headless UI](https://headlessui.com/)
- Animation by [Lottie](https://lottiefiles.com/)
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

