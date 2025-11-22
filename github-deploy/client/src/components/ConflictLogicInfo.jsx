export default function ConflictLogicInfo() {
  const logicItems = [
    {
      title: 'Student Clash Detection',
      description: 'Identifies when the same student group has overlapping exam times.',
      logic: 'if (same student_group AND time overlaps) → flag conflict'
    },
    {
      title: 'Faculty Clash Detection',
      description: 'Detects when a faculty member is assigned to multiple exams at the same time.',
      logic: 'if (same faculty_id AND time overlaps) → flag conflict'
    },
    {
      title: 'Room Clash Detection',
      description: 'Identifies when the same room is booked for multiple exams simultaneously.',
      logic: 'if (same room_no AND time overlaps) → flag conflict'
    },
    {
      title: 'Capacity Violation',
      description: 'Checks if the number of students exceeds the room capacity.',
      logic: 'if (total_students > room_capacity) → flag conflict'
    },
    {
      title: 'Department Clash Detection',
      description: 'Identifies when the same department has overlapping exam schedules.',
      logic: 'if (same department AND time overlaps) → flag conflict'
    },
    {
      title: 'Overlapping Time Logic',
      description: 'Core algorithm to determine if two time slots overlap.',
      logic: 'if (start1 < end2 AND start2 < end1) → times overlap'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Conflict Detection Logic</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <p className="text-gray-700 leading-relaxed">
          Our AI-powered conflict detection system uses advanced algorithms to identify scheduling conflicts 
          in real-time. Below are the core detection rules implemented in the backend.
        </p>
      </div>

      <div className="space-y-4">
        {logicItems.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <code className="text-sm text-gray-800 font-mono">{item.logic}</code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2">Auto-Resolution Algorithm</h3>
        <p className="text-sm text-blue-800 mb-3">
          When conflicts are detected, our greedy scheduling algorithm automatically resolves them:
        </p>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span className="font-semibold">1.</span>
            <span>Sort exams by number of students (descending priority)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">2.</span>
            <span>For each exam, try available time slots</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">3.</span>
            <span>Check for conflicts with already scheduled exams</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">4.</span>
            <span>Assign first conflict-free slot and room</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">5.</span>
            <span>Generate optimized timetable with explanations</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
