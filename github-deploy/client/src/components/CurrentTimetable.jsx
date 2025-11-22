import { useState, useEffect } from 'react';
import { timetableCache } from '../data/timetableCache';
import BranchSection from './BranchSection';
import AIConflictTools from './AIConflictTools';
import { demoScenarios } from '../data/demoData';

export default function CurrentTimetable() {
  const [timetables, setTimetables] = useState({});
  const [showBranchNav, setShowBranchNav] = useState(false);

  useEffect(() => {
    const unsub = timetableCache.subscribe(setTimetables);
    return unsub;
  }, []);

  const branches = ['CSE', 'ISE', 'AIML', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHERS'];
  const allExams = timetableCache.getAllExams();
  const totalExams = allExams.length;

  const handleUpdateResolved = (resolvedExams) => {
    const newTimetables = { ...timetables };
    resolvedExams.forEach(exam => {
      const branch = exam.branch;
      if (newTimetables[branch]) {
        const idx = newTimetables[branch].findIndex(e => e.id === exam.id);
        if (idx !== -1) {
          newTimetables[branch][idx] = exam;
        }
      }
    });
    timetableCache.setTimetables(newTimetables);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Current Timetable</h1>
          <p className="text-sm text-gray-500 mt-1">Total: {totalExams} exams across all branches</p>
        </div>
        <div className="flex gap-3">
          {totalExams > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBranchNav(!showBranchNav)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Browse Branches
              </button>
              
              {showBranchNav && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-48">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Jump to Branch:</h3>
                  <div className="space-y-1">
                    {branches.map(branch => {
                      const branchExams = timetableCache.getSortedBranch(branch);
                      if (branchExams.length === 0) return null;
                      
                      return (
                        <button
                          key={branch}
                          onClick={() => {
                            setShowBranchNav(false);
                            // Scroll to branch section
                            const element = document.getElementById(`branch-${branch}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              // Auto-open detailed view
                              setTimeout(() => {
                                const viewButton = element.querySelector('[data-view-details]');
                                if (viewButton) viewButton.click();
                              }, 500);
                            }
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center justify-between"
                        >
                          <span>{branch}</span>
                          <span className="text-xs text-gray-500">{branchExams.length} exams</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {totalExams > 0 && (
            <button
              onClick={() => {
                if (confirm('Reset all timetables? This cannot be undone.')) {
                  timetableCache.reset();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Reset Timetables
            </button>
          )}
        </div>
      </div>

      {totalExams === 0 ? (
        <>
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
                    const lines = scenario.data.split('\n');
                    
                    for (let i = 1; i < lines.length; i++) {
                      const values = lines[i].split(',');
                      const exam = {
                        id: Date.now() + i + Math.random(),
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
          
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">No exams added yet. Create your first timetable entry or load test data above.</p>
          </div>
        </>
      ) : (
        <>
          <AIConflictTools allExams={allExams} onUpdate={handleUpdateResolved} />
          
          {branches.map(branch => {
            const sortedExams = timetableCache.getSortedBranch(branch);
            const analytics = timetableCache.getBranchAnalytics(branch);
            return (
              <div id={`branch-${branch}`}>
                <BranchSection
                  key={branch}
                  branch={branch}
                  exams={sortedExams}
                  analytics={analytics}
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
