/**
 * Enhanced Spaced Repetition Algorithm (SM-2)
 * Optimizes learning retention through scientifically-backed intervals
 */

class SpacedRepetitionEngine {
  constructor() {
    this.minEaseFactor = 1.3;
    this.defaultEaseFactor = 2.5;
    this.intervalMultiplier = {
      first: 1,
      second: 6
    };
  }

  /**
   * Calculate next review parameters based on performance
   * @param {Object} cardData - Current card data
   * @param {number} quality - Performance rating (0-5)
   * @returns {Object} Updated card parameters
   */
  calculateNextReview(cardData, quality) {
    const {
      easeFactor = this.defaultEaseFactor,
      interval = 0,
      repetitions = 0,
      lastReviewed = null
    } = cardData;

    let newEaseFactor = easeFactor;
    let newInterval = interval;
    let newRepetitions = repetitions;

    // Update ease factor based on quality
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Ensure minimum ease factor
    if (newEaseFactor < this.minEaseFactor) {
      newEaseFactor = this.minEaseFactor;
    }

    // Calculate new interval and repetitions
    if (quality >= 3) {
      // Correct response
      newRepetitions = repetitions + 1;
      
      if (repetitions === 0) {
        newInterval = this.intervalMultiplier.first;
      } else if (repetitions === 1) {
        newInterval = this.intervalMultiplier.second;
      } else {
        newInterval = Math.round(interval * newEaseFactor);
      }
    } else {
      // Incorrect response - reset
      newRepetitions = 0;
      newInterval = this.intervalMultiplier.first;
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      easeFactor: Math.round(newEaseFactor * 100) / 100,
      interval: newInterval,
      repetitions: newRepetitions,
      lastReviewed: new Date().toISOString(),
      nextReview: nextReviewDate.toISOString(),
      quality: quality
    };
  }

  /**
   * Get cards due for review
   * @param {Array} cards - All flashcards
   * @returns {Array} Cards due for review
   */
  getCardsForReview(cards) {
    const now = new Date();
    
    return cards.filter(card => {
      if (!card.nextReview) return true; // New cards
      
      const nextReview = new Date(card.nextReview);
      return nextReview <= now;
    }).sort((a, b) => {
      // Prioritize overdue cards
      if (!a.nextReview) return -1;
      if (!b.nextReview) return 1;
      
      return new Date(a.nextReview) - new Date(b.nextReview);
    });
  }

  /**
   * Get study statistics
   * @param {Array} cards - All flashcards
   * @returns {Object} Study statistics
   */
  getStudyStats(cards) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = {
      total: cards.length,
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
      dueToday: 0,
      dueTomorrow: 0
    };

    cards.forEach(card => {
      if (!card.lastReviewed) {
        stats.new++;
      } else if (card.repetitions < 2) {
        stats.learning++;
      } else if (card.repetitions >= 2 && card.easeFactor >= 2.5) {
        stats.mastered++;
      } else {
        stats.review++;
      }

      // Check due dates
      if (card.nextReview) {
        const nextReview = new Date(card.nextReview);
        if (nextReview <= tomorrow && nextReview >= today) {
          stats.dueToday++;
        } else if (nextReview <= new Date(tomorrow.getTime() + 86400000) && nextReview > tomorrow) {
          stats.dueTomorrow++;
        }
      } else {
        stats.dueToday++; // New cards are due today
      }
    });

