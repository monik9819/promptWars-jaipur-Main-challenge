// Constants for thresholds
export const BURNOUT_THRESHOLDS = {
  THRIVING: 40,
  WATCH: 65,
  AT_RISK: 80,
  CRISIS: 100
};

export function calculateBurnoutScore(checkins) {
  if (!checkins || checkins.length === 0) return 0;

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  const recentCheckins = checkins.filter(c => c.timestamp >= sevenDaysAgo);
  
  if (recentCheckins.length === 0) return 50; // Neutral default if no recent data

  // Critical Burnout Threshold Engine: >10 hours study AND mood < 4 for last 3 checkins
  let criticalCount = 0;
  for (let i = 0; i < Math.min(3, checkins.length); i++) {
    const c = checkins[i];
    if (c.study_hours > 10 && c.mood_score < 4) {
      criticalCount++;
    } else {
      break;
    }
  }
  
  if (criticalCount >= 3) {
    return 100; // Immediate CRISIS zone
  }

  // 1. avgMoodLast7Days (weight 40%) — low mood = high burnout
  // score = (10 - avgMood) / 9 * 40
  const avgMood = recentCheckins.reduce((sum, c) => sum + c.mood_score, 0) / recentCheckins.length;
  const moodScore = ((10 - avgMood) / 9) * 40;

  // 2. checkInFrequency (weight 20%) — missing days = disengagement signal
  // score = (7 - daysCheckedInLast7) / 7 * 20
  // Calculate unique days checked in
  const uniqueDays = new Set(recentCheckins.map(c => new Date(c.timestamp).toDateString())).size;
  const frequencyScore = ((7 - uniqueDays) / 7) * 20;

  // 3. negativeEmotionRatio (weight 25%) — ratio of [Anxious, Overwhelmed, Tired, Lonely, Irritable]
  // score = ratio * 25
  const negativeEmotionsSet = new Set(['Anxious', 'Overwhelmed', 'Tired', 'Lonely', 'Irritable']);
  let totalEmotions = 0;
  let negativeEmotions = 0;

  recentCheckins.forEach(c => {
    if (c.emotions) {
      c.emotions.forEach(e => {
        totalEmotions++;
        if (negativeEmotionsSet.has(e)) {
          negativeEmotions++;
        }
      });
    }
  });

  const ratio = totalEmotions > 0 ? (negativeEmotions / totalEmotions) : 0;
  const emotionScore = ratio * 25;

  // 4. highSeverityTriggerCount (weight 15%) — [Fear of failure, Exam day nerves, Peer comparison]
  // score = min(count, 3) / 3 * 15
  const severeTriggersSet = new Set(['Fear of failure', 'Exam day nerves', 'Peer comparison']);
  let severeCount = 0;

  recentCheckins.forEach(c => {
    if (c.triggers) {
      c.triggers.forEach(t => {
        if (severeTriggersSet.has(t)) {
          severeCount++;
        }
      });
    }
  });

  const triggerScore = (Math.min(severeCount, 3) / 3) * 15;

  // Total Burnout Score
  let totalScore = moodScore + frequencyScore + emotionScore + triggerScore;
  
  return Math.min(Math.max(Math.round(totalScore), 0), 100);
}
