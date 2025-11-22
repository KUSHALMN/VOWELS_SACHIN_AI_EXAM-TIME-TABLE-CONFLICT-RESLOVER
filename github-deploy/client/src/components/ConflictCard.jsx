import { formatConflict } from '../utils/conflictFormatter';

export default function ConflictCard({ conflict }) {
  const formatted = formatConflict(conflict);
  
  const getIcon = (title) => {
    if (title.includes('Student')) return '👥';
    if (title.includes('Room')) return '🏢';
    if (title.includes('Faculty')) return '👨‍🏫';
    if (title.includes('Department')) return '🏛️';
    if (title.includes('Capacity')) return '⚠️';
    if (title.includes('Continuous')) return '⏰';
    return '❗';
  };

  const getColorClass = (title) => {
    if (title.includes('Student')) return 'border-yellow-200 bg-yellow-50';
    if (title.includes('Room')) return 'border-orange-200 bg-orange-50';
    if (title.includes('Faculty')) return 'border-red-200 bg-red-50';
    if (title.includes('Department')) return 'border-purple-200 bg-purple-50';
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <div className={`border rounded-lg p-4 ${getColorClass(formatted.title)}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{getIcon(formatted.title)}</span>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">{formatted.title}</h4>
          <p className="text-gray-700 text-sm mb-2">{formatted.description}</p>
          {formatted.details && (
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-medium">Subjects:</span> {formatted.details}
            </p>
          )}
          <div className="flex gap-4 text-xs text-gray-500">
            {formatted.date && (
              <span><span className="font-medium">Date:</span> {formatted.date}</span>
            )}
            {formatted.time && (
              <span><span className="font-medium">Time:</span> {formatted.time}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}