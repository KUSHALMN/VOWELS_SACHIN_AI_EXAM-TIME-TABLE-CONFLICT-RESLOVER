import { useState } from 'react';
import { demoScenarios } from '../data/demoData';

const API_URL = 'http://localhost:3001';

export default function UploadTimetable({ onUpdateTimetable }) {
  const [selectedTimetable, setSelectedTimetable] = useState('timetable1');
  const [timetables, setTimetables] = useState({
    timetable1: { file: null, data: null, conflicts: null, resolved: null, summary: null },
    timetable2: { file: null, data: null, conflicts: null, resolved: null, summary: null },
    timetable3: { file: null, data: null, conflicts: null, resolved: null, summary: null },
    timetable4: { file: null, data: null, conflicts: null, resolved: null, summary: null }
  });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const currentTimetable = timetables[selectedTimetable];

  const downloadPDF = async (endpoint, filename) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}${endpoint}`);

      // Check if response is OK
      if (!response.ok) {
        // Only try to parse JSON if it's an error response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to download PDF');
        }
        throw new Error(`Server error: ${response.status}`);
      }

      // Get the blob (PDF binary data)
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Error downloading PDF: ' + error.message);
      console.error('PDF download error:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTimetables(prev => ({
      ...prev,
      [selectedTimetable]: {
        ...prev[selectedTimetable],
        file,
        data: null,
        conflicts: null,
        resolved: null,
        summary: null
      }
    }));
  };

  const [conflicts, setConflicts] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleResolveConflicts = async () => {
    const uploadedFiles = Object.values(timetables).filter(t => t.file);
    if (uploadedFiles.length === 0) {
      alert('Please select at least one CSV file');
      return;
    }

    // Show popup animation for 4 seconds
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);

    setLoading(true);
    setShowResults(false);
    
    try {
      // Process all uploaded files
      const allExams = [];
      
      for (const [key, timetable] of Object.entries(timetables)) {
        if (timetable.file) {
          // Parse CSV file content
          const text = await timetable.file.text();
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) continue; // Skip if no data
          
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            
            if (values.length < 6) continue; // Skip incomplete rows
            
            const exam = {
              timetableSource: key,
              subject_name: values[headers.indexOf('subject_name')] || values[1] || '',
              department: values[headers.indexOf('department')] || values[2] || '',
              date: values[headers.indexOf('date')] || values[3] || '',
              start_time: values[headers.indexOf('start_time')] || values[4] || '',
              end_time: values[headers.indexOf('end_time')] || values[5] || '',
              room_no: values[headers.indexOf('room_no')] || values[6] || '',
              faculty_id: values[headers.indexOf('faculty_id')] || values[8] || ''
            };
            
            // Only add if required fields are present
            if (exam.date && exam.start_time && exam.end_time) {
              allExams.push(exam);
            }
          }
        }
      }

      // Helper function to check time overlap
      const timesOverlap = (start1, end1, start2, end2) => {
        const s1 = new Date(`2000-01-01 ${start1}`);
        const e1 = new Date(`2000-01-01 ${end1}`);
        const s2 = new Date(`2000-01-01 ${start2}`);
        const e2 = new Date(`2000-01-01 ${end2}`);
        return s1 < e2 && s2 < e1;
      };

      // Detect conflicts between all timetables
      const detectedConflicts = [];
      
      for (let i = 0; i < allExams.length; i++) {
        for (let j = i + 1; j < allExams.length; j++) {
          const exam1 = allExams[i];
          const exam2 = allExams[j];
          
          // Skip if same timetable (internal conflicts not needed here)
          if (exam1.timetableSource === exam2.timetableSource) continue;
          
          // Check if same date
          if (exam1.date === exam2.date) {
            // Room conflict - same room with overlapping times
            if (exam1.room_no && exam2.room_no && exam1.room_no === exam2.room_no && 
                timesOverlap(exam1.start_time, exam1.end_time, exam2.start_time, exam2.end_time)) {
              detectedConflicts.push({
                type: 'Room Conflict',
                description: `Room ${exam1.room_no} is double-booked`,
                timetable1: exam1.timetableSource,
                timetable2: exam2.timetableSource,
                exam1: `${exam1.subject_name} (${exam1.department})`,
                exam2: `${exam2.subject_name} (${exam2.department})`,
                date: exam1.date,
                time: `${exam1.start_time}-${exam1.end_time} vs ${exam2.start_time}-${exam2.end_time}`
              });
            }
            
            // Faculty conflict - same faculty with overlapping times
            if (exam1.faculty_id && exam2.faculty_id && exam1.faculty_id === exam2.faculty_id && 
                timesOverlap(exam1.start_time, exam1.end_time, exam2.start_time, exam2.end_time)) {
              detectedConflicts.push({
                type: 'Faculty Conflict',
                description: `Faculty ${exam1.faculty_id} assigned to multiple exams`,
                timetable1: exam1.timetableSource,
                timetable2: exam2.timetableSource,
                exam1: `${exam1.subject_name} (${exam1.department})`,
                exam2: `${exam2.subject_name} (${exam2.department})`,
                date: exam1.date,
                time: `${exam1.start_time}-${exam1.end_time} vs ${exam2.start_time}-${exam2.end_time}`
              });
            }
          }
        }
      }
      
      setConflicts(detectedConflicts);
      setShowResults(true);
      
    } catch (error) {
      alert('Error processing files: ' + error.message);
    }
    setLoading(false);
  };

  const [resolvedTimetable, setResolvedTimetable] = useState(null);
  const [resolutionChanges, setResolutionChanges] = useState([]);

  const downloadResolvedCSV = () => {
    if (!resolvedTimetable) {
      alert('No resolved timetable to download!');
      return;
    }

    // Create CSV content
    const headers = ['subject_name', 'department', 'date', 'start_time', 'end_time', 'room_no', 'faculty_id', 'student_group', 'timetable_source'];
    const csvContent = [
      headers.join(','),
      ...resolvedTimetable.map(exam => [
        exam.subject_name,
        exam.department,
        exam.date,
        exam.start_time,
        exam.end_time,
        exam.room_no,
        exam.faculty_id,
        exam.student_group || '',
        exam.timetableSource
      ].join(','))
    ].join('\n');

    // Create and download file
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

  const handleAutoResolve = async () => {
    if (conflicts.length === 0) {
      alert('No conflicts to resolve!');
      return;
    }

    setLoading(true);
    
    try {
      // Collect all exams from uploaded files
      const allExams = [];
      
      for (const [key, timetable] of Object.entries(timetables)) {
        if (timetable.file) {
          const text = await timetable.file.text();
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length < 6) continue;
            
            const exam = {
              id: `${key}_${i}`,
              timetableSource: key,
              subject_name: values[headers.indexOf('subject_name')] || values[1] || '',
              department: values[headers.indexOf('department')] || values[2] || '',
              date: values[headers.indexOf('date')] || values[3] || '',
              start_time: values[headers.indexOf('start_time')] || values[4] || '',
              end_time: values[headers.indexOf('end_time')] || values[5] || '',
              room_no: values[headers.indexOf('room_no')] || values[6] || '',
              faculty_id: values[headers.indexOf('faculty_id')] || values[8] || '',
              student_group: values[headers.indexOf('student_group')] || values[7] || ''
            };
            
            if (exam.date && exam.start_time && exam.end_time) {
              allExams.push(exam);
            }
          }
        }
      }

      // Auto-resolution algorithm
      const resolvedExams = [...allExams];
      const changes = [];
      const availableRooms = ['A-101', 'A-102', 'A-103', 'B-201', 'B-202', 'B-203', 'C-301', 'C-302', 'C-303'];
      const availableFaculty = ['Dr. Smith', 'Dr. Johnson', 'Dr. Wilson', 'Dr. Brown', 'Dr. Taylor', 'Dr. Anderson', 'Dr. Miller', 'Dr. Davis'];
      const timeSlots = [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' },
        { start: '10:00', end: '13:00' },
        { start: '15:00', end: '18:00' }
      ];

      // Resolve room conflicts
      for (const conflict of conflicts) {
        if (conflict.type === 'Room Conflict') {
          // Find the conflicting exam and reschedule it
          const conflictingExam = resolvedExams.find(exam => 
            exam.subject_name === conflict.exam2.split(' (')[0]
          );
          
          if (conflictingExam) {
            // Try to find alternative room
            const usedRooms = resolvedExams
              .filter(e => e.date === conflictingExam.date && e.start_time === conflictingExam.start_time)
              .map(e => e.room_no);
            
            const availableRoom = availableRooms.find(room => !usedRooms.includes(room));
            
            if (availableRoom) {
              const oldRoom = conflictingExam.room_no;
              conflictingExam.room_no = availableRoom;
              changes.push(`Moved ${conflictingExam.subject_name} from room ${oldRoom} to ${availableRoom}`);
            } else {
              // Reschedule to different time
              const availableSlot = timeSlots.find(slot => {
                const conflicting = resolvedExams.some(e => 
                  e.date === conflictingExam.date && 
                  e.start_time === slot.start && 
                  e.room_no === conflictingExam.room_no
                );
                return !conflicting;
              });
              
              if (availableSlot) {
                const oldTime = `${conflictingExam.start_time}-${conflictingExam.end_time}`;
                conflictingExam.start_time = availableSlot.start;
                conflictingExam.end_time = availableSlot.end;
                changes.push(`Rescheduled ${conflictingExam.subject_name} from ${oldTime} to ${availableSlot.start}-${availableSlot.end}`);
              }
            }
          }
        }
        
        // Resolve faculty conflicts
        if (conflict.type === 'Faculty Conflict') {
          const conflictingExam = resolvedExams.find(exam => 
            exam.subject_name === conflict.exam2.split(' (')[0]
          );
          
          if (conflictingExam) {
            const usedFaculty = resolvedExams
              .filter(e => e.date === conflictingExam.date && e.start_time === conflictingExam.start_time)
              .map(e => e.faculty_id);
            
            const availableFac = availableFaculty.find(fac => !usedFaculty.includes(fac));
            
            if (availableFac) {
              const oldFaculty = conflictingExam.faculty_id;
              conflictingExam.faculty_id = availableFac;
              changes.push(`Reassigned ${conflictingExam.subject_name} from ${oldFaculty} to ${availableFac}`);
            }
          }
        }
      }

      setResolvedTimetable(resolvedExams);
      setResolutionChanges(changes);
      
    } catch (error) {
      alert('Error resolving conflicts: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Multi-Branch Timetable Analyzer
            </h1>
            <p className="text-gray-600">
              Upload departmental timetables and detect conflicts using AI
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Instruction Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                Upload CSV files with required columns:
              </p>
              <p className="text-xs text-blue-700">
                subject_name, department, date, start_time, end_time, room_no, faculty_id, student_group
              </p>
            </div>
          </div>
        </div>

        {/* Demo Data Section for Hackathon Judges */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
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
                  // Create a blob from the CSV data
                  const blob = new Blob([scenario.data], { type: 'text/csv' });
                  const file = new File([blob], `${scenario.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, { type: 'text/csv' });
                  
                  // Load into the first available timetable slot
                  const availableSlot = Object.keys(timetables).find(key => !timetables[key].file) || 'timetable1';
                  
                  setTimetables(prev => ({
                    ...prev,
                    [availableSlot]: {
                      ...prev[availableSlot],
                      file,
                      data: null,
                      conflicts: null,
                      resolved: null,
                      summary: null
                    }
                  }));
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

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.keys(timetables).map((key, index) => (
            <div key={key} className="bg-white shadow-sm rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Timetable {index + 1}
              </h3>
              
              <div className="mb-4">
                <label className="block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setTimetables(prev => ({
                        ...prev,
                        [key]: {
                          ...prev[key],
                          file,
                          data: null,
                          conflicts: null,
                          resolved: null,
                          summary: null
                        }
                      }));
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                  />
                </label>
              </div>
              
              {timetables[key].file && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 truncate flex-1" title={timetables[key].file.name}>
                      📄 {timetables[key].file.name}
                    </p>
                    <button
                      onClick={() => {
                        setTimetables(prev => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            file: null,
                            data: null,
                            conflicts: null,
                            resolved: null,
                            summary: null
                          }
                        }));
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs"
                      title="Delete file"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleResolveConflicts}
            disabled={loading || !Object.values(timetables).some(t => t.file)}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm h-12"
          >
            {loading ? 'Analyzing Conflicts...' : '🔍 Detect Conflicts'}
          </button>
          
          <button
            onClick={() => {
              setTimetables({
                timetable1: { file: null, data: null, conflicts: null, resolved: null, summary: null },
                timetable2: { file: null, data: null, conflicts: null, resolved: null, summary: null },
                timetable3: { file: null, data: null, conflicts: null, resolved: null, summary: null },
                timetable4: { file: null, data: null, conflicts: null, resolved: null, summary: null }
              });
              setShowResults(false);
              setConflicts([]);
              setResolvedTimetable(null);
              setResolutionChanges([]);
            }}
            className="bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors shadow-sm h-12"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Conflict Analysis Results
              </h2>
            </div>
            
            <div className="p-6">
              {conflicts.length === 0 ? (
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 font-medium">
                      ✓ No conflicts detected between timetables
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-800 font-medium">
                        {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} detected
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {conflicts.map((conflict, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            conflict.type === 'Room Conflict' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {conflict.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {conflict.timetable1} vs {conflict.timetable2}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">
                          {conflict.description}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Subjects involved:</p>
                            <p className="text-gray-900">{conflict.exam1}</p>
                            <p className="text-gray-900">{conflict.exam2}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Date and Time:</p>
                            <p className="text-gray-900">{conflict.date}</p>
                            <p className="text-gray-900">{conflict.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Auto-Resolve Button */}
                    <div className="mt-6">
                      <button
                        onClick={handleAutoResolve}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {loading ? 'Resolving Conflicts...' : '✨ Auto-Resolve & Reschedule Conflicts'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resolved Timetable Section */}
        {resolvedTimetable && (
          <div className="bg-white shadow-sm rounded-xl border border-green-200 overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-green-200 bg-green-50">
              <h2 className="font-semibold text-green-900">
                ✅ Conflict-Free Timetable (Resolved)
              </h2>
            </div>
            
            <div className="p-6">
              {/* Resolution Summary */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-green-900">Resolution Summary</h3>
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
                <div className="space-y-1">
                  {resolutionChanges.map((change, idx) => (
                    <p key={idx} className="text-sm text-green-700">• {change}</p>
                  ))}
                </div>
              </div>

              {/* Resolved Timetable Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left border-b">Subject</th>
                      <th className="px-4 py-2 text-left border-b">Department</th>
                      <th className="px-4 py-2 text-left border-b">Date</th>
                      <th className="px-4 py-2 text-left border-b">Time</th>
                      <th className="px-4 py-2 text-left border-b">Room</th>
                      <th className="px-4 py-2 text-left border-b">Faculty</th>
                      <th className="px-4 py-2 text-left border-b">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedTimetable.map((exam, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{exam.subject_name}</td>
                        <td className="px-4 py-2">{exam.department}</td>
                        <td className="px-4 py-2">{exam.date}</td>
                        <td className="px-4 py-2">{exam.start_time} - {exam.end_time}</td>
                        <td className="px-4 py-2">{exam.room_no}</td>
                        <td className="px-4 py-2">{exam.faculty_id}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {exam.timetableSource}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

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
                  🚀 AI Analysis Launched!
                </h3>
                <p className="text-gray-700 font-medium animate-pulse">
                  ⚡ Scanning conflicts across timetables...
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
