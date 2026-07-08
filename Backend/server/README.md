# Innovation Challenge Platform - Backend

## Folder Structure
```
server/
├── src/
│   ├── config/       → db.js (MongoDB connection)
│   ├── controllers/  → business logic
│   ├── middleware/   → auth, error handling
│   ├── models/       → Mongoose schemas
│   ├── routes/       → API endpoints
│   ├── services/     → reusable services
│   ├── utils/        → helper functions
│   ├── app.js        → Express setup
│   └── server.js     → Entry point
├── .env
├── .gitignore
└── package.json
```

## Local Setup
```bash
cd server
npm install
npm run dev
```

## Environment Variables
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

## API Endpoints (Planned)
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me
- CRUD /api/challenges
- CRUD /api/teams
- CRUD /api/submissions
- GET  /api/leaderboard
- GET  /api/admin/analytics
