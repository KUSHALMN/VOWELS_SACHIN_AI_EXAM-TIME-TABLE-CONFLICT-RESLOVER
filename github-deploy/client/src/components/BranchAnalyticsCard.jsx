export default function BranchAnalyticsCard({ analytics }) {
  const { totalExams, roomsUsed, facultiesUsed, internalClashes } = analytics;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-2">
      <h4 className="text-xs font-medium text-gray-700 mb-2">Branch Analytics</h4>
      <div className="grid grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-gray-500">Total Exams</span>
          <p className="font-medium text-gray-900">{totalExams}</p>
        </div>
        <div>
          <span className="text-gray-500">Rooms Used</span>
          <p className="font-medium text-gray-900">{roomsUsed}</p>
        </div>
        <div>
          <span className="text-gray-500">Faculties</span>
          <p className="font-medium text-gray-900">{facultiesUsed}</p>
        </div>
        <div>
          <span className="text-gray-500">Internal Clashes</span>
          <p className={`font-medium ${internalClashes > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {internalClashes}
          </p>
        </div>
      </div>
    </div>
  );
}
