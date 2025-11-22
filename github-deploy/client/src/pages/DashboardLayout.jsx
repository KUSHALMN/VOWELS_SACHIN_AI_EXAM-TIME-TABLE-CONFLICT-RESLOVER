import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import UploadTimetable from '../components/UploadTimetable';
import CreateTimetable from '../components/CreateTimetable';
import CurrentTimetable from '../components/CurrentTimetable';
import MultiBranchAnalyzer from '../components/MultiBranchAnalyzer';
import AIConflictDetection from '../components/AIConflictDetection';
import AIAutoResolution from '../components/AIAutoResolution';
import ConflictLogicInfo from '../components/ConflictLogicInfo';

export default function DashboardLayout() {
  const [activePage, setActivePage] = useState('upload');
  const [timetable, setTimetable] = useState([]);

  const handleAddExam = (exam) => {
    setTimetable([...timetable, exam]);
  };

  const handleRemoveExam = (index) => {
    setTimetable(timetable.filter((_, i) => i !== index));
  };

  const handleUpdateTimetable = (newTimetable) => {
    setTimetable(newTimetable);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Debug: Show active page */}
          <div className="mb-4 text-xs text-gray-500">Active: {activePage}</div>
          
          {activePage === 'upload' && (
            <UploadTimetable onUpdateTimetable={handleUpdateTimetable} />
          )}
          {activePage === 'create' && (
            <CreateTimetable onAddExam={handleAddExam} />
          )}
          {activePage === 'current' && (
            <CurrentTimetable timetable={timetable} onRemove={handleRemoveExam} />
          )}
          {activePage === 'multiBranch' && (
            <MultiBranchAnalyzer />
          )}
          {activePage === 'aiDetect' && (
            <AIConflictDetection timetable={timetable} />
          )}
          {activePage === 'autoResolve' && (
            <AIAutoResolution timetable={timetable} onUpdateTimetable={handleUpdateTimetable} />
          )}
          {activePage === 'logic' && (
            <ConflictLogicInfo />
          )}
        </div>
      </main>
    </div>
  );
}
