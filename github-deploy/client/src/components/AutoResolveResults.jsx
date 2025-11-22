export default function AutoResolveResults({ originalTimetable, resolvedTimetable, changes, summary }) {
  if (!resolvedTimetable || resolvedTimetable.length === 0) return null;

  const getChangedExam = (exam) => {
    const original = originalTimetable?.find(orig => 
      (orig.subject || orig.subject_name) === (exam.subject || exam.subject_name)
    );
    if (!original) return false;
    
    return (
      original.start_time !== exam.start_time ||
      original.room_no !== exam.room_no ||
      original.faculty_id !== exam.faculty_id
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-green-900">Auto-Resolved Successfully 🎉</h3>
        </div>
        <p className="text-green-800">{summary}</p>
      </div>

      {/* Changes Made */}
      {changes && changes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Changes Made:</h4>
          <ul className="space-y-2">
            {changes.map((change, idx) => (
              <li key={idx} className="flex items-start gap-2 text-blue-800">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-sm">{change}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resolved Timetable */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">New Conflict-Free Timetable</h3>
          <p className="text-sm text-gray-600 mt-1">{resolvedTimetable.length} exams scheduled</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Room</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Faculty</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resolvedTimetable.map((exam, idx) => {
                const isChanged = getChangedExam(exam);
                return (
                  <tr key={idx} className={`hover:bg-gray-50 ${isChanged ? 'bg-yellow-50' : ''}`}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {exam.subject || exam.subject_name}
                      {isChanged && <span className="ml-2 text-xs text-yellow-600">✓ Updated</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{exam.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {exam.start || exam.start_time} - {exam.end || exam.end_time}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{exam.room || exam.room_no}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{exam.faculty || exam.faculty_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{exam.totalStudents || exam.total_students || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}