import React, { useState } from 'react';
import { useCheckins } from '../hooks/useCheckins';
import { BookOpen, Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const emojis = ['😞', '😟', '😐', '🙂', '😊', '😄'];
const getEmoji = (val) => {
  if (val <= 2) return emojis[0];
  if (val <= 4) return emojis[1];
  if (val <= 6) return emojis[2];
  if (val <= 8) return emojis[3];
  if (val < 10) return emojis[4];
  return emojis[5];
};

const JournalEntry = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(entry.timestamp);
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors">
      <div className="flex justify-between items-start mb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-2xl" aria-hidden="true">
            {getEmoji(entry.mood_score)}
          </div>
          <div>
            <div className="font-semibold text-slate-800 flex items-center">
              Mood: {entry.mood_score}/10
            </div>
            <div className="text-xs text-slate-500 flex items-center mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {entry.emotions && entry.emotions.map(e => (
          <span key={e} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md">
            {e}
          </span>
        ))}
        {entry.triggers && entry.triggers.map(t => (
          <span key={t} className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-100">
            {t}
          </span>
        ))}
      </div>

      {entry.journal_text && (
        <div className={`mt-4 pt-4 border-t border-slate-100 text-slate-700 text-sm leading-relaxed ${!expanded && 'line-clamp-2'}`}>
          {entry.journal_text}
        </div>
      )}
    </div>
  );
};

const Journal = () => {
  const { checkins } = useCheckins();
  const [filterMood, setFilterMood] = useState('all'); // all, good (7-10), neutral (4-6), bad (1-3)

  const filteredCheckins = checkins.filter(c => {
    if (filterMood === 'good') return c.mood_score >= 7;
    if (filterMood === 'neutral') return c.mood_score >= 4 && c.mood_score <= 6;
    if (filterMood === 'bad') return c.mood_score <= 3;
    return true;
  });

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Your Journal</h1>
            <p className="text-slate-500 mt-1">Reflect on your past check-ins and identify patterns.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 cursor-pointer pr-4"
            >
              <option value="all">All Moods</option>
              <option value="good">Good (7-10)</option>
              <option value="neutral">Neutral (4-6)</option>
              <option value="bad">Struggling (1-3)</option>
            </select>
          </div>
        </header>

        {checkins.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No entries yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Your journal is empty. Start your first check-in to track your wellness journey through exam season.
            </p>
          </div>
        ) : filteredCheckins.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No entries match your current filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCheckins.map(entry => (
              <JournalEntry key={entry.timestamp} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
