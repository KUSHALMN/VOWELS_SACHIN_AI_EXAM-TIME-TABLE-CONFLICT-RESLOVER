export default function ImpactSummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-base text-gray-900 mb-4">Impact Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Total Conflicts Detected</p>
          <p className="text-2xl text-gray-900 mt-1">{summary.total_conflicts_detected}</p>
        </div>
        <div className="border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Conflicts Resolved</p>
          <p className="text-2xl text-green-600 mt-1">{summary.total_conflicts_resolved}</p>
        </div>
        <div className="border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Remaining Conflicts</p>
          <p className="text-2xl text-red-600 mt-1">{summary.remaining_conflicts}</p>
        </div>
        <div className="border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Room Utilization</p>
          <p className="text-2xl text-gray-900 mt-1">{summary.room_utilization_percentage}%</p>
        </div>
        <div className="border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Faculty Load Balance</p>
          <p className="text-2xl text-gray-900 mt-1">{summary.faculty_load_balance_score}/100</p>
        </div>
        <div className="border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Fatigue Improvement</p>
          <p className="text-2xl text-blue-600 mt-1">{summary.improvement_percentage}%</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <span className="text-gray-600">Student Fatigue Before: {summary.student_fatigue_before}</span>
        <span className="text-gray-600">After: {summary.student_fatigue_after}</span>
      </div>
    </div>
  );
}
