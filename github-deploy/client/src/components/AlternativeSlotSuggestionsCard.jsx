export default function AlternativeSlotSuggestionsCard({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-base text-gray-900 mb-4">Alternative Slot Suggestions</h2>
      <div className="space-y-4">
        {suggestions.map((item, idx) => (
          <div key={idx} className="border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">{item.exam_name}</p>
            <p className="text-xs text-gray-500 mb-3">Original: {item.original_slot}</p>
            <div className="space-y-2">
              {item.suggestions.map((sug, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2 border border-gray-200">
                  <div>
                    <span className="text-sm text-gray-900">{sug.slot}</span>
                    <span className="text-sm text-gray-600 ml-2">Room {sug.room}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600">Score: {sug.score}</span>
                    <p className="text-xs text-gray-500">{sug.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
