import { 
  HealthNewsQuestion, 
  QuestionViewRecord, 
  ResearchQuestionFormat, 
  ResearchDifficulty,
  NewsArticle
} from '../types';
import { INITIAL_RESEARCH_QUESTIONS } from '../data/healthResearchQuestionData';

const STORAGE_KEYS = {
  POOL: 'gh_health_research_question_pool_v3',
  HISTORY: 'gh_health_question_views_history_v3',
  VISIT_COUNTER: 'gh_health_question_visit_number_v3',
  SETTINGS: 'gh_health_question_automation_settings_v3',
  USER_STATS: 'gh_health_question_user_stats_v3'
};

export interface QuestionPoolSettings {
  autoPublish: boolean;
  minQualityScore: number;
  recentExclusionWindow: number; // e.g. 10 questions
  avoidFormatRepetition: boolean;
  avoidSpecialtyRepetition: boolean;
  freshnessWeight: number;
}

const DEFAULT_SETTINGS: QuestionPoolSettings = {
  autoPublish: true,
  minQualityScore: 90,
  recentExclusionWindow: 10,
  avoidFormatRepetition: true,
  avoidSpecialtyRepetition: true,
  freshnessWeight: 1.5
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

// Generate or retrieve persistent Session ID
function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem('gh_research_session_id');
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('gh_research_session_id', sid);
    }
    return sid;
  } catch {
    return 'guest-session';
  }
}

