export default function ConflictAlert({ conflicts, onClose }) {
  if (!conflicts) return null;

  const hasConflicts = conflicts.length > 0;

  return (
    <div className={`border rounded-lg p-4 mb-6 ${hasConflicts ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {hasConflicts ? (
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <div>
            <h3 className={`font-semibold ${hasConflicts ? 'text-red-900' : 'text-green-900'}`}>
              {hasConflicts ? 'Conflicts Detected!' : 'Timetable Verified Successfully!'}
            </h3>
            <p className={`text-sm mt-1 ${hasConflicts ? 'text-red-700' : 'text-green-700'}`}>
              {hasConflicts 
                ? `${conflicts.length} conflict(s) found. Please review and correct entries.`
                : 'No conflicts detected. Your timetable is ready.'}
            </p>
            {hasConflicts && (
              <div className="mt-3 space-y-2">
                {conflicts.slice(0, 5).map((conflict, idx) => (
                  <div key={idx} className="text-sm text-red-800 bg-white bg-opacity-50 p-2 rounded">
                    <span className="font-medium">{conflict.type}:</span> {conflict.details}
                  </div>
                ))}
                {conflicts.length > 5 && (
                  <p className="text-sm text-red-700">+ {conflicts.length - 5} more conflicts</p>
                )}
              </div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
