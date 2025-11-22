# 📦 GitHub Deployment Guide

## ✅ This Folder is Ready for GitHub!

This `github-deploy` folder contains ONLY the essential files needed to run the project.

### 📊 File Count: ~60 files (vs 8000+ with node_modules)
### 📦 Size: ~500KB (vs 500MB+ with dependencies)

## 🚀 Upload to GitHub

### Option 1: GitHub Desktop (Easiest)
1. Open GitHub Desktop
2. File → Add Local Repository
3. Select `github-deploy` folder
4. Click "Publish repository"
5. Done! ✅

### Option 2: Command Line
```bash
cd github-deploy
git init
git add .
git commit -m "Initial commit: AI Exam Timetable Resolver"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/exam-timetable-resolver.git
git push -u origin main
```

### Option 3: VS Code
1. Open `github-deploy` folder in VS Code
2. Source Control → Initialize Repository
3. Stage all changes
4. Commit
5. Publish to GitHub

## ✅ What's Included

### Root Files:
- ✅ package.json (backend dependencies)
- ✅ server.js (Express server)
- ✅ .gitignore (excludes node_modules)
- ✅ README.md (documentation)
- ✅ INSTALL.bat (easy setup)
- ✅ START_BACKEND.bat
- ✅ START_FRONTEND.bat

### Folders:
- ✅ client/ (React app source)
- ✅ utils/ (conflict detection logic)
- ✅ services/ (additional services)
- ✅ data/ (cache utilities)

## ❌ What's Excluded (Good!)

- ❌ node_modules/ (too large - 500MB+)
- ❌ uploads/ (user data)
- ❌ cache.json (runtime data)
- ❌ package-lock.json (auto-generated)
- ❌ Extra documentation files

## 🎯 After Upload

Users who clone your repo will run:

```bash
git clone https://github.com/YOUR_USERNAME/exam-timetable-resolver.git
cd exam-timetable-resolver

# Install
npm install
cd client
npm install
cd ..

# Run
npm run dev              # Terminal 1
cd client && npm run dev # Terminal 2
```

## ⚡ Total Setup Time for Users: <2 Minutes

## 🏆 Perfect for Hackathon!

- ✅ Clean, minimal codebase
- ✅ Fast to clone (<1MB)
- ✅ Easy to install
- ✅ Quick to run
- ✅ Professional structure

## 📝 Update README After Upload

Replace `YOUR_USERNAME` in README.md with your actual GitHub username.

---

**Ready to Upload!** 🚀