    return stats;
  }

  /**
   * Generate study session
   * @param {Array} cards - Available cards
   * @param {number} sessionLength - Desired session length
   * @returns {Array} Cards for study session
   */
  generateStudySession(cards, sessionLength = 20) {
    const dueCards = this.getCardsForReview(cards);
    
    // Mix of due cards and new cards
    const session = dueCards.slice(0, Math.min(sessionLength, dueCards.length));
    
    // Add new cards if session is not full
    if (session.length < sessionLength) {
      const newCards = cards
        .filter(card => !card.lastReviewed)
        .slice(0, sessionLength - session.length);
      session.push(...newCards);
    }

    return this.shuffleArray(session);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calculate retention rate
   * @param {Array} reviewHistory - Array of review records
   * @returns {number} Retention rate percentage
   */
  calculateRetentionRate(reviewHistory) {
    if (reviewHistory.length === 0) return 0;
    
    const correctAnswers = reviewHistory.filter(review => review.quality >= 3).length;
    return Math.round((correctAnswers / reviewHistory.length) * 100);
  }

  /**
   * Get performance insights
   * @param {Array} cards - All flashcards
   * @param {Array} reviewHistory - Review history
   * @returns {Object} Performance insights
   */
  getPerformanceInsights(cards, reviewHistory) {
    const retentionRate = this.calculateRetentionRate(reviewHistory);
    const stats = this.getStudyStats(cards);
    
    // Calculate average ease factor
    const cardsWithEase = cards.filter(card => card.easeFactor);
    const avgEaseFactor = cardsWithEase.length > 0 
      ? cardsWithEase.reduce((sum, card) => sum + card.easeFactor, 0) / cardsWithEase.length
      : this.defaultEaseFactor;

    // Identify difficult cards
    const difficultCards = cards
      .filter(card => card.easeFactor && card.easeFactor < 2.0)
      .sort((a, b) => a.easeFactor - b.easeFactor);

    // Study streak calculation
    const recentReviews = reviewHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 30); // Last 30 reviews

    return {
      retentionRate,
      averageEaseFactor: Math.round(avgEaseFactor * 100) / 100,
      studyStreak: this.calculateStudyStreak(reviewHistory),
      difficultCardsCount: difficultCards.length,
      masteredCardsCount: stats.mastered,
      totalStudyTime: this.calculateTotalStudyTime(reviewHistory),
      weeklyProgress: this.getWeeklyProgress(reviewHistory),
      recommendations: this.generateRecommendations(stats, retentionRate, avgEaseFactor)
    };
  }

  /**
   * Calculate study streak
   * @param {Array} reviewHistory - Review history
   * @returns {number} Current study streak in days
   */
  calculateStudyStreak(reviewHistory) {
    if (reviewHistory.length === 0) return 0;

    const uniqueDates = [...new Set(
      reviewHistory.map(review => 
        new Date(review.timestamp).toDateString()
      )
    )].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date();

    for (const dateString of uniqueDates) {
      const reviewDate = new Date(dateString);
      const daysDiff = Math.floor((currentDate - reviewDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate total study time
   * @param {Array} reviewHistory - Review history
   * @returns {number} Total study time in minutes
   */
  calculateTotalStudyTime(reviewHistory) {
    return reviewHistory.reduce((total, review) => {
      return total + (review.responseTime || 30); // Default 30 seconds per card
    }, 0) / 60; // Convert to minutes
  }

  /**
   * Get weekly progress data
   * @param {Array} reviewHistory - Review history
   * @returns {Array} Weekly progress data
   */
  getWeeklyProgress(reviewHistory) {
    const weeklyData = {};
    const now = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toDateString();
      weeklyData[dateKey] = { reviews: 0, correct: 0 };
    }

    // Populate with actual data
    reviewHistory.forEach(review => {
      const dateKey = new Date(review.timestamp).toDateString();
      if (weeklyData[dateKey]) {
        weeklyData[dateKey].reviews++;
        if (review.quality >= 3) {
          weeklyData[dateKey].correct++;
        }
      }
    });

    return Object.entries(weeklyData).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      reviews: data.reviews,
      accuracy: data.reviews > 0 ? Math.round((data.correct / data.reviews) * 100) : 0
    }));
  }

  /**
   * Generate personalized recommendations
   * @param {Object} stats - Study statistics
   * @param {number} retentionRate - Retention rate percentage
   * @param {number} avgEaseFactor - Average ease factor
   * @returns {Array} Recommendations
   */
  generateRecommendations(stats, retentionRate, avgEaseFactor) {
    const recommendations = [];

    if (retentionRate < 70) {
      recommendations.push({
        type: 'improvement',
        title: 'Focus on Review',
        message: 'Your retention rate is below 70%. Consider reviewing cards more frequently and taking time to understand concepts thoroughly.'
      });
    }

    if (stats.dueToday > 50) {
      recommendations.push({
        type: 'workload',
        title: 'Large Review Queue',
        message: `You have ${stats.dueToday} cards due today. Consider breaking your study session into smaller chunks.`
      });
    }

    if (avgEaseFactor < 2.0) {
      recommendations.push({
        type: 'difficulty',
        title: 'Challenging Material',
        message: 'You\'re working with difficult concepts. Consider supplementing with additional resources or breaking down complex topics.'
      });
    }

    if (stats.new > 0) {
      recommendations.push({
        type: 'progress',
        title: 'New Cards Available',
        message: `You have ${stats.new} new cards to learn. Mix them with review cards for optimal learning.`
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: 'Great Progress!',
        message: 'You\'re maintaining good study habits. Keep up the excellent work!'
      });
    }

    return recommendations;
  }
}

// Export for use in both web and mobile apps
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpacedRepetitionEngine;
} else if (typeof window !== 'undefined') {
  window.SpacedRepetitionEngine = SpacedRepetitionEngine;
}

// Modern ES6 export
export default SpacedRepetitionEngine;