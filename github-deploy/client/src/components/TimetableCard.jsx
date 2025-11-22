export default function TimetableCard({ timetable }) {
  if (!timetable || timetable.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-base text-gray-900 mb-4">Optimized Timetable</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">Subject</th>
              <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">Date</th>
              <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">Time</th>
              <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">Room</th>
              <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">Faculty</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((exam, idx) => (
              <tr key={idx}>
                <td className="border border-gray-200 px-3 py-2 text-gray-900">{exam.subject_name}</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">{exam.date}</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">{exam.start_time} - {exam.end_time}</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">{exam.room_no}</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-700">{exam.faculty_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
