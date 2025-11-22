import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-base font-medium text-gray-900">
          AI Exam Timetable Conflict Resolver <span className="text-blue-600 font-semibold">by VOWELS</span>
        </h1>
        <button className="text-gray-600 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function TrustBadge() {
  return null;
}

function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20 text-center">
      <TrustBadge />
      <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
        The Future of Conflict-Free<br />
        <span className="text-blue-600">Exam Scheduling</span>
      </h2>
      <p className="text-2xl font-semibold text-gray-700 mb-6">
        Smart. Automated. Always Accurate.
      </p>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Team <span className="text-blue-600 font-semibold">VOWELS</span> presents a fast, accurate, and fully automated exam scheduling solution. It detects every timetable conflict, recommends the best alternative slots, balances faculty workloads, and delivers clean, conflict-free schedules in seconds—removing the stress and manual effort from exam planning.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-blue-700 transition-colors"
        >
          Get Started Free
        </Link>
        <Link
          to="/app"
          className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-base font-medium hover:border-gray-400 transition-colors"
        >
          View Demo
        </Link>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Conflict Detection</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Automatically identifies student, faculty, room, capacity, and department clashes in real-time.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Slot Suggestions</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Generates top 3 alternative scheduling options using AI-driven scoring algorithms.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Optimized Scheduling</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Applies intelligent greedy algorithm for conflict-free final timetables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Advanced Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Impact Summary Dashboard</h4>
            <p className="text-sm text-gray-600">Shows utilization, load distribution, and conflict statistics.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Student Fatigue Tracker</h4>
            <p className="text-sm text-gray-600">Detects back-to-back exams and calculates fatigue scores.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Faculty Load Balancer</h4>
            <p className="text-sm text-gray-600">Ensures fair invigilation allocation across faculty.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">1</div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Upload Timetable</h4>
            <p className="text-sm text-gray-600">CSV/Excel parsed instantly</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">2</div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Detect Conflicts</h4>
            <p className="text-sm text-gray-600">Real-time conflict highlighting</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">3</div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Auto Resolve</h4>
            <p className="text-sm text-gray-600">AI generates clean schedule</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">4</div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Export & Review</h4>
            <p className="text-sm text-gray-600">Download final PDF/Excel</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-base font-medium text-gray-900 mb-2">AI Exam Timetable Conflict Resolver</p>
        <p className="text-sm text-gray-500">© 2025 · Built for smarter academic scheduling</p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturesGrid />
      <Highlights />
      <HowItWorks />
      <Footer />
    </div>
  );
}
