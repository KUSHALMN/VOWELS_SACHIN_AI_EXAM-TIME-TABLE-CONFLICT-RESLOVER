import { useState } from 'react';
import ConflictListCard from './ConflictListCard';
import AutoResolveResults from './AutoResolveResults';
import { timetableCache } from '../data/timetableCache';

export default function AIConflictTools({ allExams, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [resolvedTimetable, setResolvedTimetable] = useState(null);
  const [resolutionChanges, setResolutionChanges] = useState([]);
  const [error, setError] = useState('');

  const handleDetectConflicts = async () => {
    setLoading(true);
    setError('');
    setConflicts(null);
    setAiSummary('');
    setResolvedTimetable(null);
    setResolutionChanges([]);
    
    try {
      const response = await fetch('http://localhost:3001/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exams: allExams })
      });
      
      if (!response.ok) throw new Error('Detection failed');
      
      const data = await response.json();
      setConflicts(data.conflicts || []);
      setAiSummary(data.summary || '');
      
      // Save to cache
      timetableCache.setConflicts(data.conflicts || []);
    } catch (err) {
      setError('Failed to detect conflicts. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoResolve = async () => {
    setLoading(true);
    setError('');
    setResolvedTimetable(null);
    setResolutionChanges([]);
    
    try {
      const response = await fetch('http://localhost:3001/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exams: allExams })
      });
      
      if (!response.ok) throw new Error('Resolution failed');
      
      const data = await response.json();
      
      if (data.success) {
        setResolvedTimetable(data.resolvedTimetable || []);
        setResolutionChanges(data.changes || []);
        setAiSummary(data.summary || '');
        
        // Save to cache
        timetableCache.setResolvedTimetable(data.resolvedTimetable);
        timetableCache.setResolutionChanges(data.changes);
        timetableCache.setAISummary(data.summary);
        
        if (data.resolvedTimetable && onUpdate) {
          onUpdate(data.resolvedTimetable);
        }
      } else {
        setError(data.error || 'Resolution failed');
      }
    } catch (err) {
      setError('Failed to resolve conflicts. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Conflict Tools</h3>
        <div className="flex gap-3">
          <button
            onClick={handleDetectConflicts}
            disabled={allExams.length === 0 || loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Detecting...' : '🔍 Detect Conflicts'}
          </button>
          
          <button
            onClick={handleAutoResolve}
            disabled={allExams.length === 0 || loading}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Resolving...' : '✨ Auto-Resolve'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {aiSummary && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
          <h4 className="text-gray-900 font-medium text-sm mb-1">AI Summary</h4>
          <p className="text-gray-700 text-sm">{aiSummary}</p>
        </div>
      )}

      {conflicts && <ConflictListCard conflicts={conflicts} />}
      
      {resolvedTimetable && (
        <AutoResolveResults 
          originalTimetable={allExams}
          resolvedTimetable={resolvedTimetable}
          changes={resolutionChanges}
          summary={aiSummary}
        />
      )}
    </div>
  );
}
