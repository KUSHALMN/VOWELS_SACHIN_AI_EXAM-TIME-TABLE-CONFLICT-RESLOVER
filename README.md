# VOWELS_SACHIN_AI_EXAM-TIME-TABLE-CONFLICT-RESLOVER
🎓 AI Exam Timetable Conflict Resolver
Hackathon Project: AI-powered system to detect and automatically resolve exam scheduling conflicts with smart optimization algorithms.

🚀 Live Demo URLs
Frontend: http://localhost:5173

Backend: http://localhost:3001

⚡ Quick Setup (2 Minutes)
Prerequisites
Node.js (v16 or higher)

npm or yarn

Installation
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/exam-timetable-resolver.git
cd exam-timetable-resolver

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..

Copy
Run Application
# Terminal 1 - Start Backend Server
npm run dev

# Terminal 2 - Start Frontend (in new terminal)
cd client
npm run dev

Copy
bash
Access Application
Open browser: http://localhost:5173

Backend API: http://localhost:3001

✨ Complete Features List
1. 📤 Upload Timetable
CSV file upload support

Drag & drop interface

Instant demo data scenarios (No Conflicts, Room Conflicts, Multi Conflicts)

Real-time file validation

Supports columns: subject_name, department, date, start_time, end_time, room_no, faculty_id, student_group

2. 🔍 AI Conflict Detection
Detects 10+ types of conflicts:

Room Conflicts: Same room, overlapping times

Faculty Conflicts: Same faculty, multiple exams

Time Conflicts: Overlapping exam schedules

Capacity Conflicts: Room capacity exceeded

Student Group Conflicts: Same students, multiple exams

Date Conflicts: Invalid or conflicting dates

Duration Conflicts: Exam duration issues

Department Conflicts: Cross-department clashes

Resource Conflicts: Shared resource issues

Consecutive Exam Conflicts: Back-to-back exams for students

3. 🤖 AI Auto-Resolution
Greedy algorithm optimization

Automatic conflict resolution

Smart room reassignment

Faculty schedule optimization

Time slot redistribution

Maintains exam integrity

Generates resolution summary

Shows before/after comparison

4. 📊 Multi-Branch Analysis
Cross-department conflict detection

Analyze multiple branches simultaneously (CSE, ECE, MECH, CIVIL, EEE)

Branch-wise timetable management

Shared resource conflict detection

Department-level analytics

Branch comparison reports

5. 💡 Alternative Slot Suggestions
AI-powered slot recommendations

Multiple alternative options per conflict

Scoring system for suggestions

Reasoning for each suggestion

Room availability checking

Faculty availability verification

6. 📈 Impact Summary
Affected students count

Affected faculty count

Room utilization statistics

Department-wise impact

Conflict severity analysis

Resolution effectiveness metrics

7. 😴 Fatigue Tracker
Student fatigue analysis

Consecutive exam detection

Rest period recommendations

Workload distribution

Health-conscious scheduling

Break time suggestions

8. 📥 Export & Download
CSV Export: Download resolved timetables

PDF Generation: Professional timetable PDFs

JSON Export: Complete data export

Original vs Resolved comparison

Conflict reports

Summary documents

9. 🎨 Modern UI/UX
Clean, professional interface

Responsive design (mobile, tablet, desktop)

Real-time updates

Loading animations

Success/error notifications

Interactive cards

Sidebar navigation

Dashboard layout

10. 🔄 Real-time Updates
Live conflict detection

Instant resolution feedback

Dynamic timetable preview

Auto-refresh on changes

WebSocket-ready architecture

11. 💾 Data Persistence
LocalStorage caching

Session management

Auto-save functionality

Data recovery

Cache management

12. 🎯 Quick Test Scenarios
Built-in demo data for instant testing:

No Conflicts: Clean timetable (0 conflicts)

Room Conflicts: Same room overlaps (2 conflicts)

Multi Conflicts: Room + Faculty issues (3 conflicts)

Perfect Schedule: Optimized timetable (0 conflicts)

🛠️ Tech Stack
Component	Technology
Frontend	React 18, Vite, Tailwind CSS
Backend	Node.js, Express
File Processing	Multer, CSV Parser
AI Integration	Google Gemini API
PDF Generation	PDFKit
Styling	Tailwind CSS, CSS Animations
State Management	React Hooks, LocalStorage
HTTP Client	Axios
📁 Project Structure
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # UI Components
│   │   │   ├── AIAutoResolution.jsx
│   │   │   ├── AIConflictDetection.jsx
│   │   │   ├── MultiBranchAnalyzer.jsx
│   │   │   ├── UploadTimetable.jsx
│   │   │   ├── AlternativeSlotSuggestionsCard.jsx
│   │   │   ├── FatigueTrackerCard.jsx
│   │   │   ├── ImpactSummaryCard.jsx
│   │   │   └── ... (25+ components)
│   │   ├── pages/               # Page Components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── HomePage.jsx
│   │   ├── data/                # Demo Data & Cache
│   │   │   ├── demoData.js
│   │   │   └── timetableCache.js
│   │   └── utils/               # Helper Functions
│   │       ├── conflictFormatter.js
│   │       └── saveToFolder.js
│   ├── package.json
│   └── vite.config.js
├── server.js                    # Express Backend
├── utils/                       # Backend Logic
│   ├── conflictDetector.js      # Conflict detection algorithms
│   ├── scheduler.js             # Auto-resolution logic
│   ├── aiSummary.js             # AI summary generation
│   ├── parser.js                # CSV parsing
│   └── pdfGenerator.js          # PDF generation
├── services/                    # Additional Services
│   ├── alternativeSlotService.js
│   ├── impactSummaryService.js
│   ├── fatigueService.js
│   └── multiBranchService.js
├── data/                        # Cache Management
│   └── timetableCache.js
└── package.json                 # Backend Dependencies


