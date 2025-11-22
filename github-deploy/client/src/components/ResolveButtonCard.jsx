export default function ResolveButtonCard({ onResolve, disabled }) {
  return (
    <div className="bg-white border border-gray-200 p-6 text-center">
      <button
        onClick={onResolve}
        disabled={disabled}
        className="bg-blue-600 text-white px-8 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        Auto-Resolve Conflicts
      </button>
    </div>
  );
}
