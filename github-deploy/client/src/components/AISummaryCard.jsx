export default function AISummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-base text-gray-900 mb-4">AI Summary</h2>
      <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
    </div>
  );
}
