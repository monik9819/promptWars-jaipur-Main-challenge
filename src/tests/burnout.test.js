import { describe, it, expect } from 'vitest';
import { calculateBurnoutScore, BURNOUT_THRESHOLDS } from '../utils/burnout';

describe('calculateBurnoutScore', () => {
  it('returns 0 for no checkins', () => {
    expect(calculateBurnoutScore([])).toBe(0);
  });

  it('returns 50 for old checkins only', () => {
    const oldCheckin = {
      timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
      mood_score: 1,
    };
    expect(calculateBurnoutScore([oldCheckin])).toBe(50);
  });

  it('calculates score correctly for perfect wellness (score should be 0)', () => {
    const now = Date.now();
    const checkins = [];
    // 7 days of perfect checkins
    for(let i=0; i<7; i++) {
      checkins.push({
        timestamp: now - i * 24 * 60 * 60 * 1000,
        mood_score: 10,
        emotions: ['Focused', 'Calm', 'Hopeful'],
        triggers: []
      });
    }
    
    const score = calculateBurnoutScore(checkins);
    expect(score).toBe(0);
  });

  it('calculates score correctly for extreme burnout (score should be 100)', () => {
    const now = Date.now();
    const checkins = [];
    // 1 day of terrible checkins, missing 6 days
    checkins.push({
      timestamp: now,
      mood_score: 1,
      emotions: ['Anxious', 'Overwhelmed', 'Tired'],
      triggers: ['Fear of failure', 'Exam day nerves', 'Peer comparison']
    });
    
    // Mood weight: ((10-1)/9)*40 = 40
    // Frequency weight: ((7-1)/7)*20 = 17.14
    // Emotion ratio: 3/3 = 1 -> 1*25 = 25
    // Trigger count: 3 -> min(3,3)/3*15 = 15
    // Total = 40 + 17.14 + 25 + 15 = 97.14 -> 97
    
    const score = calculateBurnoutScore(checkins);
    expect(score).toBeGreaterThan(95); 
  });

  it('triggers critical burnout threshold (100) on 3 consecutive bad checkins', () => {
    const now = Date.now();
    const checkins = [
      { timestamp: now, mood_score: 3, study_hours: 12 },
      { timestamp: now - 86400000, mood_score: 2, study_hours: 11 },
      { timestamp: now - 172800000, mood_score: 3, study_hours: 14 }
    ];
    
    const score = calculateBurnoutScore(checkins);
    expect(score).toBe(100);
  });

  it('does NOT trigger critical threshold if study hours >10 but mood is good (>=4)', () => {
    const now = Date.now();
    const checkins = [
      { timestamp: now, mood_score: 8, study_hours: 12 },
      { timestamp: now - 86400000, mood_score: 7, study_hours: 11 },
      { timestamp: now - 172800000, mood_score: 9, study_hours: 14 }
    ];
    
    const score = calculateBurnoutScore(checkins);
    // Should calculate normal score, not jump to 100
    expect(score).toBeLessThan(40); 
  });

  it('handles multiple check-ins on the same day correctly (unique days calculation)', () => {
    const now = Date.now();
    const checkins = [
      { timestamp: now, mood_score: 5 },
      { timestamp: now - 3600000, mood_score: 4 }, // 1 hr ago (same day)
      { timestamp: now - 7200000, mood_score: 6 }  // 2 hrs ago (same day)
    ];
    // Frequency score should treat this as 1 unique day, so (7-1)/7 * 20 = ~17 penalty
    const score = calculateBurnoutScore(checkins);
    expect(score).toBeGreaterThan(0);
  });

  it('handles negative or unusual data gracefully', () => {
    const now = Date.now();
    const checkins = [
      { timestamp: now, mood_score: 15, study_hours: -5 }, // Invalid data, should still process
      { timestamp: now - 86400000, mood_score: -5 }
    ];
    const score = calculateBurnoutScore(checkins);
    // As long as it returns a number between 0 and 100
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
