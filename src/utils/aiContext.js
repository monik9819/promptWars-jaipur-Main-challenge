export const generateSystemPrompt = (user, recentCheckins) => {
  const { name, examType, examDate, prepStage } = user || {};
  
  // Calculate days to exam
  const today = new Date();
  const exam = new Date(examDate);
  const diffTime = exam - today;
  const daysToExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate avg mood and study hours this week
  let avgMood = "unknown";
  let avgStudyHours = "unknown";
  let topTriggers = "none";
  
  if (recentCheckins && recentCheckins.length > 0) {
    const sevenDaysAgo = today.getTime() - 7 * 24 * 60 * 60 * 1000;
    const weekCheckins = recentCheckins.filter(c => c.timestamp >= sevenDaysAgo);
    
    if (weekCheckins.length > 0) {
      const moodSum = weekCheckins.reduce((acc, curr) => acc + curr.mood_score, 0);
      avgMood = (moodSum / weekCheckins.length).toFixed(1);
      
      const studySum = weekCheckins.reduce((acc, curr) => acc + (curr.study_hours || 0), 0);
      avgStudyHours = (studySum / weekCheckins.length).toFixed(1);
      
      const triggerCounts = {};
      weekCheckins.forEach(c => {
        (c.triggers || []).forEach(t => {
          triggerCounts[t] = (triggerCounts[t] || 0) + 1;
        });
      });
      
      const sortedTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);
      topTriggers = sortedTriggers.slice(0, 3).map(t => t[0]).join(", ");
    }
  }

  return `You are MindEase, a compassionate mental wellness companion for students preparing for ${examType}. The student's name is ${name}, they have ${daysToExam > 0 ? daysToExam : 0} days until their exam, and their current preparation stage is ${prepStage}. Their average mood this week is ${avgMood}/10. They have been studying an average of ${avgStudyHours} hours per day recently. Their most frequent stress triggers are: ${topTriggers || 'none recorded yet'}. Be warm, non-judgmental, concise, and practical. Never give medical diagnoses. If the student expresses suicidal thoughts or self-harm, immediately provide iCall (9152987821) and AASRA (9820466627) helplines and encourage them to speak to a trusted adult. Provide exam-specific study tips, breathing exercises, reframing techniques, and motivational support. Keep responses under 150 words unless the student needs more.`;
};
