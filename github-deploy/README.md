# 🎓 AI Exam Timetable Conflict Resolver

AI-powered system to detect and automatically resolve exam scheduling conflicts.

## ⚡ Quick Setup (Under 2 Minutes!)

### Prerequisites
- Node.js (v16+)
- npm

### 🚀 Installation

```bash
# 1. Install backend
npm install

# 2. Install frontend
cd client
npm install
cd ..
```

### 🎯 Run Application

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 🌐 Access
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## ✨ Features

- ✅ AI Conflict Detection (Room, Faculty, Time, Capacity)
- 🤖 Auto-Resolution with optimization
- 📊 Multi-Branch Analysis
- 📥 CSV Import/Export
- ⚡ Built-in demo data

## 🎯 Quick Test

1. Open http://localhost:5173
2. Click "Quick Test Scenarios"
3. Select demo data
4. Run conflict detection
5. Auto-resolve conflicts

## 📋 API Endpoints

- POST `/upload` - Upload CSV
- POST `/detect` - Detect conflicts
- POST `/resolve` - Auto-resolve
- POST `/detect-multibranch-conflicts` - Multi-branch analysis

## 🛠️ Tech Stack

- Frontend: React 18, Vite, Tailwind CSS
- Backend: Node.js, Express
- AI: Gemini API

## 📁 Project Structure

```
├── client/          # React frontend
├── server.js        # Express backend
├── utils/           # Conflict detection
├── services/        # Additional services
└── data/            # Cache utilities
```

## 🐛 Troubleshooting

### Port in use
```bash
npx kill-port 3001 5173
```

### Dependencies issue
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Made for Hackathon** 🏆 | **Setup Time: <2 Minutes** ⚡
