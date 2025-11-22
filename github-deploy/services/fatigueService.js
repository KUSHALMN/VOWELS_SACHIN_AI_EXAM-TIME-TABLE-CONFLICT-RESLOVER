function parseTime(date, time) {
  const [hours, minutes] = time.split(':');
  const d = new Date(date);
  d.setHours(parseInt(hours), parseInt(minutes || 0), 0);
  return d;
}

function calculateGroupFatigue(timetable, studentGroup) {
  const exams = timetable
    .filter(e => e.student_group === studentGroup)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.start_time.localeCompare(b.start_time);
    });

  let fatigue = 0;
  const reasons = [];

  for (let i = 0; i < exams.length - 1; i++) {
    const end1 = parseTime(exams[i].date, exams[i].end_time);
    const start2 = parseTime(exams[i + 1].date, exams[i + 1].start_time);
    const gap = (start2 - end1) / (1000 * 60 * 60);
    
    if (exams[i].date === exams[i + 1].date && gap < 2) {
      fatigue += 10;
      reasons.push(`Back-to-back exams on ${exams[i].date}`);
    }
  }

  for (const exam of exams) {
    const start = parseTime(exam.date, exam.start_time);
    const end = parseTime(exam.date, exam.end_time);
    const duration = (end - start) / (1000 * 60 * 60);
    if (duration > 3) {
      fatigue += 5;
      reasons.push(`Long exam: ${exam.subject_name} (${duration}h)`);
    }
  }

  let level = 'Low';
  if (fatigue >= 21) level = 'High';
  else if (fatigue >= 11) level = 'Medium';

  return {
    group: studentGroup,
    fatigue_score: fatigue,
    level,
    reasons: reasons.slice(0, 2)
  };
}

export function generateFatigueReport(timetable) {
  const studentGroups = [...new Set(timetable.map(e => e.student_group))];
  
  const report = studentGroups.map(group => calculateGroupFatigue(timetable, group));
  
  report.sort((a, b) => b.fatigue_score - a.fatigue_score);
  
  return report;
}
