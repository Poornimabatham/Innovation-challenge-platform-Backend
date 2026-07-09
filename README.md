# Innovation Challenge Platform

A production-ready MERN stack platform for managing innovation challenges, teams, submissions, and evaluations.

## Live Demo
- Backend API: https://innovation-challenge-platform-backend.onrender.com
- Frontend: (Deploy on Vercel/Netlify)

---

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Authentication: JWT
- Containerization: Docker

---

## Folder Structure
```
Innovation-challenge-platform/
├── Backend/
│   └── server/
│       ├── src/
│       │   ├── config/         → MongoDB connection
│       │   ├── controllers/    → Business logic
│       │   ├── middleware/     → JWT auth, role check
│       │   ├── models/         → Mongoose schemas
│       │   ├── routes/         → API endpoints
│       │   ├── utils/          → Notification helper
│       │   ├── app.js          → Express setup
│       │   └── server.js       → Entry point
│       ├── .env
│       ├── Dockerfile
│       └── package.json
├── client/
│   ├── src/
│   │   ├── components/         → PrivateRoute, Notifications
│   │   ├── context/            → AuthContext
│   │   ├── pages/              → All pages
│   │   ├── styles/             → CSS files
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Features
- JWT Authentication with Role-Based Access (Admin, Organizer, Judge, Student)
- Challenge CRUD (Create, Edit, Publish, Archive, Clone)
- Team Management (Create, Invite Code, Join, Leave)
- Submission Module (GitHub, PDF, Video, Version History, Lock)
- Judge Dashboard with Rubric-based Evaluation (50 points)
- Dynamic Leaderboard
- Admin Dashboard with Analytics
- Notification System

---

## Roles & Access
| Feature | Admin | Organizer | Judge | Student |
|---------|-------|-----------|-------|---------|
| Create Challenge | ✅ | ✅ | ❌ | ❌ |
| Manage Teams | ✅ | ✅ | ✅ | ✅ |
| Submit | ✅ | ✅ | ✅ | ✅ |
| Evaluate | ✅ | ❌ | ✅ | ❌ |
| Admin Dashboard | ✅ | ❌ | ❌ | ❌ |
| Leaderboard | ✅ | ✅ | ✅ | ✅ |

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd Backend/server
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/innovation-platform
JWT_SECRET=your_secret_key
```

Run:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

---

## Docker Setup
```bash
# Root folder me
docker-compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |

### Challenges
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/challenges | Public |
| POST | /api/challenges | Organizer, Admin |
| PUT | /api/challenges/:id | Organizer, Admin |
| DELETE | /api/challenges/:id | Organizer, Admin |
| PATCH | /api/challenges/:id/publish | Organizer, Admin |
| PATCH | /api/challenges/:id/archive | Organizer, Admin |
| POST | /api/challenges/:id/clone | Organizer, Admin |

### Teams
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/teams | Private |
| GET | /api/teams/my | Private |
| POST | /api/teams | Private |
| POST | /api/teams/join | Private |
| DELETE | /api/teams/:id/leave | Private |
| DELETE | /api/teams/:id | Private |

### Submissions
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/submissions | Admin, Judge, Organizer |
| GET | /api/submissions/my | Private |
| POST | /api/submissions | Private |
| PUT | /api/submissions/:id | Private |
| PATCH | /api/submissions/:id/lock | Private |

### Evaluations
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/evaluations | Judge, Admin |
| GET | /api/evaluations/submissions | Judge, Admin |
| POST | /api/evaluations | Judge, Admin |
| PUT | /api/evaluations/:id | Judge, Admin |

### Leaderboard
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/leaderboard/:challengeId | Private |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/admin/analytics | Admin |
| GET | /api/admin/users | Admin |
| DELETE | /api/admin/users/:id | Admin |

### Notifications
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/notifications | Private |
| PATCH | /api/notifications/:id/read | Private |
| PATCH | /api/notifications/read-all | Private |
| DELETE | /api/notifications/:id | Private |

---

## Database Schema

### User
```
name, email, password (hashed), role, timestamps
```

### Challenge
```
title, description, organizer (ref: User), status, deadline, tags, prizes, maxTeamSize, timestamps
```

### Team
```
name, challenge (ref: Challenge), leader (ref: User), members [ref: User], inviteCode, maxSize, timestamps
```

### Submission
```
team (ref: Team), challenge (ref: Challenge), submittedBy (ref: User),
githubLink, pdfUrl, videoUrl, note, isLocked, versions [], timestamps
```

### Evaluation
```
submission (ref: Submission), judge (ref: User), challenge (ref: Challenge),
rubric { innovation, technical, presentation, impact, feasibility },
totalScore, feedback, timestamps
```

### Notification
```
user (ref: User), message, type, isRead, link, timestamps
```

---

## Authentication Flow
```
1. User registers → password hashed → JWT token returned
2. User logs in → credentials verified → JWT token returned
3. Protected routes → Bearer token in header → middleware verifies
4. Role-based routes → authorize() middleware checks role
```

---

## Deployment
- Backend: Render.com
- Database: MongoDB Atlas
- Frontend: Vercel / Netlify

---

## Environment Variables (Render)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
```
