export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'quiz' | 'level' | 'streak' | 'category' | 'accuracy' | 'milestone';
  condition: (userStats: UserStats) => boolean;
  metadata?: any;
}

export interface UserStats {
  userId: number;
  level: number;
  totalPoints: number;
  quizzesCompleted: number;
  accuracy: number;
  quizzes: any[];
  categoriesCompleted: string[];
  perfectScores: number;
  currentStreak: number;
  maxStreak: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // First Quiz Badge
  {
    id: 'first-quiz',
    name: 'First Steps',
    description: 'Complete your very first quiz',
    icon: 'ri-star-line',
    color: 'from-yellow-400 to-orange-500',
    type: 'milestone',
    condition: (stats) => stats.quizzesCompleted >= 1
  },
  
  // Level-based badges
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: 'ri-arrow-up-line',
    color: 'from-blue-400 to-indigo-500',
    type: 'level',
    condition: (stats) => stats.level >= 5
  },
  {
    id: 'level-10',
    name: 'Knowledge Seeker',
    description: 'Reach Level 10',
    icon: 'ri-book-open-line',
    color: 'from-green-400 to-emerald-500',
    type: 'level',
    condition: (stats) => stats.level >= 10
  },
  {
    id: 'level-20',
    name: 'Expert Learner',
    description: 'Reach Level 20',
    icon: 'ri-award-line',
    color: 'from-purple-400 to-pink-500',
    type: 'level',
    condition: (stats) => stats.level >= 20
  },
  {
    id: 'level-50',
    name: 'Master Coder',
    description: 'Reach Level 50',
    icon: 'ri-crown-line',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    type: 'level',
    condition: (stats) => stats.level >= 50
  },

  // Quiz completion badges
  {
    id: 'quiz-5',
    name: 'Quiz Enthusiast',
    description: 'Complete 5 quizzes',
    icon: 'ri-questionnaire-line',
    color: 'from-cyan-400 to-blue-500',
    type: 'quiz',
    condition: (stats) => stats.quizzesCompleted >= 5
  },
  {
    id: 'quiz-10',
    name: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: 'ri-medal-line',
    color: 'from-purple-400 to-pink-500',
    type: 'quiz',
    condition: (stats) => stats.quizzesCompleted >= 10
  },
  {
    id: 'quiz-25',
    name: 'Quiz Champion',
    description: 'Complete 25 quizzes',
    icon: 'ri-trophy-line',
    color: 'from-yellow-400 to-orange-500',
    type: 'quiz',
    condition: (stats) => stats.quizzesCompleted >= 25
  },
  {
    id: 'quiz-50',
    name: 'Quiz Legend',
    description: 'Complete 50 quizzes',
    icon: 'ri-fire-line',
    color: 'from-red-400 to-pink-500',
    type: 'quiz',
    condition: (stats) => stats.quizzesCompleted >= 50
  },

  // Accuracy badges
  {
    id: 'accuracy-80',
    name: 'Sharp Mind',
    description: 'Achieve 80% accuracy',
    icon: 'ri-brain-line',
    color: 'from-green-400 to-emerald-500',
    type: 'accuracy',
    condition: (stats) => stats.accuracy >= 80 && stats.quizzesCompleted >= 3
  },
  {
    id: 'accuracy-90',
    name: 'Precision Master',
    description: 'Achieve 90% accuracy',
    icon: 'ri-target-line',
    color: 'from-blue-400 to-indigo-500',
    type: 'accuracy',
    condition: (stats) => stats.accuracy >= 90 && stats.quizzesCompleted >= 5
  },
  {
    id: 'accuracy-95',
    name: 'Perfect Aim',
    description: 'Achieve 95% accuracy',
    icon: 'ri-bullseye-line',
    color: 'from-purple-400 to-pink-500',
    type: 'accuracy',
    condition: (stats) => stats.accuracy >= 95 && stats.quizzesCompleted >= 10
  },

  // Category completion badges
  {
    id: 'category-1',
    name: 'Category Explorer',
    description: 'Complete quizzes in 1 different category',
    icon: 'ri-compass-line',
    color: 'from-cyan-400 to-blue-500',
    type: 'category',
    condition: (stats) => stats.categoriesCompleted.length >= 1
  },
  {
    id: 'category-3',
    name: 'Multi-Skill Learner',
    description: 'Complete quizzes in 3 different categories',
    icon: 'ri-layout-grid-line',
    color: 'from-green-400 to-emerald-500',
    type: 'category',
    condition: (stats) => stats.categoriesCompleted.length >= 3
  },
  {
    id: 'category-all',
    name: 'Complete Scholar',
    description: 'Complete quizzes in all 6 categories',
    icon: 'ri-global-line',
    color: 'from-purple-400 to-pink-500',
    type: 'category',
    condition: (stats) => stats.categoriesCompleted.length >= 6
  },

  // Perfect score badges
  {
    id: 'perfect-1',
    name: 'Perfect Score',
    description: 'Get a perfect score on any quiz',
    icon: 'ri-check-double-line',
    color: 'from-green-400 to-emerald-500',
    type: 'milestone',
    condition: (stats) => stats.perfectScores >= 1
  },
  {
    id: 'perfect-3',
    name: 'Consistent Excellence',
    description: 'Get perfect scores on 3 quizzes',
    icon: 'ri-star-double-line',
    color: 'from-blue-400 to-indigo-500',
    type: 'milestone',
    condition: (stats) => stats.perfectScores >= 3
  },
  {
    id: 'perfect-5',
    name: 'Perfectionist',
    description: 'Get perfect scores on 5 quizzes',
    icon: 'ri-diamond-line',
    color: 'from-purple-400 to-pink-500',
    type: 'milestone',
    condition: (stats) => stats.perfectScores >= 5
  },

  // Streak badges
  {
    id: 'streak-3',
    name: 'On Fire',
    description: 'Complete 3 quizzes in a row',
    icon: 'ri-fire-line',
    color: 'from-orange-400 to-red-500',
    type: 'streak',
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Complete 7 quizzes in a row',
    icon: 'ri-calendar-check-line',
    color: 'from-purple-400 to-pink-500',
    type: 'streak',
    condition: (stats) => stats.currentStreak >= 7
  },
  {
    id: 'streak-14',
    name: 'Fortnight Fighter',
    description: 'Complete 14 quizzes in a row',
    icon: 'ri-time-line',
    color: 'from-blue-400 to-indigo-500',
    type: 'streak',
    condition: (stats) => stats.currentStreak >= 14
  },

  // Points badges
  {
    id: 'points-100',
    name: 'Century Club',
    description: 'Earn 100 total points',
    icon: 'ri-coins-line',
    color: 'from-yellow-400 to-orange-500',
    type: 'milestone',
    condition: (stats) => stats.totalPoints >= 100
  },
  {
    id: 'points-500',
    name: 'Half Grand',
    description: 'Earn 500 total points',
    icon: 'ri-bank-card-line',
    color: 'from-green-400 to-emerald-500',
    type: 'milestone',
    condition: (stats) => stats.totalPoints >= 500
  },
  {
    id: 'points-1000',
    name: 'Grand Master',
    description: 'Earn 1000 total points',
    icon: 'ri-vip-crown-line',
    color: 'from-purple-400 to-pink-500',
    type: 'milestone',
    condition: (stats) => stats.totalPoints >= 1000
  },

  // Special badges
  {
    id: 'voice-master',
    name: 'Voice Master',
    description: 'Complete voice interaction quiz with 90%+ accuracy',
    icon: 'ri-mic-2-line',
    color: 'from-purple-400 to-pink-500',
    type: 'milestone',
    condition: (stats) => {
      const voiceQuiz = stats.quizzes.find(q => q.category === 'voice-interaction');
      return voiceQuiz && voiceQuiz.correctAnswers / voiceQuiz.totalAnswers >= 0.9;
    }
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 5 quizzes in one day',
    icon: 'ri-speed-up-line',
    color: 'from-red-400 to-pink-500',
    type: 'milestone',
    condition: (stats) => {
      const today = new Date().toDateString();
      const todayQuizzes = stats.quizzes.filter(q => 
        new Date(q.createdAt).toDateString() === today
      );
      return todayQuizzes.length >= 5;
    }
  }
];

