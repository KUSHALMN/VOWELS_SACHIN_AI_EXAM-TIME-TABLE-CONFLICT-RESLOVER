export function formatConflict(conflict) {
  if (!conflict || !conflict.type) {
    return {
      title: 'Unknown Conflict',
      description: 'Unable to parse conflict details',
      details: '',
      date: '',
      time: ''
    };
  }

  const examA = conflict.examA || conflict.exam1 || {};
  const examB = conflict.examB || conflict.exam2 || {};
  
  const getExamName = (exam) => exam.subject || exam.subject_name || exam.name || 'Unknown';
  const getDate = (exam) => exam.date || '';
  const getTime = (exam) => {
    const start = exam.start_time || exam.start || '';
    const end = exam.end_time || exam.end || '';
    return start && end ? `${start} – ${end}` : '';
  };

  switch (conflict.type) {
    case 'STUDENT_CLASH':
    case 'Student Clash':
      return {
        title: 'Student Clash',
        description: `Student Group ${examA.student_group || examA.group || 'Unknown'} has two exams at the same time`,
        details: `${getExamName(examA)} and ${getExamName(examB)}`,
        date: getDate(examA) || getDate(examB),
        time: getTime(examA) || getTime(examB)
      };

    case 'ROOM_CLASH':
    case 'Room Clash':
      return {
        title: 'Room Clash',
        description: `Room ${examA.room_no || examA.room || 'Unknown'} is double-booked`,
        details: `${getExamName(examA)} and ${getExamName(examB)}`,
        date: getDate(examA) || getDate(examB),
        time: getTime(examA) || getTime(examB)
      };

    case 'FACULTY_CLASH':
    case 'Faculty Clash':
      return {
        title: 'Faculty Clash',
        description: `Faculty ${examA.faculty_id || examA.faculty || 'Unknown'} has two exam duties at same time`,
        details: `${getExamName(examA)} and ${getExamName(examB)}`,
        date: getDate(examA) || getDate(examB),
        time: getTime(examA) || getTime(examB)
      };

    case 'DEPARTMENT_CLASH':
    case 'Department Clash':
      return {
        title: 'Department Clash',
        description: `Department ${examA.department || 'Unknown'} has two overlapping exams`,
        details: `${getExamName(examA)} and ${getExamName(examB)}`,
        date: getDate(examA) || getDate(examB),
        time: getTime(examA) || getTime(examB)
      };

    case 'ROOM_CAPACITY':
      return {
        title: 'Room Capacity Violation',
        description: `Room ${examA.room_no || examA.room || 'Unknown'} capacity exceeded`,
        details: `${examA.total_students || 'Unknown'} students assigned to room with capacity ${examA.room_capacity || 'Unknown'}`,
        date: getDate(examA),
        time: getTime(examA)
      };

    case 'CONTINUOUS_EXAMS':
      return {
        title: 'Continuous Exams',
        description: `Back-to-back exams detected for student group`,
        details: `${getExamName(examA)} followed by ${getExamName(examB)}`,
        date: getDate(examA) || getDate(examB),
        time: `${getTime(examA)} → ${getTime(examB)}`
      };

    default:
      return {
        title: conflict.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: conflict.message || conflict.description || conflict.details || 'Conflict detected',
        details: conflict.details || `${getExamName(examA)} and ${getExamName(examB)}`,
        date: getDate(examA) || getDate(examB),
        time: getTime(examA) || getTime(examB)
      };
  }
}