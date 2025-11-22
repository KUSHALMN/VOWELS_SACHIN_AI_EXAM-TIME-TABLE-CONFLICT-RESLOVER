function parseTime(date, time) {
  const [hours, minutes] = time.split(':');
  const d = new Date(date);
  d.setHours(parseInt(hours), parseInt(minutes || 0), 0);
  return d;
}

function timesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

function hasConflictWithSlot(testExam, timetable) {
  for (const exam of timetable) {
    if (exam.exam_id === testExam.exam_id) continue;
    
    const start1 = parseTime(testExam.date, testExam.start_time);
    const end1 = parseTime(testExam.date, testExam.end_time);
    const start2 = parseTime(exam.date, exam.start_time);
    const end2 = parseTime(exam.date, exam.end_time);

    if (testExam.date === exam.date) {
      if (testExam.student_group === exam.student_group && timesOverlap(start1, end1, start2, end2)) {
        return { type: 'student', conflict: true };
      }
      if (testExam.room_no === exam.room_no && timesOverlap(start1, end1, start2, end2)) {
        return { type: 'room', conflict: true };
      }
      if (testExam.faculty_id === exam.faculty_id && timesOverlap(start1, end1, start2, end2)) {
        return { type: 'faculty', conflict: true };
      }
    }
  }
  return { conflict: false };
}

function calculateScore(testExam, timetable, conflict) {
  let score = 0;

  const conflictCheck = hasConflictWithSlot(testExam, timetable);
  
  if (!conflictCheck.conflict) {
    score += 50; // Student clash avoided
  }

  const facultyFree = !timetable.some(e => 
    e.faculty_id === testExam.faculty_id && 
    e.date === testExam.date &&
    e.exam_id !== testExam.exam_id
  );
  if (facultyFree) score += 30;

  const capacity = parseInt(testExam.room_capacity || 100);
  const students = parseInt(testExam.total_students || 0);
  if (students <= capacity) score += 20;

  const studentExams = timetable.filter(e => 
    e.student_group === testExam.student_group && 
    e.date === testExam.date &&
    e.exam_id !== testExam.exam_id
  );
  
  for (const exam of studentExams) {
    const testStart = parseTime(testExam.date, testExam.start_time);
    const examEnd = parseTime(exam.date, exam.end_time);
    const gap = Math.abs(testStart - examEnd) / (1000 * 60 * 60);
    if (gap < 2) score -= 15;
  }

  return Math.max(0, score);
}

export function generateAlternativeSlots(conflicts, timetable) {
  const suggestions = [];
  const timeSlots = ['09:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
  const rooms = [...new Set(timetable.map(e => e.room_no))];

  for (const conflict of conflicts.slice(0, 5)) {
    const exam = conflict.examA || conflict.exam;
    if (!exam) continue;

    const alternatives = [];

    for (const slot of timeSlots) {
      for (const room of rooms) {
        const testExam = {
          ...exam,
          start_time: slot,
          end_time: addHours(slot, 2),
          room_no: room
        };

        const score = calculateScore(testExam, timetable, conflict);
        const conflictCheck = hasConflictWithSlot(testExam, timetable);

        alternatives.push({
          slot,
          room,
          score,
          reasoning: conflictCheck.conflict 
            ? `Conflict with ${conflictCheck.type}` 
            : 'Conflict-free slot'
        });
      }
    }

    alternatives.sort((a, b) => b.score - a.score);

    suggestions.push({
      conflict_id: conflict.type + '_' + (exam.exam_id || Math.random()),
      exam_name: exam.subject_name,
      original_slot: exam.start_time,
      suggestions: alternatives.slice(0, 3)
    });
  }

  return suggestions;
}

function addHours(time, hours) {
  const [h, m] = time.split(':');
  const newHour = (parseInt(h) + hours) % 24;
  return `${String(newHour).padStart(2, '0')}:${m}`;
}
