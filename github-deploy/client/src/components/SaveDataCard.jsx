import { timetableCache } from '../data/timetableCache';
import { saveToFolder } from '../utils/saveToFolder';

export default function SaveDataCard() {
  const handleSaveAll = () => {
    const timetables = timetableCache.getTimetables();
    const conflicts = timetableCache.getConflicts();
    const aiSummary = timetableCache.getAISummary();
    const resolved = timetableCache.getResolvedTimetable();
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    saveToFolder.saveTimetableCSV(timetables, `timetable-${timestamp}`);
    if (conflicts.length > 0) saveToFolder.saveConflictsJSON(conflicts, `conflicts-${timestamp}`);
    if (aiSummary) saveToFolder.saveAISummaryTXT(aiSummary, `summary-${timestamp}`);
    if (resolved) saveToFolder.saveResolvedCSV(resolved, `resolved-${timestamp}`);
  };

  const handleSaveTimetable = () => {
    const timetables = timetableCache.getTimetables();
    const timestamp = new Date().toISOString().split('T')[0];
    saveToFolder.saveTimetableCSV(timetables, `timetable-${timestamp}`);
  };

  const handleSaveConflicts = () => {
    const conflicts = timetableCache.getConflicts();
    if (conflicts.length === 0) {
      alert('No conflicts to save');
      return;
    }
    const timestamp = new Date().toISOString().split('T')[0];
    saveToFolder.saveConflictsJSON(conflicts, `conflicts-${timestamp}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">💾 Save Data</h3>
      <div className="space-y-3">
        <button
          onClick={handleSaveAll}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save All Data
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSaveTimetable}
            className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
          >
            Save Timetable
          </button>
          <button
            onClick={handleSaveConflicts}
            className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Save Conflicts
          </button>
        </div>
      </div>
    </div>
  );
}