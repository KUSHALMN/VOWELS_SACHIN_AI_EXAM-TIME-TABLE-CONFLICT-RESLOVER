import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadCard from '../components/UploadCard';
import ConflictListCard from '../components/ConflictListCard';
import ResolveButtonCard from '../components/ResolveButtonCard';
import TimetableCard from '../components/TimetableCard';
import AISummaryCard from '../components/AISummaryCard';
import AlternativeSlotSuggestionsCard from '../components/AlternativeSlotSuggestionsCard';
import ImpactSummaryCard from '../components/ImpactSummaryCard';
import FatigueTrackerCard from '../components/FatigueTrackerCard';

const API_URL = 'http://localhost:3001';

export default function AppPage() {
  const [fileName, setFileName] = useState('');
  const [conflicts, setConflicts] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [summary, setSummary] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [impactSummary, setImpactSummary] = useState(null);
  const [fatigueData, setFatigueData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        const conflictRes = await fetch(`${API_URL}/detect-conflicts`, {
          method: 'POST',
        });
        const conflictData = await conflictRes.json();
        setConflicts(conflictData.conflicts);
        
        const suggestRes = await fetch(`${API_URL}/suggest-slots`, {
          method: 'POST',
        });
        const suggestData = await suggestRes.json();
        if (suggestData.success) {
          setSuggestions(suggestData.suggestions);
        }
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleResolve = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/resolve`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.success) {
        setTimetable(data.timetable);
        setSummary(data.summary);
        
        const summaryRes = await fetch(`${API_URL}/summary`);
        const summaryData = await summaryRes.json();
        if (summaryData.success) {
          setImpactSummary(summaryData.summary);
        }
        
        const fatigueRes = await fetch(`${API_URL}/fatigue`);
        const fatigueResData = await fatigueRes.json();
        if (fatigueResData.success) {
          setFatigueData(fatigueResData.fatigue);
        }
      }
    } catch (error) {
      alert('Resolution failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <UploadCard onUpload={handleUpload} fileName={fileName} />
        
        {conflicts && <ConflictListCard conflicts={conflicts} />}
        
        {suggestions && <AlternativeSlotSuggestionsCard suggestions={suggestions} />}
        
        {conflicts && conflicts.length > 0 && (
          <ResolveButtonCard onResolve={handleResolve} disabled={loading} />
        )}
        
        {timetable && <TimetableCard timetable={timetable} />}
        
        {summary && <AISummaryCard summary={summary} />}
        
        {impactSummary && <ImpactSummaryCard summary={impactSummary} />}
        
        {fatigueData && <FatigueTrackerCard fatigueData={fatigueData} />}
      </main>
    </div>
  );
}
