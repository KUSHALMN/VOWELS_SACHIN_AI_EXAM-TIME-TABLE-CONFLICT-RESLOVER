export default function RunConflictButton({ onRunCheck, onAutoResolve, loading, hasConflicts }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onRunCheck}
        disabled={loading}
        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking...' : 'Run AI Conflict Check'}
      </button>
      {hasConflicts && (
        <button
          onClick={onAutoResolve}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Resolving...' : 'Auto-Resolve Conflicts'}
        </button>
      )}
    </div>
  );
}
