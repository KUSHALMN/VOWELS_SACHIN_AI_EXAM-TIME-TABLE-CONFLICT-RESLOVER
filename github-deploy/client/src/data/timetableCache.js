const STORAGE_KEY = 'timetables';
const AI_SUMMARY_KEY = 'aiSummary';
const CONFLICTS_KEY = 'conflicts';
const RESOLVED_KEY = 'resolvedTimetable';
const CHANGES_KEY = 'resolutionChanges';

const defaultTimetables = {
  CSE: [],
  ISE: [],
  AIML: [],
  ECE: [],
  EEE: [],
  MECH: [],
  CIVIL: [],
  OTHERS: []
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const loaded = saved ? JSON.parse(saved) : {};
    return { ...defaultTimetables, ...loaded };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultTimetables;
  }
};

const loadAISummary = () => {
  try {
    const saved = localStorage.getItem(AI_SUMMARY_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
};

const saveAISummary = (summary) => {
  try {
    localStorage.setItem(AI_SUMMARY_KEY, JSON.stringify(summary));
  } catch (error) {
    console.error('Failed to save AI summary:', error);
  }
};

const loadConflicts = () => {
  try {
    const saved = localStorage.getItem(CONFLICTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

const saveConflicts = (conflicts) => {
  try {
    localStorage.setItem(CONFLICTS_KEY, JSON.stringify(conflicts));
  } catch (error) {
    console.error('Failed to save conflicts:', error);
  }
};

const loadResolvedTimetable = () => {
  try {
    const saved = localStorage.getItem(RESOLVED_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
};

const saveResolvedTimetable = (resolved) => {
  try {
    localStorage.setItem(RESOLVED_KEY, JSON.stringify(resolved));
  } catch (error) {
    console.error('Failed to save resolved timetable:', error);
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

let timetables = loadFromStorage();
let aiSummary = loadAISummary();
let conflicts = loadConflicts();
let resolvedTimetable = loadResolvedTimetable();
let resolutionChanges = [];
let listeners = [];

const loadChanges = () => {
  try {
    const saved = localStorage.getItem(CHANGES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

const saveChanges = (changes) => {
  try {
    localStorage.setItem(CHANGES_KEY, JSON.stringify(changes));
  } catch (error) {
    console.error('Failed to save changes:', error);
  }
};

resolutionChanges = loadChanges();

const sortExams = (exams) => {
  return [...exams].sort((a, b) => {
    if (a.date !== b.date) return a.date > b.date ? 1 : -1;
    return a.start > b.start ? 1 : -1;
  });
};

export const timetableCache = {
  subscribe(fn) {
    listeners.push(fn);
    fn(timetables);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  },

  notify() {
    listeners.forEach(fn => fn({ 
      timetables: { ...timetables },
      aiSummary,
      conflicts,
      resolvedTimetable
    }));
  },

  addExam(branch, exam) {
    if (!timetables[branch]) {
      timetables[branch] = [];
    }
    timetables[branch].push(exam);
    saveToStorage(timetables);
    this.notify();
  },

  deleteExam(branch, examId) {
    if (timetables[branch]) {
      timetables[branch] = timetables[branch].filter(exam => exam.id !== examId);
      saveToStorage(timetables);
      this.notify();
    }
  },

  setTimetables(obj) {
    timetables = { ...obj };
    saveToStorage(timetables);
    this.notify();
  },

  getTimetables() {
    return { ...timetables };
  },

  getSortedBranch(branch) {
    return sortExams(timetables[branch] || []);
  },

  getAllExams() {
    return Object.values(timetables).flat();
  },

  getBranchAnalytics(branch) {
    const exams = timetables[branch] || [];
    const rooms = new Set(exams.map(e => e.room));
    const faculties = new Set(exams.map(e => e.faculty));
    
    const clashes = exams.reduce((count, exam, i) => {
      const hasClash = exams.some((other, j) => 
        i !== j && exam.date === other.date && exam.room === other.room &&
        exam.start < other.end && other.start < exam.end
      );
      return count + (hasClash ? 1 : 0);
    }, 0);
    
    return {
      totalExams: exams.length,
      roomsUsed: rooms.size,
      facultiesUsed: faculties.size,
      internalClashes: Math.floor(clashes / 2)
    };
  },

  setAISummary(summary) {
    aiSummary = summary;
    saveAISummary(summary);
    this.notify();
  },

  getAISummary() {
    return aiSummary;
  },

  setConflicts(conflictList) {
    conflicts = conflictList;
    saveConflicts(conflictList);
    this.notify();
  },

  getConflicts() {
    return conflicts;
  },

  setResolvedTimetable(resolved) {
    resolvedTimetable = resolved;
    saveResolvedTimetable(resolved);
    this.notify();
  },

  getResolvedTimetable() {
    return resolvedTimetable;
  },

  setResolutionChanges(changes) {
    resolutionChanges = changes;
    saveChanges(changes);
    this.notify();
  },

  getResolutionChanges() {
    return resolutionChanges;
  },

  reset() {
    timetables = { ...defaultTimetables };
    aiSummary = null;
    conflicts = [];
    resolvedTimetable = null;
    saveToStorage(timetables);
    localStorage.removeItem(AI_SUMMARY_KEY);
    localStorage.removeItem(CONFLICTS_KEY);
    localStorage.removeItem(RESOLVED_KEY);
    this.notify();
  }
};