export const healthResearchQuestionService = {
  // 1. Get all questions in pool
  getQuestionPool(): HealthNewsQuestion[] {
    return getStorage<HealthNewsQuestion[]>(STORAGE_KEYS.POOL, INITIAL_RESEARCH_QUESTIONS);
  },

  // Save question pool
  saveQuestionPool(pool: HealthNewsQuestion[]): void {
    setStorage(STORAGE_KEYS.POOL, pool);
  },

  // 2. Get Automation Settings
  getSettings(): QuestionPoolSettings {
    return getStorage<QuestionPoolSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  saveSettings(settings: QuestionPoolSettings): void {
    setStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  // 3. View History
  getViewHistory(): QuestionViewRecord[] {
    return getStorage<QuestionViewRecord[]>(STORAGE_KEYS.HISTORY, []);
  },

  saveViewHistory(history: QuestionViewRecord[]): void {
    setStorage(STORAGE_KEYS.HISTORY, history);
  },

  // 4. Visit Counter
  getVisitNumber(): number {
    const stored = getStorage<number>(STORAGE_KEYS.VISIT_COUNTER, 31); // Default to 31 as in design
    return stored;
  },

  incrementVisitNumber(): number {
    const current = this.getVisitNumber();
    const next = current + 1;
    setStorage(STORAGE_KEYS.VISIT_COUNTER, next);
    return next;
  },

  // 5. Core Smart Selection Engine: Select dynamic question on visit
  selectQuestionForVisit(options?: { 
    sessionId?: string; 
    incrementVisit?: boolean;
    excludedQuestionId?: string;
  }): { question: HealthNewsQuestion; visitNumber: number; totalInPool: number; isRotated: boolean } {
    const pool = this.getQuestionPool().filter(q => q.status === 'active');
    const settings = this.getSettings();
    const sessionId = options?.sessionId || getOrCreateSessionId();
    const history = this.getViewHistory();
    
    // Increment visit if requested (e.g. on page entry or explore new insight)
    let visitNumber = this.getVisitNumber();
    if (options?.incrementVisit) {
      visitNumber = this.incrementVisitNumber();
    }

    if (pool.length === 0) {
      // Fallback if pool is empty
      return {
        question: INITIAL_RESEARCH_QUESTIONS[0],
        visitNumber,
        totalInPool: INITIAL_RESEARCH_QUESTIONS.length,
        isRotated: false
      };
    }

    // Single question edge case
    if (pool.length === 1) {
      return {
        question: pool[0],
        visitNumber,
        totalInPool: 1,
        isRotated: false
      };
    }

    // Get recently seen question IDs within exclusion window
    const recentViews = history
      .filter(h => h.sessionId === sessionId || true)
      .slice(-settings.recentExclusionWindow);

    const recentlySeenIds = new Set(recentViews.map(v => v.questionId));
    if (options?.excludedQuestionId) {
      recentlySeenIds.add(options.excludedQuestionId);
    }

    // Determine last shown question to avoid consecutive format/specialty
    const lastView = recentViews.length > 0 ? recentViews[recentViews.length - 1] : null;
    const lastQuestion = lastView ? pool.find(q => q.id === lastView.questionId) : null;

    // Filter candidate pool excluding recently seen
    let eligibleCandidates = pool.filter(q => !recentlySeenIds.has(q.id));

    // Fallback: If all questions were recently seen, relax restriction and take least recently seen
    if (eligibleCandidates.length === 0) {
      // Sort pool by oldest viewed timestamp
      const viewTimesMap = new Map<string, number>();
      history.forEach(h => viewTimesMap.set(h.questionId, new Date(h.viewedAt).getTime()));
      
      const sortedByOldest = [...pool].sort((a, b) => {
        const timeA = viewTimesMap.get(a.id) || 0;
        const timeB = viewTimesMap.get(b.id) || 0;
        return timeA - timeB;
      });

      // Pick from the top 3 least-recently seen (excluding current if possible)
      const nonCurrent = sortedByOldest.filter(q => q.id !== options?.excludedQuestionId);
      eligibleCandidates = nonCurrent.length > 0 ? nonCurrent.slice(0, 3) : sortedByOldest.slice(0, 3);
    }

    // Rank candidates by diversity and quality score
    const scoredCandidates = eligibleCandidates.map(q => {
      let score = q.qualityScore || 90;

      // Penalty if same format as last question
      if (settings.avoidFormatRepetition && lastQuestion && q.format === lastQuestion.format) {
        score -= 25;
      }

      // Penalty if same specialty as last question
      if (settings.avoidSpecialtyRepetition && lastQuestion && q.specialty === lastQuestion.specialty) {
        score -= 20;
      }

      // Small randomized jitter to prevent deterministic loops
      score += Math.random() * 10;

      return { question: q, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);
    const selected = scoredCandidates[0].question;

    // Record view in history
    const viewRecord: QuestionViewRecord = {
      id: `view_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      questionId: selected.id,
      visitNumber,
      viewedAt: new Date().toISOString()
    };

    this.saveViewHistory([...history, viewRecord]);

    // Update views count on the question
    const updatedPool = pool.map(q => 
      q.id === selected.id ? { ...q, viewsCount: (q.viewsCount || 0) + 1 } : q
    );
    this.saveQuestionPool(updatedPool);

    return {
      question: selected,
      visitNumber,
      totalInPool: pool.length,
      isRotated: true
    };
  },

  // 6. Submit Answer and Return Scientific Validation
  submitAnswer(params: {
    questionId: string;
    selectedOptionIds: string[];
    timeSpentSeconds?: number;
    sessionId?: string;
  }): {
    isCorrect: boolean;
    correctOptionIds: string[];
    explanation: string;
    evidenceSummary: any;
    clinicalTakeaway: string;
    userAccuracyRate: number;
    totalAnswered: number;
  } {
    const pool = this.getQuestionPool();
    const q = pool.find(item => item.id === params.questionId) || INITIAL_RESEARCH_QUESTIONS[0];
    
    // Evaluate correctness
    // Both arrays must contain identical elements
    const correctSet = new Set<string>(q.correctOptionIds);
    const selectedSet = new Set<string>(params.selectedOptionIds);
    
    let isCorrect = correctSet.size === selectedSet.size;
    if (isCorrect) {
      for (const id of correctSet) {
        if (!selectedSet.has(id)) {
          isCorrect = false;
          break;
        }
      }
    }

    // Update Question Stats in Pool
    const updatedPool = pool.map(item => {
      if (item.id === q.id) {
        return {
          ...item,
          attemptsCount: (item.attemptsCount || 0) + 1,
          correctAttemptsCount: isCorrect ? (item.correctAttemptsCount || 0) + 1 : (item.correctAttemptsCount || 0)
        };
      }
      return item;
    });
    this.saveQuestionPool(updatedPool);

    // Update User Stats
    const userStats = getStorage<{ totalAnswered: number; correctCount: number }>(
      STORAGE_KEYS.USER_STATS, 
      { totalAnswered: 0, correctCount: 0 }
    );
    const nextTotal = userStats.totalAnswered + 1;
    const nextCorrect = isCorrect ? userStats.correctCount + 1 : userStats.correctCount;
    const updatedStats = { totalAnswered: nextTotal, correctCount: nextCorrect };
    setStorage(STORAGE_KEYS.USER_STATS, updatedStats);

    // Update view record with answer result
    const history = this.getViewHistory();
    const updatedHistory = history.map(h => {
      if (h.questionId === params.questionId && (!h.answeredAt || h.sessionId === params.sessionId)) {
        return {
          ...h,
          answeredAt: new Date().toISOString(),
          selectedOptionIds: params.selectedOptionIds,
          isCorrect,
          timeSpentSeconds: params.timeSpentSeconds
        };
      }
      return h;
    });
    this.saveViewHistory(updatedHistory);

    const userAccuracyRate = Math.round((nextCorrect / nextTotal) * 100);

    return {
      isCorrect,
      correctOptionIds: q.correctOptionIds,
      explanation: q.explanation,
      evidenceSummary: q.evidenceSummary,
      clinicalTakeaway: q.evidenceSummary?.clinicalSignificance || q.explanation,
      userAccuracyRate,
      totalAnswered: nextTotal
    };
  },

  // 7. Get User Lifetime Stats
  getUserStats(): { totalAnswered: number; correctCount: number; accuracyRate: number } {
    const stats = getStorage<{ totalAnswered: number; correctCount: number }>(
      STORAGE_KEYS.USER_STATS, 
      { totalAnswered: 0, correctCount: 0 }
    );
    const accuracyRate = stats.totalAnswered > 0 ? Math.round((stats.correctCount / stats.totalAnswered) * 100) : 100;
    return { ...stats, accuracyRate };
  },

  // 8. Auto-Generate Question from News Article (Backend Pipeline simulator)
  generateAndPublishFromArticle(article: NewsArticle): HealthNewsQuestion {
    const pool = this.getQuestionPool();
    const newId = `res-auto-${Date.now()}`;
    const formats: ResearchQuestionFormat[] = ['mcq', 'clinical_scenario', 'best_answer', 'research_insight', 'what_changed'];
    const chosenFormat = formats[Math.floor(Math.random() * formats.length)];

    const newQuestion: HealthNewsQuestion = {
      id: newId,
      articleId: article.id,
      articleTitle: article.title,
      articleSource: article.source || 'Medical Research Journal',
      articleDate: article.date || 'Published Recently',
      articleImageUrl: article.featuredImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      articleSummary: article.summary || article.shortDescription || article.title,
      specialty: article.category || 'General Medicine',
      topic: article.subcategory || article.category || 'Clinical Evidence',
      studyType: article.researchType || 'Peer-Reviewed Clinical Study',
      format: chosenFormat,
      difficulty: 'Moderate',
      questionText: `Based on the latest clinical report in ${article.source} ("${article.title}"), what is the primary evidence-based clinical conclusion?`,
      options: [
        { id: 'opt-1', text: `${article.summary || article.shortDescription || 'Demonstrates statistically significant improvements when adhering to validated clinical protocols.'}` },
        { id: 'opt-2', text: 'Disregards standard peer-reviewed guidelines and recommends unverified alternative practices.' },
        { id: 'opt-3', text: 'Shows that physiological outcomes remain entirely unaffected by medical or lifestyle interventions.' },
        { id: 'opt-4', text: 'Recommends immediately discontinuing doctor-prescribed therapies without professional consultation.' }
      ],
      correctOptionIds: ['opt-1'],
      explanation: article.content 
        ? `${article.content.substring(0, 240)}... This study affirms the critical role of evidence-based intervention.` 
        : `The published study confirms substantial therapeutic efficacy in ${article.category}.`,
      evidenceSummary: {
        populationAndSample: 'Cohort evaluated under controlled clinical observation.',
        interventionOrExposure: `${article.category} targeted therapeutic intervention.`,
        comparator: 'Standard-of-care control.',
        primaryOutcome: 'Clinical efficacy and safety endpoints.',
        mainFinding: article.summary || 'Statistically significant improvement in primary physiological markers.',
        clinicalSignificance: 'Provides actionable clinical data for healthcare providers and patients.',
        evidenceLevel: 'Level I (RCT / Meta-Analysis)',
        journalName: article.source || 'Clinical Journal',
        publishedDate: article.date || 'Recent Issue',
        studyDoi: article.studyDoi || '10.1016/gh.research.2026'
      },
      qualityScore: 96,
      status: 'active',
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
      validatedAt: new Date().toISOString(),
      version: 1,
      viewsCount: 0,
      attemptsCount: 0,
      correctAttemptsCount: 0
    };

    const updated = [newQuestion, ...pool];
    this.saveQuestionPool(updated);
    return newQuestion;
  },

  // 9. Reset session history (for testing visit rotation)
  resetSessionHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      sessionStorage.removeItem('gh_research_session_id');
    } catch {}
  }
};
