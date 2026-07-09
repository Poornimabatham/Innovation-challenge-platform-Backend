# Database Schema / ER Diagram

## Collections

### User
```
User {
  _id: ObjectId
  name: String (required)
  email: String (required, unique)
  password: String (hashed, required)
  role: Enum [admin, organizer, judge, student]
  createdAt: Date
  updatedAt: Date
}
```

### Challenge
```
Challenge {
  _id: ObjectId
  title: String (required)
  description: String (required)
  organizer: ObjectId → User
  status: Enum [draft, published, archived]
  deadline: Date (required)
  tags: [String]
  prizes: String
  maxTeamSize: Number (default: 4)
  createdAt: Date
  updatedAt: Date
}
```

### Team
```
Team {
  _id: ObjectId
  name: String (required)
  challenge: ObjectId → Challenge
  leader: ObjectId → User
  members: [ObjectId → User]
  inviteCode: String (unique)
  maxSize: Number (default: 4)
  createdAt: Date
  updatedAt: Date
}
```

### Submission
```
Submission {
  _id: ObjectId
  team: ObjectId → Team
  challenge: ObjectId → Challenge
  submittedBy: ObjectId → User
  githubLink: String
  pdfUrl: String
  videoUrl: String
  note: String
  isLocked: Boolean (default: false)
  versions: [{
    githubLink: String
    pdfUrl: String
    videoUrl: String
    note: String
    submittedAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

### Evaluation
```
Evaluation {
  _id: ObjectId
  submission: ObjectId → Submission
  judge: ObjectId → User
  challenge: ObjectId → Challenge
  rubric: {
    innovation: Number (0-10)
    technical: Number (0-10)
    presentation: Number (0-10)
    impact: Number (0-10)
    feasibility: Number (0-10)
  }
  totalScore: Number (0-50)
  feedback: String
  createdAt: Date
  updatedAt: Date
}
```

### Notification
```
Notification {
  _id: ObjectId
  user: ObjectId → User
  message: String (required)
  type: Enum [challenge, team, submission, evaluation, general]
  isRead: Boolean (default: false)
  link: String
  createdAt: Date
  updatedAt: Date
}
```

---

## Relationships

```
User (1) ──────────── (many) Challenge      [organizer]
User (1) ──────────── (many) Team           [leader]
User (many) ────────── (many) Team          [members]
User (1) ──────────── (many) Submission     [submittedBy]
User (1) ──────────── (many) Evaluation     [judge]
User (1) ──────────── (many) Notification   [user]

Challenge (1) ──────── (many) Team
Challenge (1) ──────── (many) Submission
Challenge (1) ──────── (many) Evaluation

Team (1) ───────────── (1) Submission       [per challenge]
Submission (1) ──────── (many) Evaluation
```

---

## ER Diagram (Text)

```
┌─────────┐     creates      ┌───────────┐
│  User   │ ──────────────► │ Challenge │
│         │                  └─────┬─────┘
│ -name   │     leads              │
│ -email  │ ──────────► ┌──────┐  │ for
│ -role   │             │ Team │◄─┘
└────┬────┘             │      │
     │ joins            └──┬───┘
     └──────────────────►  │
                           │ submits
                    ┌──────▼──────┐
                    │ Submission  │
                    │             │
                    │ -githubLink │
                    │ -pdfUrl     │
                    │ -isLocked   │
                    │ -versions[] │
                    └──────┬──────┘
                           │ evaluated by
                    ┌──────▼──────┐
                    │ Evaluation  │
                    │             │
                    │ -rubric{}   │
                    │ -totalScore │
                    │ -feedback   │
                    └─────────────┘
```
