// utils/dataService.js
export class DataService {
  static async fetchFlashcards() {
    try {
      const response = await fetch('/data/flashcards.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      return null;
    }
  }

  static async fetchTopQuestions(count = 10) {
    try {
      const response = await fetch(`/data/top-${count}-questions.json`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching top ${count} questions:`, error);
      return null;
    }
  }

  static async fetchChallenges() {
    try {
      const response = await fetch('/data/challenges.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return null;
    }
  }

  static async fetchEnhancedQuestions() {
    try {
      const response = await fetch('/data/enhanced-questions.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching enhanced questions:', error);
      return null;
    }
  }
}