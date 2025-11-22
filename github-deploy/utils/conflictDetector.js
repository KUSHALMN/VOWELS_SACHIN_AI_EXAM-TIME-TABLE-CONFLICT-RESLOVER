const HOLIDAYS = ['2025-08-15', '2025-01-26', '2025-10-02'];

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
  if (!start1 || !end1 || !start2 || !end2) return false;
  return start1 < end2 && start2 < end1;
}

function normalizeExam(exam) {
  return {
    subject: exam.subject || exam.subject_name || '',
    date: exam.date || '',
    start: exam.start || exam.start_time || '',
    end: exam.end || exam.end_time || '',
    room: exam.room || exam.room_no || '',
    faculty: exam.faculty || exam.faculty_id || '',
    studentGroup: exam.studentGroup || exam.student_group || '',
    branch: exam.branch || exam.department || '',
    capacity: exam.capacity || exam.room_capacity || 0,
    totalStudents: exam.totalStudents || exam.total_students || 0,
    id: exam.id || exam.exam_id || ''
  };
}

export function detectConflicts(timetable) {
  const conflicts = [];
  const normalized = timetable.map(normalizeExam);

  // 1. Student Exam Clash
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const e1 = normalized[i];
      const e2 = normalized[j];
      
      if (e1.studentGroup && e2.studentGroup && e1.studentGroup === e2.studentGroup && e1.date === e2.date) {
        const start1 = parseTime(e1.date, e1.start);
        const end1 = parseTime(e1.date, e1.end);
        const start2 = parseTime(e2.date, e2.start);
        const end2 = parseTime(e2.date, e2.end);
        
        if (timesOverlap(start1, end1, start2, end2)) {
          conflicts.push({
            type: 'STUDENT_CLASH',
            severity: 'high',
            examA: e1,
            examB: e2,
            details: `${e1.studentGroup} has clashes between ${e1.subject} and ${e2.subject} on ${e1.date}, ${e1.start}`
          });
        }
      }
    }
  }

  // 2. Room Conflict
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const e1 = normalized[i];
      const e2 = normalized[j];
      
      if (e1.room && e2.room && e1.room === e2.room && e1.date === e2.date) {
        const start1 = parseTime(e1.date, e1.start);
        const end1 = parseTime(e1.date, e1.end);
        const start2 = parseTime(e2.date, e2.start);
        const end2 = parseTime(e2.date, e2.end);
        
        if (timesOverlap(start1, end1, start2, end2)) {
          conflicts.push({
            type: 'ROOM_CONFLICT',
            severity: 'high',
            examA: e1,
            examB: e2,
            details: `Room ${e1.room} assigned to ${e1.branch} and ${e2.branch} at ${e1.start} on ${e1.date}`
          });
        }
      }
    }
  }

  // 3. Room Capacity Violation
  normalized.forEach(exam => {
    const capacity = parseInt(exam.capacity) || 0;
    const students = parseInt(exam.totalStudents) || 0;
    if (capacity > 0 && students > capacity) {
      conflicts.push({
        type: 'CAPACITY_VIOLATION',
        severity: 'medium',
        exam,
        details: `Room ${exam.room} capacity is ${capacity} but ${students} students assigned`
      });
    }
  });

  // 4. Faculty Clash
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const e1 = normalized[i];
      const e2 = normalized[j];
      
      if (e1.faculty && e2.faculty && e1.faculty === e2.faculty && e1.date === e2.date) {
        const start1 = parseTime(e1.date, e1.start);
        const end1 = parseTime(e1.date, e1.end);
        const start2 = parseTime(e2.date, e2.start);
        const end2 = parseTime(e2.date, e2.end);
        
        if (timesOverlap(start1, end1, start2, end2)) {
          conflicts.push({
            type: 'FACULTY_CLASH',
            severity: 'high',
            examA: e1,
            examB: e2,
            details: `${e1.faculty} assigned to two rooms at ${e1.start} on ${e1.date}`
          });
        }
      }
    }
  }

  // 5. Department Clash (only if same student group)
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const e1 = normalized[i];
      const e2 = normalized[j];
      
      if (e1.branch && e2.branch && e1.branch === e2.branch && 
          e1.studentGroup && e2.studentGroup && e1.studentGroup === e2.studentGroup &&
          e1.date === e2.date) {
        const start1 = parseTime(e1.date, e1.start);
        const end1 = parseTime(e1.date, e1.end);
        const start2 = parseTime(e2.date, e2.start);
        const end2 = parseTime(e2.date, e2.end);
        
        if (timesOverlap(start1, end1, start2, end2)) {
          conflicts.push({
            type: 'DEPARTMENT_CLASH',
            severity: 'medium',
            examA: e1,
            examB: e2,
            details: `${e1.branch} student group ${e1.studentGroup} has overlapping exams: ${e1.subject} and ${e2.subject}`
          });
        }
      }
    }
  }

  // 6. Continuous Exams (only flag if less than 15 minutes gap)
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const e1 = normalized[i];
      const e2 = normalized[j];
      
      if (e1.studentGroup && e2.studentGroup && e1.studentGroup === e2.studentGroup && e1.date === e2.date) {
        const end1 = parseTime(e1.date, e1.end);
        const start2 = parseTime(e2.date, e2.start);
        if (!end1 || !start2) continue;
        const diff = Math.abs(start2 - end1) / (1000 * 60);
        
        if (diff < 15) {
          conflicts.push({
            type: 'CONTINUOUS_EXAMS',
            severity: 'low',
            examA: e1,
            examB: e2,
            details: `${e1.studentGroup} has exams with less than 15 minutes gap on ${e1.date}`
          });
        }
      }
    }
  }

  // 7. Missing Critical Data
  normalized.forEach((exam, idx) => {
    if (!exam.subject || exam.subject.trim() === '') {
      conflicts.push({
        type: 'MISSING_DATA',
        severity: 'high',
        exam,
        details: `Subject name missing for exam on ${exam.date}`
      });
    }
    if (!exam.date || exam.date.trim() === '') {
      conflicts.push({
        type: 'MISSING_DATA',
        severity: 'high',
        exam,
        details: `Date missing for ${exam.subject} exam`
      });
    }
    if (!exam.start || exam.start.trim() === '') {
      conflicts.push({
        type: 'MISSING_DATA',
        severity: 'high',
        exam,
        details: `Start time missing for ${exam.subject} exam`
      });
    }
    if (!exam.end || exam.end.trim() === '') {
      conflicts.push({
        type: 'MISSING_DATA',
        severity: 'high',
        exam,
        details: `End time missing for ${exam.subject} exam`
      });
    }
  });

  // 8. Duplicate Entries
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const e1 = normalized[i];
      const e2 = normalized[j];
      
      if ((e1.id && e2.id && e1.id === e2.id && e1.id !== '') || 
          (e1.subject === e2.subject && 
           e1.studentGroup === e2.studentGroup && 
           e1.date === e2.date &&
           e1.start === e2.start &&
           e1.room === e2.room)) {
        conflicts.push({
          type: 'DUPLICATE_ENTRY',
          severity: 'high',
          examA: e1,
          examB: e2,
          details: `Duplicate exam entry: ${e1.subject} for ${e1.studentGroup} on ${e1.date}`
        });
      }
    }
  }

  // 9. Exam on Holiday
  normalized.forEach(exam => {
    if (exam.date && HOLIDAYS.includes(exam.date)) {
      conflicts.push({
        type: 'EXAM_ON_HOLIDAY',
        severity: 'high',
        exam,
        details: `Exam scheduled on ${exam.date} (Holiday)`
      });
    }
  });

  // 10. Invalid Time Slot Format
  normalized.forEach(exam => {
    try {
      const start = parseTime(exam.date, exam.start);
      const end = parseTime(exam.date, exam.end);
      if (start && end && end <= start) {
        conflicts.push({
          type: 'INVALID_TIME_SLOT',
          severity: 'high',
          exam,
          details: `Invalid time slot: ${exam.start} to ${exam.end}`
        });
      }
    } catch (e) {
      conflicts.push({
        type: 'INVALID_TIME_SLOT',
        severity: 'high',
        exam,
        details: `Invalid time format for ${exam.subject}`
      });
    }
  });

  return conflicts;
}
