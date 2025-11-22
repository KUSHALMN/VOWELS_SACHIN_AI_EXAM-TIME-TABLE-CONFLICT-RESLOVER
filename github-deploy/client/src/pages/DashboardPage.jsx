import { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateExamForm from '../components/CreateExamForm';
import TimetablePreview from '../components/TimetablePreview';
import ConflictAlert from '../components/ConflictAlert';
import RunConflictButton from '../components/RunConflictButton';

const API_URL = 'http://localhost:3001';

export default function DashboardPage() {
  const [timetable, setTimetable] = useState([]);
  const [conflicts, setConflicts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAddExam = (exam) => {
    setTimetable([...timetable, exam]);
    setConflicts(null);
    setShowAlert(false);
  };

  const handleRemoveExam = (index) => {
    setTimetable(timetable.filter((_, i) => i !== index));
    setConflicts(null);
    setShowAlert(false);
  };

  const handleRunConflictCheck = async () => {
    if (timetable.length === 0) {
      alert('Please add at least one exam to the timetable');
      return;
    }

    setLoading(true);
    try {
      // Create FormData with CSV content
      const csvContent = convertToCSV(timetable);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'timetable.csv');

      // Upload timetable
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.success) {
        // Detect conflicts
        const conflictRes = await fetch(`${API_URL}/detect-conflicts`, {
          method: 'POST',
        });
        const conflictData = await conflictRes.json();
        setConflicts(conflictData.conflicts);
        setShowAlert(true);
      }
    } catch (error) {
      alert('Error checking conflicts: ' + error.message);
    }
    setLoading(false);
  };

  const handleAutoResolve = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/resolve`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        setTimetable(data.timetable);
        setConflicts([]);
        setShowAlert(true);
        alert('Conflicts resolved successfully!');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Exam Timetable Dashboard <span className="text-blue-600">by VOWELS</span>
          </h1>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert */}
        {showAlert && conflicts && (
          <ConflictAlert conflicts={conflicts} onClose={() => setShowAlert(false)} />
        )}

        {/* Action Buttons */}
        {timetable.length > 0 && (
          <div className="mb-6">
            <RunConflictButton
              onRunCheck={handleRunConflictCheck}
              onAutoResolve={handleAutoResolve}
              loading={loading}
              hasConflicts={conflicts && conflicts.length > 0}
            />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div>
            <CreateExamForm onAddExam={handleAddExam} />
          </div>

          {/* Right Column - Preview */}
          <div>
            <TimetablePreview timetable={timetable} onRemove={handleRemoveExam} />
          </div>
        </div>
      </main>
    </div>
  );
}
