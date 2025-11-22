import { useState } from 'react';
import { timetableCache } from '../data/timetableCache';
import { formatConflict } from '../utils/conflictFormatter';
import AutoResolveResults from './AutoResolveResults';
import { demoScenarios } from '../data/demoData';

export default function MultiBranchAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const analyzeConflicts = async () => {
    // Show popup animation for 4 seconds
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);

    setAnalyzing(true);
    setError('');
    setResults(null);
    
    try {
      const combined = timetableCache.getAllExams();
      
      if (combined.length === 0) {
        setShowModal(true);
        setAnalyzing(false);
        return;
      }
      
      const response = await fetch('http://localhost:3001/detect-multibranch-conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exams: combined })
      });
      
      if (!response.ok) {
        throw new Error('Server error');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Analysis failed');
      }
      
      setResults({
        totalExams: combined.length,
        conflicts: data.conflicts || [],
        summary: data.summary || '',
        originalExams: combined
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAutoResolve = async () => {
    if (!results || !results.originalExams) return;
    
    setAnalyzing(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exams: results.originalExams })
      });
      
      if (!response.ok) throw new Error('Resolution failed');
      
      const data = await response.json();
      
      if (data.success) {
        setResults(prev => ({
          ...prev,
          resolvedTimetable: data.resolvedTimetable,
          changes: data.changes,
          resolutionSummary: data.summary
        }));
        
        // Save to cache
        timetableCache.setResolvedTimetable(data.resolvedTimetable);
        timetableCache.setResolutionChanges(data.changes);
      } else {
        setError(data.error || 'Resolution failed');
      }
    } catch (err) {
      setError('Failed to resolve conflicts. Ensure backend is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 animate-slideUp">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Timetables Created Yet</h3>
              <p className="text-sm text-gray-600 mb-6">Please create at least one timetable entry before running the analysis.</p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Multi-Branch Conflict Analyzer</h1>
      
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
                // Parse CSV and add to timetable cache
                const lines = scenario.data.split('\n');
                const headers = lines[0].split(',');
                
                for (let i = 1; i < lines.length; i++) {
                  const values = lines[i].split(',');
                  const exam = {
                    id: Date.now() + i,
                    subject: values[0],
                    branch: values[1],
                    date: values[2],
                    start: values[3],
                    end: values[4],
                    room: values[5],
                    faculty: values[6],
                    studentGroup: values[7] || `Group${i}`
                  };
                  
                  timetableCache.addExam(exam.branch, exam);
                }
                
                // Set flag to indicate demo data is loaded
                window.multiBranchDemoLoaded = true;
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
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <p className="text-gray-700 mb-4">
          Automatically analyze all branch timetables for cross-branch conflicts including faculty clashes, room clashes, and student overlaps.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={analyzeConflicts}
            disabled={analyzing}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {analyzing ? 'Analyzing...' : 'Run Multi-Branch Analysis'}
          </button>
          
          {timetableCache.getAllExams().length === 0 && !window.multiBranchDemoLoaded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <p className="text-yellow-800 text-sm">
                💡 Load demo data above or create timetable entries to enable multi-branch analysis.
              </p>
            </div>
          )}
          
          {results && results.conflicts.length > 0 && (
            <button
              onClick={handleAutoResolve}
              disabled={analyzing}
              className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {analyzing ? 'Resolving...' : '✨ Auto-Resolve Conflicts'}
            </button>
          )}
        </div>
      </div>

      {results && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{results.totalExams}</div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-600">{results.conflicts.length}</div>
              <div className="text-sm text-gray-600">Total Conflicts</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">
                {results.totalExams - results.conflicts.length}
              </div>
              <div className="text-sm text-gray-600">Conflict-Free</div>
            </div>
          </div>

          {results.summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Summary</h2>
              <p className="text-gray-700 whitespace-pre-line">{results.summary}</p>
            </div>
          )}

          {results.conflicts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Detected Conflicts</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Branch A</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Branch B</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.conflicts.map((conflict, idx) => {
                      const formatted = formatConflict(conflict);
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              formatted.title.includes('Faculty') ? 'bg-red-100 text-red-700' :
                              formatted.title.includes('Room') ? 'bg-orange-100 text-orange-700' :
                              formatted.title.includes('Student') ? 'bg-yellow-100 text-yellow-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {formatted.title}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{conflict.branchA || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{conflict.branchB || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="space-y-1">
                              <div>{formatted.description}</div>
                              {formatted.details && <div className="text-xs text-gray-500">{formatted.details}</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              {formatted.date && <div>{formatted.date}</div>}
                              {formatted.time && <div className="text-xs">{formatted.time}</div>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {results.conflicts.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-lg font-semibold">✓ No Conflicts Detected</div>
              <p className="text-gray-600 mt-2">All branch timetables are conflict-free!</p>
            </div>
          )}
          
          {results.resolvedTimetable && (
            <AutoResolveResults 
              originalTimetable={results.originalExams}
              resolvedTimetable={results.resolvedTimetable}
              changes={results.changes}
              summary={results.resolutionSummary}
            />
          )}
        </>
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
                  🔍 Multi-Branch Analysis Started!
                </h3>
                <p className="text-gray-700 font-medium animate-pulse">
                  ⚡ Analyzing cross-branch conflicts...
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
