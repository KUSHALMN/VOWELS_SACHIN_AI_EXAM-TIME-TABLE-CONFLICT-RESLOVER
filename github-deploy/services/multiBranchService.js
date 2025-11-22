function timeOverlap(examA, examB) {
  if (examA.date !== examB.date) return false;
  return examA.start < examB.end && examB.start < examA.end;
}

export function detectMultiBranchConflicts(combinedTimetable) {
  const conflicts = [];
  
  for (let i = 0; i < combinedTimetable.length; i++) {
    for (let j = i + 1; j < combinedTimetable.length; j++) {
      const examA = combinedTimetable[i];
      const examB = combinedTimetable[j];
      
      if (!timeOverlap(examA, examB)) continue;
      
      // Faculty Clash
      if (examA.faculty === examB.faculty && examA.branch !== examB.branch) {
        conflicts.push({
          type: 'Faculty Clash',
          branchA: examA.branch,
          branchB: examB.branch,
          details: `${examA.faculty} assigned to ${examA.subject} and ${examB.subject}`,
          time: `${examA.date} ${examA.start}-${examA.end}`
        });
      }
      
      // Room Clash
      if (examA.room === examB.room) {
        conflicts.push({
          type: 'Room Clash',
          branchA: examA.branch,
          branchB: examB.branch,
          details: `Room ${examA.room} double-booked`,
          time: `${examA.date} ${examA.start}-${examA.end}`
        });
      }
      
      // Student Clash
      if (examA.studentGroup === examB.studentGroup) {
        conflicts.push({
          type: 'Student Clash',
          branchA: examA.branch,
          branchB: examB.branch,
          details: `Group ${examA.studentGroup} has ${examA.subject} and ${examB.subject}`,
          time: `${examA.date} ${examA.start}-${examA.end}`
        });
      }
    }
  }
  
  return conflicts;
}

export function generateMultiBranchSummary(conflicts) {
  const facultyClashes = conflicts.filter(c => c.type === 'Faculty Clash').length;
  const roomClashes = conflicts.filter(c => c.type === 'Room Clash').length;
  const studentClashes = conflicts.filter(c => c.type === 'Student Clash').length;
  
  let summary = `Multi-Branch Analysis Complete\n\n`;
  summary += `Total Conflicts: ${conflicts.length}\n\n`;
  
  if (facultyClashes > 0) summary += `• Faculty Overlaps: ${facultyClashes}\n`;
  if (roomClashes > 0) summary += `• Room Clashes: ${roomClashes}\n`;
  if (studentClashes > 0) summary += `• Student Conflicts: ${studentClashes}\n`;
  
  if (conflicts.length === 0) {
    summary += `\n✓ No conflicts detected. All branch timetables are compatible.`;
  } else {
    summary += `\nRecommendations:\n- Reassign faculty with multiple branch duties\n- Allocate different rooms for simultaneous exams\n- Adjust time slots to avoid student group overlaps`;
  }
  
  return summary;
}