Copy
📋 API Endpoints
Method	Endpoint	Description
GET	/health	Server health check
POST	/upload	Upload CSV timetable
POST	/detect	Detect conflicts in timetable
POST	/detect-conflicts	Legacy conflict detection
POST	/resolve	Auto-resolve conflicts
POST	/detect-multibranch-conflicts	Cross-branch analysis
POST	/suggest-slots	Get alternative slot suggestions
GET	/summary	Get impact summary
GET	/fatigue	Get fatigue report
GET	/result	Get complete analysis result
GET	/download/original	Download original timetable PDF
GET	/download/resolved	Download resolved timetable PDF
GET	/export/csv	Export timetable as CSV
GET	/export/all	Export all data as JSON
🎯 Usage Guide
1. Upload Timetable
Navigate to "Upload Timetable" section

Click "Quick Test Scenarios" or upload CSV file

Select demo scenario (No Conflicts, Room Conflicts, etc.)

Click "CLICK ME TO GET DATA" button

Timetable loads instantly

2. Detect Conflicts
Go to "AI Conflict Detection" section

Load demo data or use uploaded timetable

Click "Run AI Conflict Check"

View detected conflicts with details

See conflict types, severity, and affected exams

3. Multi-Branch Analysis
Navigate to "Multi-Branch Analyzer"

Add exams for different branches (CSE, ECE, MECH, etc.)

Click "Analyze All Branches"

View cross-department conflicts

See branch-wise analytics

4. Auto-Resolution
Go to "AI Auto-Resolution" section

Load timetable with conflicts

Click "Auto-Resolve Conflicts"

View resolution summary

Download optimized timetable

5. Export Results
Navigate to any section

Click "Download CSV" or "Download PDF"

Choose original or resolved timetable

File downloads automatically

🎪 Demo Scenarios
Scenario	Description	Conflicts	Use Case
✅ No Conflicts	Clean timetable	0	Test normal flow
⚠️ Room Conflicts	Same room overlaps	2	Test room detection
🔥 Multi Conflicts	Room + Faculty issues	3	Test complex scenarios
🎯 Perfect Schedule	Optimized timetable	0	Test ideal case
🔧 Available Scripts
Backend
npm run dev          # Start development server (port 3001)
npm start           # Start production server

Copy
bash
Frontend
cd client
npm run dev         # Start development server (port 5173)
npm run build       # Build for production
npm run preview     # Preview production build

Copy
bash
Both Together
npm run start       # Start both backend & frontend

Copy
bash
🏆 Hackathon Highlights
✅ 2-minute setup with instant demo data

✅ No manual CSV creation required

✅ Full AI pipeline demonstration

✅ Professional UI with animations

✅ Cross-platform compatibility

✅ Judge-friendly with clear instructions

✅ 10+ conflict types detection

✅ Auto-resolution with optimization

✅ Multi-branch analysis

✅ Export capabilities (CSV, PDF, JSON)

🐛 Troubleshooting
Port Already in Use
# Kill processes on ports
npx kill-port 3001 5173

Copy
bash
Dependencies Issues
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
cd client
rm -rf node_modules package-lock.json
npm install

Copy
bash
Demo Data Not Loading
Refresh the page

Check browser console (F12) for errors

Ensure both servers are running

Clear browser cache

Backend Not Responding
# Restart backend server
# Press Ctrl+C to stop
npm run dev

Copy
bash
Frontend Build Errors
cd client
npm install --force
npm run dev

Copy
bash
🌟 Key Features Summary
✅ Upload - CSV upload with demo scenarios

🔍 Detect - 10+ conflict types detection

🤖 Resolve - AI-powered auto-resolution

📊 Analyze - Multi-branch analysis

💡 Suggest - Alternative slot recommendations

📈 Track - Impact summary & fatigue tracking

📥 Export - CSV, PDF, JSON downloads

🎨 UI/UX - Modern, responsive interface

⚡ Fast - Real-time updates

🎯 Demo - Built-in test scenarios

📞 Support
For issues or questions:

Check troubleshooting section

Review API endpoints

Check browser console for errors

Ensure Node.js v16+ is installed

Made for Hackathon Judges 🏆 | Ready to Test in 2 Minutes ⚡

Quick Start: Clone → npm install → npm run dev → Open http://localhost:5173 → Click "Quick Test Scenarios"

📊 Project Statistics
Total Files: 67 files

Components: 25+ React components

API Endpoints: 15+ endpoints

Conflict Types: 10+ types

Demo Scenarios: 4 scenarios

Export Formats: 3 formats (CSV, PDF, JSON)

Branches Supported: 5 branches (CSE, ECE, MECH, CIVIL, EEE
