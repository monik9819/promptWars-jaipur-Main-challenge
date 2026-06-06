import { describe, it, expect } from 'vitest';
import { generateSystemPrompt } from '../utils/aiContext';

describe('generateSystemPrompt', () => {
  it('generates prompt with correct user details', () => {
    const user = {
      name: 'John',
      examType: 'JEE',
      examDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      prepStage: 'Under 3 months'
    };
    
    const prompt = generateSystemPrompt(user, []);
    
    expect(prompt).toContain('John');
    expect(prompt).toContain('JEE');
    expect(prompt).toContain('10 days');
    expect(prompt).toContain('Under 3 months');
    expect(prompt).toContain('unknown/10');
  });

  it('calculates correct mood and triggers from recent checkins', () => {
    const user = {
      name: 'Jane',
      examType: 'NEET',
      examDate: new Date().toISOString(),
      prepStage: 'Result Awaiting'
    };
    
    const now = Date.now();
    const checkins = [
      { timestamp: now - 1000, mood_score: 4, study_hours: 8, triggers: ['Syllabus pressure', 'Sleep issues'] },
      { timestamp: now - 86400000, mood_score: 6, study_hours: 4, triggers: ['Syllabus pressure'] }
    ];
    
    const prompt = generateSystemPrompt(user, checkins);
    
    expect(prompt).toContain('5.0/10'); // (4+6)/2
    expect(prompt).toContain('6.0 hours'); // (8+4)/2
    expect(prompt).toContain('Syllabus pressure');
    expect(prompt).toContain('Sleep issues');
  });
});
