import { useState } from 'react';

export default function ResolvedTimetablePreview({ resolvedTimetable, originalExams }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!resolvedTimetable || resolvedTimetable.length === 0) {
    return null;
  }

  const isChanged = (exam) => {
    const original = originalExams.find(e => e.id === exam.id);
    if (!original) return false;
    return original.date !== exam.date || original.start !== exam.start || 
           original.end !== exam.end || original.room !== exam.room;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-blue-900 font-bold">✓ Resolved Timetable ({resolvedTimetable.length} exams)</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-3 py-2 text-left">Subject</th>
                <th className="px-3 py-2 text-left">Branch</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Room</th>
                <th className="px-3 py-2 text-left">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {resolvedTimetable.map((exam, idx) => (
                <tr 
                  key={idx} 
                  className={`border-t ${isChanged(exam) ? 'bg-yellow-100' : 'bg-white'}`}
                >
                  <td className="px-3 py-2">{exam.subject}</td>
                  <td className="px-3 py-2">{exam.branch}</td>
                  <td className="px-3 py-2">{exam.date}</td>
                  <td className="px-3 py-2">{exam.start} - {exam.end}</td>
                  <td className="px-3 py-2">{exam.room}</td>
                  <td className="px-3 py-2">{exam.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-blue-700 mt-2">Yellow rows = modified entries</p>
        </div>
      )}
    </div>
  );
}
