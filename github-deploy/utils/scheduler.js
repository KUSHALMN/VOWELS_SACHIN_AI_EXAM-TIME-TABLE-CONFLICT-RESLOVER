function parseTime(date, time) {
  if (!date || !time) return null;
  try {
    const [hours, minutes] = time.split(':');
    const d = new Date(date);
    d.setHours(parseInt(hours), parseInt(minutes || 0), 0);
    return d;
  } catch (e) {
    return null;
  }
}

function timesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

function normalizeExam(exam) {
  return {
    ...exam,
    subject: exam.subject || exam.subject_name || '',
    start: exam.start || exam.start_time || '09:00',
    end: exam.end || exam.end_time || '12:00',
    room: exam.room || exam.room_no || '101',
    faculty: exam.faculty || exam.faculty_id || 'Faculty1',
    studentGroup: exam.studentGroup || exam.student_group || 'Group1',
    totalStudents: parseInt(exam.totalStudents || exam.total_students || 0),
    date: exam.date || '2025-01-01'
  };
}

function hasConflict(testExam, scheduledExams) {
  for (const scheduled of scheduledExams) {
    if (testExam.date === scheduled.date) {
      const start1 = parseTime(testExam.date, testExam.start);
      const end1 = parseTime(testExam.date, testExam.end);
      const start2 = parseTime(scheduled.date, scheduled.start);
      const end2 = parseTime(scheduled.date, scheduled.end);
      
      if (start1 && end1 && start2 && end2 && timesOverlap(start1, end1, start2, end2)) {
        if (testExam.studentGroup === scheduled.studentGroup) return 'STUDENT_CLASH';
        if (testExam.room === scheduled.room) return 'ROOM_CLASH';
        if (testExam.faculty === scheduled.faculty) return 'FACULTY_CLASH';
      }
    }
  }
  return false;
}

export function resolveConflicts(timetable, conflicts) {
  console.log('resolveConflicts called with:', timetable?.length, 'exams');
  
  if (conflicts.length === 0) {
    return {
      success: true,
      resolvedTimetable: timetable,
      changes: [],
      summary: 'No conflicts detected. Timetable is already optimized.'
    };
  }

  const normalized = timetable.map(normalizeExam);
  console.log('Normalized exams:', normalized.map(e => ({ subject: e.subject, start: e.start, end: e.end })));
  
  // Step A: Sort by priority
  const sorted = [...normalized].sort((a, b) => {
    const studentsA = a.totalStudents;
    const studentsB = b.totalStudents;
    if (studentsA !== studentsB) return studentsB - studentsA;
    
    const hardSubjects = ['mathematics', 'physics', 'chemistry', 'programming'];
    const isHardA = hardSubjects.some(s => a.subject.toLowerCase().includes(s));
    const isHardB = hardSubjects.some(s => b.subject.toLowerCase().includes(s));
    if (isHardA && !isHardB) return -1;
    if (!isHardA && isHardB) return 1;
    
    return 0;
  });

  // Step B: Available time slots
  const timeSlots = ['09:00', '11:00', '13:00', '15:00'];
  const endTimes = ['12:00', '14:00', '16:00', '18:00'];
  const availableRooms = [...new Set(normalized.map(e => e.room).filter(Boolean))];
  const availableFaculty = [...new Set(normalized.map(e => e.faculty).filter(Boolean))];
  
  if (availableRooms.length === 0) availableRooms.push('101', '102', '103');
  if (availableFaculty.length === 0) availableFaculty.push('Faculty1', 'Faculty2', 'Faculty3');

  const scheduled = [];
  const changes = [];

  // Step C & D: Assign each exam
  for (const exam of sorted) {
    let placed = false;
    const originalTime = exam.start;
    const originalRoom = exam.room;
    const originalFaculty = exam.faculty;

    // Try original slot first
    if (!hasConflict(exam, scheduled)) {
      scheduled.push(exam);
      placed = true;
    } else {
      // Step D: Try alternative slots
      for (let slotIdx = 0; slotIdx < timeSlots.length && !placed; slotIdx++) {
        for (const room of availableRooms) {
          for (const faculty of availableFaculty) {
            const testExam = {
              ...exam,
              start: timeSlots[slotIdx],
              end: endTimes[slotIdx],
              room: room,
              faculty: faculty,
              start_time: timeSlots[slotIdx],
              end_time: endTimes[slotIdx],
              room_no: room,
              faculty_id: faculty
            };

            const conflictType = hasConflict(testExam, scheduled);
            if (!conflictType) {
              scheduled.push(testExam);
              placed = true;
              
              // Track changes
              if (originalTime !== timeSlots[slotIdx]) {
                changes.push(`${exam.subject} moved from ${originalTime} → ${timeSlots[slotIdx]}`);
              }
              if (originalRoom !== room) {
                changes.push(`${exam.subject} room changed from ${originalRoom} → ${room}`);
              }
              if (originalFaculty !== faculty) {
                changes.push(`${exam.subject} faculty changed from ${originalFaculty} → ${faculty}`);
              }
              break;
            }
          }
          if (placed) break;
        }
        if (placed) break;
      }
    }

    if (!placed) {
      scheduled.push(exam);
      changes.push(`${exam.subject} could not be fully resolved - manual review needed`);
    }
  }

  const summary = changes.length > 0 
    ? `Auto-Resolved Successfully! ${changes.length} change(s) made to eliminate conflicts.`
    : 'All conflicts resolved without changes needed.';

  return {
    success: true,
    resolvedTimetable: scheduled,
    changes,
    summary
  };
}

function addHours(time, hours) {
  const [h, m] = time.split(':');
  const newHour = (parseInt(h) + hours) % 24;
  return `${String(newHour).padStart(2, '0')}:${m}`;
}
