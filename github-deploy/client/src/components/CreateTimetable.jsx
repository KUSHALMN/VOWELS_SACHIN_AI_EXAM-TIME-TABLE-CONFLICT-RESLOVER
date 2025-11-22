import { useState, useEffect } from 'react';
import { timetableCache } from '../data/timetableCache';

export default function CreateTimetable({ onAddExam }) {
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    start: '',
    end: '',
    room: '',
    faculty: '',
    studentGroup: ''
  });
  const [message, setMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const branches = ['CSE', 'ISE', 'AIML', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHERS'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const exam = {
      id: Date.now(),
      branch: selectedBranch,
      ...formData
    };
    
    try {
      timetableCache.addExam(selectedBranch, exam);
      const count = timetableCache.getTimetables()[selectedBranch].length;
      setMessage(`✓ Exam added to ${selectedBranch} (Total: ${count})`);
      setFormData({
        subject: '',
        date: '',
        start: '',
        end: '',
        room: '',
        faculty: '',
        studentGroup: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(`✗ ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Branch-Wise Timetable</h1>
      
      {backendStatus === 'disconnected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl">
          <p className="text-red-800 font-medium">⚠️ Backend server is not running!</p>
          <p className="text-red-700 text-sm mt-2">Please start the backend server:</p>
          <code className="block bg-red-100 p-2 rounded mt-2 text-sm">npm run dev</code>
          <button 
            onClick={checkBackend}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      {backendStatus === 'connected' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 max-w-2xl">
          <p className="text-green-800 text-sm">✓ Backend connected</p>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
        >
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md max-w-2xl ${
          message.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., Data Structures"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., A-102"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Faculty Invigilator</label>
            <input
              type="text"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., Dr. Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Group</label>
            <input
              type="text"
              value={formData.studentGroup}
              onChange={(e) => setFormData({ ...formData, studentGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., 21CS034"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Add Exam to {selectedBranch}
          </button>
        </form>
      </div>
    </div>
  );
}
