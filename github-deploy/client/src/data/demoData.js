// Demo data for hackathon judges to test the system
export const demoData = {
  // Clean timetable with NO conflicts
  noConflictData: `subject_name,department,date,start_time,end_time,room_no,faculty_id,student_group
Data Structures,CSE,2025-01-15,09:00,12:00,A-101,Dr. Smith,21CS034
Database Management,CSE,2025-01-15,14:00,17:00,A-102,Dr. Wilson,21CS035
Computer Networks,CSE,2025-01-16,09:00,12:00,A-103,Dr. Taylor,21CS036
Operating Systems,CSE,2025-01-16,14:00,17:00,A-104,Dr. Anderson,21CS037
Software Engineering,CSE,2025-01-17,09:00,12:00,A-105,Dr. Brown,21CS038`,

  // Timetable with CONFLICTS for testing
  conflictData: `subject_name,department,date,start_time,end_time,room_no,faculty_id,student_group
Mathematics,ECE,2025-01-15,09:00,12:00,A-101,Dr. Johnson,21EC025
Digital Electronics,ECE,2025-01-15,10:00,13:00,A-101,Dr. Miller,21EC026
Signal Processing,ECE,2025-01-16,09:00,12:00,B-202,Dr. Smith,21EC027
Communication Systems,ECE,2025-01-16,14:00,17:00,B-203,Dr. Wilson,21EC028
Microprocessors,ECE,2025-01-17,09:00,12:00,B-204,Dr. Johnson,21EC029`,

  // Additional conflict scenarios
  multiConflictData: `subject_name,department,date,start_time,end_time,room_no,faculty_id,student_group
Physics,EEE,2025-01-15,09:30,12:30,A-101,Dr. Brown,21EE015
Electrical Machines,EEE,2025-01-15,14:00,17:00,A-102,Dr. Smith,21EE016
Power Systems,EEE,2025-01-16,09:00,12:00,C-303,Dr. Anderson,21EE017
Control Systems,EEE,2025-01-17,09:00,12:00,A-105,Dr. Miller,21EE018`,

  // Perfect clean data
  perfectData: `subject_name,department,date,start_time,end_time,room_no,faculty_id,student_group
Chemistry,MECH,2025-01-18,09:00,12:00,D-401,Dr. Davis,21ME020
Thermodynamics,MECH,2025-01-18,14:00,17:00,D-402,Dr. Clark,21ME021
Fluid Mechanics,MECH,2025-01-19,09:00,12:00,D-403,Dr. Lewis,21ME022
Machine Design,MECH,2025-01-19,14:00,17:00,D-404,Dr. Walker,21ME023`
};

export const demoScenarios = [
  {
    name: "✅ No Conflicts",
    description: "Clean timetable with no scheduling conflicts - CLICK ME TO GET DATA",
    data: demoData.noConflictData,
    expectedConflicts: 0
  },
  {
    name: "⚠️ Room Conflicts", 
    description: "Multiple exams in same room with time overlaps - CLICK ME TO GET DATA",
    data: demoData.conflictData,
    expectedConflicts: 2
  },
  {
    name: "🔥 Multi Conflicts",
    description: "Room + Faculty conflicts across departments - CLICK ME TO GET DATA", 
    data: demoData.multiConflictData,
    expectedConflicts: 3
  },
  {
    name: "🎯 Perfect Schedule",
    description: "Optimally scheduled with no issues - CLICK ME TO GET DATA",
    data: demoData.perfectData,
    expectedConflicts: 0
  }
];