export async function checkAndAwardBadges(userStats: UserStats): Promise<string[]> {
  const newBadges: string[] = [];
  
  for (const badgeDef of BADGE_DEFINITIONS) {
    if (badgeDef.condition(userStats)) {
      try {
        const response = await fetch('/api/badges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userStats.userId,
            name: badgeDef.name,
            description: badgeDef.description,
            icon: badgeDef.icon,
            color: badgeDef.color,
            type: badgeDef.type,
            metadata: badgeDef.metadata ? JSON.stringify(badgeDef.metadata) : null
          })
        });
        
        if (response.ok) {
          newBadges.push(badgeDef.name);
        }
      } catch (error) {
        console.error('Error awarding badge:', error);
      }
    }
  }
  
  return newBadges;
}

export function calculateUserStats(quizzes: any[], userId: number): UserStats {
  const totalPoints = quizzes.reduce((sum, q) => sum + (q.points || 0), 0);
  const level = Math.floor(totalPoints / 100) + 1;
  const totalCorrect = quizzes.reduce((sum, q) => sum + (q.correctAnswers || 0), 0);
  const totalAnswered = quizzes.reduce((sum, q) => sum + (q.totalAnswers || 0), 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  
  // Get unique categories
  const categoriesCompleted = [...new Set(quizzes.map(q => q.category).filter(Boolean))];
  
  // Count perfect scores (100% accuracy)
  const perfectScores = quizzes.filter(q => 
    q.correctAnswers && q.totalAnswers && 
    (q.correctAnswers / q.totalAnswers) === 1
  ).length;
  
  // Calculate current streak (simplified - assumes quizzes are in chronological order)
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  for (let i = quizzes.length - 1; i >= 0; i--) {
    const quiz = quizzes[i];
    if (quiz.correctAnswers && quiz.totalAnswers && 
        (quiz.correctAnswers / quiz.totalAnswers) >= 0.6) { // 60% or higher
      tempStreak++;
      if (i === quizzes.length - 1) currentStreak = tempStreak;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 0;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak);
  
  return {
    userId,
    level,
    totalPoints,
    quizzesCompleted: quizzes.length,
    accuracy,
    quizzes,
    categoriesCompleted,
    perfectScores,
    currentStreak,
    maxStreak
  };
} 