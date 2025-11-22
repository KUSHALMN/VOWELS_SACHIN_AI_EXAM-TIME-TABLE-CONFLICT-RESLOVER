export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: 'upload', label: 'Upload Timetable', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
    { id: 'create', label: 'Create Timetable', icon: 'M12 4v16m8-8H4' },
    { id: 'current', label: 'Current Timetable', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'multiBranch', label: 'Multi-Branch Analyzer', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'aiDetect', label: 'AI Conflict Detection', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'autoResolve', label: 'AI Auto-Resolution', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

  return (
    <aside className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Dashboard <span className="text-blue-600">VOWELS</span>
        </h2>
        <nav className="space-y-3">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activePage === item.id
                  ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
