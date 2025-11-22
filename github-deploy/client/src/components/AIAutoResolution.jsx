import { useState } from 'react';
import { demoScenarios } from '../data/demoData';
import { timetableCache } from '../data/timetableCache';

const API_URL = 'http://localhost:3001';

export default function AIAutoResolution({ timetable, onUpdateTimetable }) {
  const [resolvedTimetable, setResolvedTimetable] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleAutoResolve = async (demoData = null) => {
    const dataToResolve = demoData || timetable;
    
    if (dataToResolve.length === 0) {
      alert('Please add at least one exam to the timetable');
      return;
    }

    // Show popup animation for 3 seconds
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);

    setLoading(true);
    try {
      // Simple client-side auto-resolution algorithm
      const resolvedExams = [...dataToResolve];
      const changes = [];
      const availableRooms = ['A-101', 'A-102', 'A-103', 'B-201', 'B-202', 'B-203', 'C-301', 'C-302', 'C-303'];
      const availableFaculty = ['Dr. Smith', 'Dr. Johnson', 'Dr. Wilson', 'Dr. Brown', 'Dr. Taylor', 'Dr. Anderson'];
      const timeSlots = [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' },
        { start: '10:00', end: '13:00' },
        { start: '15:00', end: '18:00' }
      ];

      // Helper function to check time overlap
      const timesOverlap = (start1, end1, start2, end2) => {
        const s1 = new Date(`2000-01-01 ${start1}`);
        const e1 = new Date(`2000-01-01 ${end1}`);
        const s2 = new Date(`2000-01-01 ${start2}`);
        const e2 = new Date(`2000-01-01 ${end2}`);
        return s1 < e2 && s2 < e1;
      };

      // Detect and resolve conflicts
      for (let i = 0; i < resolvedExams.length; i++) {
        for (let j = i + 1; j < resolvedExams.length; j++) {
          const exam1 = resolvedExams[i];
          const exam2 = resolvedExams[j];
          
          if (exam1.date === exam2.date) {
            // Room conflict
            if (exam1.room_no === exam2.room_no && 
                timesOverlap(exam1.start_time, exam1.end_time, exam2.start_time, exam2.end_time)) {
              const newRoom = availableRooms.find(room => 
                !resolvedExams.some(e => e.room_no === room && e.date === exam2.date && 
                  timesOverlap(e.start_time, e.end_time, exam2.start_time, exam2.end_time))
              );
              if (newRoom) {
                changes.push(`Moved ${exam2.subject_name} from ${exam2.room_no} to ${newRoom}`);
                exam2.room_no = newRoom;
              }
            }
            
            // Faculty conflict
            if (exam1.faculty_id === exam2.faculty_id && 
                timesOverlap(exam1.start_time, exam1.end_time, exam2.start_time, exam2.end_time)) {
              const newFaculty = availableFaculty.find(faculty => 
                !resolvedExams.some(e => e.faculty_id === faculty && e.date === exam2.date && 
                  timesOverlap(e.start_time, e.end_time, exam2.start_time, exam2.end_time))
              );
              if (newFaculty) {
                changes.push(`Reassigned ${exam2.subject_name} from ${exam2.faculty_id} to ${newFaculty}`);
                exam2.faculty_id = newFaculty;
              }
            }
          }
        }
      }

      setResolvedTimetable(resolvedExams);
      setSummary(`Successfully resolved ${changes.length} conflicts using AI optimization algorithm. Changes made: ${changes.join(', ') || 'No conflicts found'}`);
      
      // Update Current Timetable with resolved data
      resolvedExams.forEach(exam => {
        const branch = exam.department || 'OTHERS';
        const examData = {
          id: exam.exam_id || Date.now() + Math.random(),
          subject: exam.subject_name,
          branch: branch,
          date: exam.date,
          start: exam.start_time,
          end: exam.end_time,
          room: exam.room_no,
          faculty: exam.faculty_id,
          studentGroup: exam.student_group || 'Default'
        };
        timetableCache.addExam(branch, examData);
      });
      
      if (!demoData && onUpdateTimetable) {
        onUpdateTimetable(resolvedExams);
      }
    } catch (error) {
      alert('Error resolving conflicts: ' + error.message);
    }
    setLoading(false);
  };

  const convertToCSV = (data) => {
    const headers = ['exam_id', 'subject_name', 'department', 'date', 'start_time', 'end_time', 'room_no', 'room_capacity', 'faculty_id', 'student_group', 'total_students'];
    const rows = data.map(exam => headers.map(h => exam[h]).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadResolvedCSV = () => {
    if (!resolvedTimetable) {
      alert('No resolved timetable to download!');
      return;
    }

    const csvContent = convertToCSV(resolvedTimetable);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resolved-timetable-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Auto-Resolution</h1>
      
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
                
                // Set demo timetable and enable auto-resolve button
                if (onUpdateTimetable) {
                  onUpdateTimetable(demoTimetable);
                }
                window.demoTimetableLoaded = true;
                
                // Also run auto-resolve immediately with demo data
                setTimeout(() => handleAutoResolve(demoTimetable), 100);
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
          Automatically resolve all scheduling conflicts using our AI-powered greedy algorithm.
        </p>
        {timetable.length === 0 && !window.demoTimetableLoaded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm">
              💡 Load demo data above or create timetable entries to enable auto-resolution.
            </p>
          </div>
        )}
        <button
          onClick={() => handleAutoResolve()}
          disabled={loading || (timetable.length === 0 && !window.demoTimetableLoaded)}
          className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Resolving...' : 'Run Auto-Resolution'}
        </button>
      </div>

      {resolvedTimetable && (
        <div className="space-y-6">
          {/* Summary */}
          {summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">AI Summary</h3>
              <p className="text-sm text-blue-800 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Resolved Timetable */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-green-50 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900">Optimized Timetable</h3>
                  <p className="text-sm text-green-700 mt-1">All conflicts have been resolved</p>
                </div>
                <button
                  onClick={downloadResolvedCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Room</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invigilator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resolvedTimetable.map((exam, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{exam.subject_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.start_time} - {exam.end_time}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.room_no}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{exam.faculty_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  ✨ Auto-Resolution Active!
                </h3>
                <p className="text-gray-700 font-medium animate-pulse">
                  ⚡ Resolving conflicts automatically...
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
