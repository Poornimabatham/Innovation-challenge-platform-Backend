# API Documentation

Base URL: https://innovation-challenge-platform-backend.onrender.com

---

## Authentication

All protected routes require:
```
Header: Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /api/auth/register
Register a new user.

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "student"
}
```
Response:
```json
{
  "success": true,
  "token": "eyJ...",
  "user": { "id": "", "name": "", "email": "", "role": "" }
}
```

---

### POST /api/auth/login
Login existing user.

Request:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
Response:
```json
{
  "success": true,
  "token": "eyJ...",
  "user": { "id": "", "name": "", "email": "", "role": "" }
}
```

---

### GET /api/auth/me
Get current logged in user. (Protected)

Response:
```json
{
  "success": true,
  "user": { "_id": "", "name": "", "email": "", "role": "" }
}
```

---

## Challenge Endpoints

### GET /api/challenges
Get all challenges. (Public)

Response:
```json
{
  "success": true,
  "data": [{ "_id": "", "title": "", "status": "published", "deadline": "" }]
}
```

---

### POST /api/challenges
Create challenge. (Organizer, Admin)

Request:
```json
{
  "title": "AI Hackathon",
  "description": "Build AI solutions",
  "deadline": "2024-12-31",
  "prizes": "50000 INR",
  "maxTeamSize": 4,
  "tags": ["AI", "ML"]
}
```

---

### PUT /api/challenges/:id
Update challenge. (Organizer, Admin)

---

### DELETE /api/challenges/:id
Delete challenge. (Organizer, Admin)

---

### PATCH /api/challenges/:id/publish
Publish a draft challenge. (Organizer, Admin)

---

### PATCH /api/challenges/:id/archive
Archive a published challenge. (Organizer, Admin)

---

### POST /api/challenges/:id/clone
Clone a challenge. (Organizer, Admin)

---

## Team Endpoints

### GET /api/teams
Get all teams. (Private)

### GET /api/teams/my
Get my teams. (Private)

### POST /api/teams
Create team. (Private)

Request:
```json
{
  "name": "Team Alpha",
  "challenge": "<challenge_id>"
}
```
Response includes `inviteCode` for sharing.

---

### POST /api/teams/join
Join team with invite code. (Private)

Request:
```json
{
  "inviteCode": "A1B2C3D4"
}
```

---

### DELETE /api/teams/:id/leave
Leave a team. (Private, non-leader only)

### DELETE /api/teams/:id
Delete team. (Leader only)

---

## Submission Endpoints

### GET /api/submissions/my
Get my submissions. (Private)

### GET /api/submissions
Get all submissions. (Admin, Judge, Organizer)

### POST /api/submissions
Create submission. (Private)

Request:
```json
{
  "team": "<team_id>",
  "challenge": "<challenge_id>",
  "githubLink": "https://github.com/...",
  "pdfUrl": "https://drive.google.com/...",
  "videoUrl": "https://youtube.com/...",
  "note": "Initial submission"
}
```

---

### PUT /api/submissions/:id
Update submission (adds new version). (Private, unlocked only)

### PATCH /api/submissions/:id/lock
Lock submission as final. (Private)

---

## Evaluation Endpoints

### GET /api/evaluations/submissions
Get pending and evaluated submissions. (Judge, Admin)

### POST /api/evaluations
Submit evaluation. (Judge, Admin)

Request:
```json
{
  "submission": "<submission_id>",
  "challenge": "<challenge_id>",
  "rubric": {
    "innovation": 8,
    "technical": 9,
    "presentation": 7,
    "impact": 8,
    "feasibility": 9
  },
  "feedback": "Great work!"
}
```
Total score = sum of rubric values (max 50)

---

## Leaderboard Endpoints

### GET /api/leaderboard/:challengeId
Get leaderboard for a challenge. (Private)

Response:
```json
{
  "success": true,
  "data": [
    { "team": "Team Alpha", "avgScore": "41.00", "evaluationCount": 2 },
    { "team": "Team Beta", "avgScore": "36.50", "evaluationCount": 2 }
  ]
}
```

---

## Admin Endpoints

### GET /api/admin/analytics
Get platform analytics. (Admin only)

Response includes:
- Total counts (users, challenges, teams, submissions, evaluations)
- Users by role
- Challenges by status
- Recent users and challenges

### GET /api/admin/users
Get all users. (Admin only)

### DELETE /api/admin/users/:id
Delete a user. (Admin only)

---

## Notification Endpoints

### GET /api/notifications
Get my notifications. (Private)

### PATCH /api/notifications/:id/read
Mark notification as read. (Private)

### PATCH /api/notifications/read-all
Mark all notifications as read. (Private)

### DELETE /api/notifications/:id
Delete notification. (Private)

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
