import { useState } from 'react';
import BranchAnalyticsCard from './BranchAnalyticsCard';
import { timetableCache } from '../data/timetableCache';

export default function BranchSection({ branch, exams, analytics }) {
  const [isOpen, setIsOpen] = useState(true);
  const [detailedView, setDetailedView] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(branch);
  
  const branches = ['CSE', 'ISE', 'AIML', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHERS'];
  const currentBranchExams = timetableCache.getSortedBranch(selectedBranch);
  const currentAnalytics = timetableCache.getBranchAnalytics(selectedBranch);

  if (exams.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">{isOpen ? '▼' : '▶'}</span>
            <h3 className="text-lg font-semibold text-gray-900">{branch}</h3>
            <span className="text-sm text-gray-500">({exams.length} Subjects)</span>
          </div>
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDetailedView(true);
              }}
              data-view-details
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </button>

      {isOpen && !detailedView && (
        <div className="px-4 pb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Subject</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Time</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Room</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Faculty</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Student Group</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {exams.map((exam, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">{exam.subject}</td>
                    <td className="px-3 py-2 text-gray-700">{exam.date}</td>
                    <td className="px-3 py-2 text-gray-700">{exam.start} - {exam.end}</td>
                    <td className="px-3 py-2 text-gray-700">{exam.room}</td>
                    <td className="px-3 py-2 text-gray-700">{exam.faculty}</td>
                    <td className="px-3 py-2 text-gray-700">{exam.studentGroup}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${exam.subject} exam?`)) {
                            timetableCache.deleteExam(branch, exam.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                        title="Delete exam"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <BranchAnalyticsCard analytics={analytics} />
        </div>
      )}

      {detailedView && (
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setDetailedView(false)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Branches
              </button>
              <h2 className="text-xl font-bold text-gray-900">{selectedBranch} Detailed Timetable</h2>
            </div>
            
            {/* Branch Navigation */}
            <div className="flex flex-wrap gap-2">
              {branches.map(branchName => {
                const branchExams = timetableCache.getSortedBranch(branchName);
                if (branchExams.length === 0) return null;
                
                return (
                  <button
                    key={branchName}
                    onClick={() => setSelectedBranch(branchName)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedBranch === branchName
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {branchName} ({branchExams.length})
                  </button>
                );
              })}
            </div>
          </div>
          
          {currentBranchExams.length > 0 ? (
            <>
              <div className="grid gap-4">
                {currentBranchExams.map((exam, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{exam.subject}</h3>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${exam.subject} exam?`)) {
                            timetableCache.deleteExam(selectedBranch, exam.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete exam"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Date:</span>
                        <p className="text-gray-900">{exam.date}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Time:</span>
                        <p className="text-gray-900">{exam.start} - {exam.end}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Room:</span>
                        <p className="text-gray-900">{exam.room}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Faculty:</span>
                        <p className="text-gray-900">{exam.faculty}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Student Group:</span>
                        <p className="text-gray-900">{exam.studentGroup}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <BranchAnalyticsCard analytics={currentAnalytics} />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No exams found for {selectedBranch} branch.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
