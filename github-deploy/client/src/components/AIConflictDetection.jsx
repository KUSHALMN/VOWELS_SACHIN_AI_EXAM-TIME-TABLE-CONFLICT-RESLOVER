import { useState } from 'react';
import ConflictCard from './ConflictCard';
import { demoScenarios } from '../data/demoData';

const API_URL = 'http://localhost:3001';

export default function AIConflictDetection({ timetable }) {
  const [conflicts, setConflicts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleRunCheck = async (demoData = null) => {
    const dataToCheck = demoData || window.demoTimetable || timetable;
    
    if (dataToCheck.length === 0) {
      alert('Please add at least one exam to the timetable');
      return;
    }

    // Show popup animation
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);

    setLoading(true);
    try {
      const csvContent = convertToCSV(dataToCheck);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'timetable.csv');

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.success) {
        const conflictRes = await fetch(`${API_URL}/detect-conflicts`, {
          method: 'POST',
        });
        const conflictData = await conflictRes.json();
        setConflicts(conflictData.conflicts);
        setChecked(true);
      }
    } catch (error) {
      alert('Error checking conflicts: ' + error.message);
    }
    setLoading(false);
  };

  const convertToCSV = (data) => {
    const headers = ['exam_id', 'subject_name', 'department', 'date', 'start_time', 'end_time', 'room_no', 'room_capacity', 'faculty_id', 'student_group', 'total_students'];
    const rows = data.map(exam => headers.map(h => exam[h]).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const hasConflicts = conflicts && conflicts.length > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Conflict Detection</h1>
      
      {/* Demo Data Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-lg font-semibold text-purple-900">
            Quick Test Scenarios
          </h3>
        </div>
        <p className="text-purple-700 text-sm mb-4">
          Select a test scenario to load sample timetable data. This will let the system generate conflicts and show how the analyzer performs. <span className="bg-yellow-200 text-purple-900 px-2 py-1 rounded font-semibold">Click me to test</span> - <span className="bg-green-200 text-green-900 px-2 py-1 rounded font-bold animate-pulse">Click a scenario to continue.</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {demoScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => {
                // Convert CSV to timetable format
                const lines = scenario.data.split('\n');
                const demoTimetable = [];
                
                for (let i = 1; i < lines.length; i++) {
                  const values = lines[i].split(',');
                  demoTimetable.push({
                    exam_id: `E${Date.now()}_${i}`,
                    subject_name: values[0],
                    department: values[1],
                    date: values[2],
                    start_time: values[3],
                    end_time: values[4],
                    room_no: values[5],
                    faculty_id: values[6],
                    student_group: values[7] || `Group${i}`,
                    room_capacity: 50,
                    total_students: 40
                  });
                }
                
                // Set the demo timetable and run check
                window.demoTimetable = demoTimetable;
                window.demoDataLoaded = true;
                handleRunCheck(demoTimetable);
              }}
              className="bg-white border border-purple-200 rounded-lg p-3 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="font-medium text-purple-900 text-sm mb-1">
                {scenario.name}
              </div>
              <div className="text-xs text-purple-600 mb-2">
                {scenario.description.includes('CLICK ME TO GET DATA') ? (
                  <>
                    {scenario.description.split(' - CLICK ME TO GET DATA')[0]}
                    <span className="text-black font-bold"> - CLICK ME TO GET DATA</span>
                  </>
                ) : (
                  scenario.description
                )}
              </div>
              <div className="text-xs text-purple-500">
                Expected: {scenario.expectedConflicts} conflicts
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <p className="text-gray-700 mb-4">
          Run AI-powered conflict detection to identify scheduling issues in your timetable.
        </p>
        <button
          onClick={() => handleRunCheck()}
          disabled={loading || (timetable.length === 0 && !window.demoDataLoaded)}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Run AI Conflict Check'}
        </button>
        
        {timetable.length === 0 && !window.demoDataLoaded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-yellow-800 text-sm">
              💡 Load demo data above or create timetable entries to enable conflict detection.
            </p>
          </div>
        )}
      </div>

      {checked && (
        <div className={`border rounded-lg p-6 ${hasConflicts ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
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
            <div className="flex-1">
              <h3 className={`font-semibold text-lg mb-2 ${hasConflicts ? 'text-red-900' : 'text-green-900'}`}>
                {hasConflicts ? 'Conflicts Detected!' : 'Timetable Verified Successfully!'}
              </h3>
              <p className={`text-sm mb-4 ${hasConflicts ? 'text-red-700' : 'text-green-700'}`}>
                {hasConflicts 
                  ? `${conflicts.length} conflict(s) found. Please review and correct entries.`
                  : 'No conflicts detected. Your timetable is ready.'}
              </p>
              
              {hasConflicts && (
                <div className="space-y-3">
                  {conflicts.map((conflict, idx) => (
                    <ConflictCard key={idx} conflict={conflict} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Eye-Catching Popup Animation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            {/* Animated Background Circles */}
            <div className="absolute -inset-4 bg-blue-500 rounded-full animate-spin opacity-75 blur-xl"></div>
            <div className="absolute -inset-2 bg-purple-400 rounded-full animate-ping opacity-50"></div>
            
            {/* Main Popup Card */}
            <div className="relative bg-white rounded-2xl p-8 max-w-lg mx-4 transform animate-bounce shadow-2xl border-4 border-blue-500">
              <div className="text-center">
                {/* Animated Icon Container */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-1 bg-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                
                {/* Animated Text */}
                <h3 className="text-2xl font-bold text-blue-600 mb-3 animate-pulse">
                  🤖 AI Detection Active!
                </h3>
                <p className="text-gray-700 font-medium animate-pulse">
                  ⚡ Scanning for conflicts...
                </p>
                
                {/* Loading Dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
