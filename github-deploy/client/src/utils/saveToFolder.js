export const saveToFolder = {
  // Save timetable data as CSV
  saveTimetableCSV(timetables, filename = 'timetable') {
    const allExams = Object.entries(timetables).flatMap(([branch, exams]) => 
      exams.map(exam => ({ ...exam, branch }))
    );
    
    if (allExams.length === 0) return;
    
    const headers = ['branch', 'subject', 'date', 'start', 'end', 'room', 'faculty', 'group', 'students'];
    const csvContent = [
      headers.join(','),
      ...allExams.map(exam => [
        exam.branch || '',
        exam.subject || '',
        exam.date || '',
        exam.start || '',
        exam.end || '',
        exam.room || '',
        exam.faculty || '',
        exam.group || '',
        exam.students || ''
      ].join(','))
    ].join('\n');
    
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  },

  // Save conflicts as JSON
  saveConflictsJSON(conflicts, filename = 'conflicts') {
    if (!conflicts || conflicts.length === 0) return;
    
    const jsonContent = JSON.stringify(conflicts, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  },

  // Save AI summary as text
  saveAISummaryTXT(summary, filename = 'ai-summary') {
    if (!summary) return;
    
    this.downloadFile(summary, `${filename}.txt`, 'text/plain');
  },

  // Save resolved timetable as CSV
  saveResolvedCSV(resolvedTimetable, filename = 'resolved-timetable') {
    if (!resolvedTimetable || resolvedTimetable.length === 0) return;
    
    const headers = ['subject', 'date', 'start', 'end', 'room', 'faculty', 'group', 'students'];
    const csvContent = [
      headers.join(','),
      ...resolvedTimetable.map(exam => [
        exam.subject || '',
        exam.date || '',
        exam.start || '',
        exam.end || '',
        exam.room || '',
        exam.faculty || '',
        exam.group || '',
        exam.students || ''
      ].join(','))
    ].join('\n');
    
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  },

  // Generic download function
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};