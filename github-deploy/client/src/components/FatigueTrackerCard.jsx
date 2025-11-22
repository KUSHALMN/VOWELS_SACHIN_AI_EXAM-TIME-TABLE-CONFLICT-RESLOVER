export default function FatigueTrackerCard({ fatigueData }) {
  if (!fatigueData || fatigueData.length === 0) return null;

  const getLevelColor = (level) => {
    if (level === 'High') return 'text-red-600';
    if (level === 'Medium') return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-base text-gray-900 mb-4">Student Fatigue Tracker</h2>
      <div className="space-y-3">
        {fatigueData.map((item, idx) => (
          <div key={idx} className="border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Group: {item.group}</p>
                <p className={`text-sm font-medium mt-1 ${getLevelColor(item.level)}`}>
                  Fatigue: {item.level.toUpperCase()} ({item.fatigue_score})
                </p>
              </div>
            </div>
            {item.reasons.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Reasons:</p>
                {item.reasons.map((reason, i) => (
                  <p key={i} className="text-xs text-gray-700">• {reason}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
