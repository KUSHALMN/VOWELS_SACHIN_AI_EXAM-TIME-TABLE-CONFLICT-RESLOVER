import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'cache.json');

const defaultCache = {
  timetableData: null,
  detectedConflicts: null,
  resolvedTimetable: null,
  aiSummary: null,
  alternativeSlots: null,
  impactSummary: null,
  fatigueData: null,
  multiBranchData: null,
  multiBranchConflicts: null,
  branchTimetables: {
    CSE: [],
    ISE: [],
    AIML: [],
    ECE: [],
    EEE: [],
    MECH: [],
    CIVIL: [],
    OTHERS: []
  }
};

const loadCache = () => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('Cache file not found or corrupted, using defaults');
  }
  return { ...defaultCache };
};

const saveCache = (cache) => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Failed to save cache:', error);
  }
};

let cache = loadCache();

export function setCache(key, value) {
  cache[key] = value;
  saveCache(cache);
}

export function getCache(key) {
  return cache[key];
}

export function getAllCache() {
  return cache;
}

export function clearCache() {
  cache = { ...defaultCache };
  saveCache(cache);
}
