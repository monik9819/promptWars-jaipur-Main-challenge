import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCheckins } from '../hooks/useCheckins';
import { useBurnoutScore } from '../hooks/useBurnoutScore';
import BurnoutGauge from '../components/BurnoutGauge';
import MoodChart from '../components/MoodChart';
import SOSPanel from '../components/SOSPanel';
import { Flame, ArrowRight, Lightbulb } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { checkins, streak } = useCheckins();
  const { score, zone } = useBurnoutScore();
  const navigate = useNavigate();

  // Greeting
  const today = new Date();
  const exam = new Date(user?.examDate);
  const diffTime = exam - today;
  const daysToExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let greeting = `Good morning, ${user?.name}. ${daysToExam > 0 ? daysToExam : 0} days to your ${user?.examType} exam.`;
  if (daysToExam <= 0 && user?.prepStage === 'Result Awaiting') {
    greeting = "Result season is tough. We're here for you 💙";
  }

  // Last checkin
  let lastCheckinText = "No check-ins yet.";
  if (checkins && checkins.length > 0) {
    const lastTime = new Date(checkins[0].timestamp);
    const diffHours = Math.floor((today - lastTime) / (1000 * 60 * 60));
    if (diffHours < 24) {
      lastCheckinText = `Last checked in: ${diffHours} hours ago`;
    } else {
      lastCheckinText = `Last check-in was ${Math.floor(diffHours/24)} days ago. Time to log your mood!`;
    }
  }

  // 7-day mood trend data
  const moodData = useMemo(() => {
    if (!checkins || checkins.length === 0) return [];
    
    const dataMap = new Map();
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      dataMap.set(d.toDateString(), null);
    }

    checkins.forEach(c => {
      const d = new Date(c.timestamp).toDateString();
      if (dataMap.has(d) && dataMap.get(d) === null) {
        dataMap.set(d, { score: c.mood_score, hours: c.study_hours || 0 });
      }
    });

    const result = [];
    dataMap.forEach((val, dateStr) => {
      const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
      if (val !== null) {
        result.push({ day: dayName, score: val.score, hours: val.hours });
      }
    });
    return result;
  }, [checkins]);

  // Top Stress Triggers
  const topTriggers = useMemo(() => {
    if (!checkins || checkins.length === 0) return [];
    
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recent = checkins.filter(c => c.timestamp >= sevenDaysAgo);
    
    const counts = {};
    recent.forEach(c => {
      (c.triggers || []).forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [checkins]);

  // Wellness tip
  const tips = [
    "Take a 5-minute break away from screens to rest your eyes.",
    "Remember to stay hydrated while studying! Drink a glass of water now.",
    "A short walk can help clear your mind and improve focus.",
    "Try the 4-7-8 breathing exercise to calm exam nerves.",
    "Break your syllabus into smaller, manageable chunks.",
    "Don't compare your Chapter 1 to someone else's Chapter 20.",
    "Sleep is when your brain consolidates memory. Don't skip it."
  ];
  const tipIndex = today.getDate() % tips.length;
  const todaysTip = tips[tipIndex];

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{greeting}</h1>
        </header>

        {zone === 'Crisis' && (
          <div className="mb-6 space-y-4">
            <div className="bg-rose-600 text-white p-6 rounded-3xl shadow-lg border border-rose-700 animate-pulse">
              <h2 className="text-xl font-bold mb-2">⚠️ Mandatory Break Protocol Initiated</h2>
              <p className="text-rose-100 font-medium">Your recent logs show severe burnout indicators (>10 hrs study with low mood). We strongly advise stepping away from your desk for the rest of the day.</p>
            </div>
            <SOSPanel className="shadow-sm" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Burnout Gauge */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-slate-700 w-full text-left mb-2">Burnout Risk</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <BurnoutGauge score={score} zone={zone} />
            </div>
          </div>

          {/* Card 2: Streak & CTA */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-700 mb-4">Check-in Streak</h2>
              <div className="flex items-center space-x-3 text-orange-500">
                <div className="p-3 bg-orange-50 rounded-2xl">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{streak} <span className="text-xl text-slate-500 font-medium">days</span></div>
                  <div className="text-sm text-slate-500 mt-1">{lastCheckinText}</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkin')}
              className="mt-8 w-full flex items-center justify-between px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-medium transition-colors"
            >
              Log Today's Mood
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Card 3: 7-Day Trend */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">7-Day Mood Trend</h2>
            <div className="h-48">
              <MoodChart data={moodData} />
            </div>
          </div>

          {/* Card 4: Top Triggers */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 md:col-span-1 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Top Stress Triggers This Week</h2>
            {topTriggers.length > 0 ? (
              <div className="space-y-4">
                {topTriggers.map((t, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-1/3 text-sm font-medium text-slate-600 truncate pr-4" title={t.name}>{t.name}</div>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: `${(t.count / topTriggers[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-right text-sm text-slate-500 font-medium">{t.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm pb-8">
                No triggers recorded recently.
              </div>
            )}
          </div>

          {/* Card 6: Tip */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-3xl shadow-sm border border-indigo-100 flex flex-col justify-center">
            <div className="flex items-center space-x-2 text-indigo-700 mb-4">
              <Lightbulb className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Today's Wellness Tip</h2>
            </div>
            <p className="text-indigo-900 font-medium leading-relaxed">
              "{todaysTip}"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
