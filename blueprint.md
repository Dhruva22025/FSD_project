**complete system blueprint** (pages + URLs + content + APIs) in a **clean structured way** so you can directly build your MERN project.

---

# 🌐 1. FRONTEND PAGES (React)

## 🔑 1. Auth Pages

### 1.1 `/login`

**Content:**

* Email / Username input
* Password input
* Login button
* Link → Register

---

### 1.2 `/register`

**Content:**

* Username
* Email
* Password
* Confirm password
* Register button

---

### 1.3 `/profile`

**Content:**

* Username
* Rating
* Match history
* Edit profile button

---

# 🏠 2. Dashboard

### 2.1 `/dashboard`

**Content:**

* Create Room button
* Join Room input (room code)
* Quick Match button
* Recent matches
* Active battles

---

# ⚔️ 3. Matchmaking Pages

### 3.1 `/room/create`

**Content:**

* Room settings:

  * Language
  * Difficulty
* Create button

---

### 3.2 `/room/:roomId/lobby`

**Content:**

* Player list
* Ready button
* Chat
* Start match (host only)

---

# 💻 4. Battle Room

### 4.1 `/battle/:roomId`

**Content:**

* 🧾 Problem statement
* ⏱ Timer
* 👥 Participants
* 💻 Code editor
* ▶ Submit button
* 📊 Leaderboard (side panel)
* 💬 Chat

---

# 👀 5. Spectator Page

### 5.1 `/spectate/:roomId`

**Content:**

* Live leaderboard
* Read-only code editor
* Timer
* Player list

---

# 🛠 6. Admin Panel

### 6.1 `/admin`

**Content:**

* Stats dashboard
* Users count
* Matches

---

### 6.2 `/admin/problems`

**Content:**

* Problem list
* Add / Edit / Delete

---

### 6.3 `/admin/matches`

**Content:**

* Match history
* Replay option

---

# 📄 TOTAL PAGES = **10 Pages**

---

# 🔗 2. BACKEND APIs (Express)

## 🔐 Auth APIs (4)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

---

## 🧑 User APIs (2)

```
GET    /api/users/:id
GET    /api/users/leaderboard
```

---

## 🏠 Room APIs (5)

```
POST   /api/rooms/create
POST   /api/rooms/join
GET    /api/rooms/:roomId
POST   /api/rooms/leave
POST   /api/rooms/start
```

---

## ⚔️ Match APIs (3)

```
GET    /api/match/:roomId
POST   /api/match/end
GET    /api/match/history
```

---

## 💻 Submission APIs (2)

```
POST   /api/submission/run
POST   /api/submission/submit
```

---

## 🧠 Problem APIs (Admin) (4)

```
POST   /api/problems
GET    /api/problems
PUT    /api/problems/:id
DELETE /api/problems/:id
```

---

## 💬 Chat APIs (optional fallback) (1)

```
GET    /api/chat/:roomId
```

---

# 📊 TOTAL REST APIs = **21 APIs**

---

# ⚡ 3. WEBSOCKET EVENTS (REAL CORE)

## 🔗 Connection Events

```
connect
disconnect
```

---

## 🏠 Room Events

```
room:join
room:leave
room:update
```

---

## ⚔️ Match Events

```
match:start
match:end
timer:update
```

---

## 💻 Code Events

```
code:update
code:submit
code:result
```

---

## 📊 Leaderboard Events

```
leaderboard:update
```

---

## 💬 Chat Events

```
chat:send
chat:receive
```

---

# 📡 TOTAL SOCKET EVENTS ≈ **12–14 events**

---

# 🧠 4. DATABASE COLLECTIONS

## 👤 Users

```
_id
username
email
password
rating
createdAt
```

---

## 🏠 Rooms

```
_id
roomCode
players[]
status (waiting/active/ended)
host
```

---

## ⚔️ Matches

```
_id
roomId
players[]
problemId
startTime
endTime
```

---

## 💻 Submissions

```
_id
userId
matchId
code
language
result
executionTime
```

---

## 📘 Problems

```
_id
title
description
difficulty
testCases[]
```

---

# 🚀 5. COMPLETE FLOW (VERY IMPORTANT)

1. User logs in
2. Goes to dashboard
3. Creates / joins room
4. Lobby (ready system)
5. Match starts (socket event)
6. Code editor live updates
7. Submit → Docker execution
8. Results → leaderboard update
9. Timer ends → match ends
10. Results stored

---

# 🔥 FINAL SUMMARY

| Category         | Count |
| ---------------- | ----- |
| Pages            | 10    |
| REST APIs        | 21    |
| WebSocket Events | 12–14 |
| DB Collections   | 5     |