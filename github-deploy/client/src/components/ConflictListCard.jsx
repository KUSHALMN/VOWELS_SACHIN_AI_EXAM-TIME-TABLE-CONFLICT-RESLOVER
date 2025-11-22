import ConflictCard from './ConflictCard';

export default function ConflictListCard({ conflicts }) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium">✓ No conflicts detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-gray-900 font-bold text-lg">⚠️ Conflicts Detected ({conflicts.length})</h3>
      <div className="space-y-3">
        {conflicts.map((conflict, idx) => (
          <ConflictCard key={idx} conflict={conflict} />
        ))}
      </div>
    </div>
  );
}
