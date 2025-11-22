export default function TimetablePreview({ timetable, onRemove }) {
  if (!timetable || timetable.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Timetable</h2>
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No exams added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Timetable ({timetable.length})</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {timetable.map((exam, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{exam.subject_name}</h3>
              <button
                onClick={() => onRemove(idx)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 text-gray-900">{exam.date}</span>
              </div>
              <div>
                <span className="text-gray-500">Time:</span>
                <span className="ml-2 text-gray-900">{exam.start_time} - {exam.end_time}</span>
              </div>
              <div>
                <span className="text-gray-500">Room:</span>
                <span className="ml-2 text-gray-900">{exam.room_no}</span>
              </div>
              <div>
                <span className="text-gray-500">Department:</span>
                <span className="ml-2 text-gray-900">{exam.department}</span>
              </div>
              <div>
                <span className="text-gray-500">Invigilator:</span>
                <span className="ml-2 text-gray-900">{exam.faculty_id}</span>
              </div>
              <div>
                <span className="text-gray-500">Students:</span>
                <span className="ml-2 text-gray-900">{exam.total_students}/{exam.room_capacity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
