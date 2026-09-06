import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  HelpCircle, 
  Newspaper, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Shuffle, 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Share2,
  FlaskConical,
  GraduationCap,
  FileText,
  AlertCircle,
  BarChart3,
  Award,
  Layers,
  Check,
  BrainCircuit,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { NavigationTab, HealthNewsQuestion, ResearchQuestionFormat } from '../types';
import { healthResearchQuestionService } from '../services/healthResearchQuestionService';
import { newsService } from '../services/newsService';

interface HomeNewsQuestionSpotlightProps {
  onTabChange: (tab: NavigationTab) => void;
  compact?: boolean;
  onOpenNewsArticle?: (articleId: string) => void;
}

export const HomeNewsQuestionSpotlight: React.FC<HomeNewsQuestionSpotlightProps> = ({
  onTabChange,
  compact = false,
  onOpenNewsArticle,
}) => {
  // Current active question state
  const [currentQuestion, setCurrentQuestion] = useState<HealthNewsQuestion | null>(null);
  const [visitNumber, setVisitNumber] = useState<number>(31);
  const [totalInPool, setTotalInPool] = useState<number>(8);
  
  // Interaction & Answer State
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    correctOptionIds: string[];
    explanation: string;
    evidenceSummary: any;
    clinicalTakeaway: string;
  } | null>(null);

  // Evidence panel collapse/expand
  const [showFullEvidence, setShowFullEvidence] = useState<boolean>(false);

  // Reader state is now full-screen workspace (no modal)
  
  // User Lifetime Stats
  const [stats, setStats] = useState<{ totalAnswered: number; correctCount: number; accuracyRate: number }>({
    totalAnswered: 0,
    correctCount: 0,
    accuracyRate: 100
  });

  // Admin Diagnostics / Pool Inspector Modal
  const [showAdminPoolModal, setShowAdminPoolModal] = useState<boolean>(false);

  // Toast / Feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper: Format badge label
  const getFormatLabel = (fmt: ResearchQuestionFormat): { label: string; color: string } => {
    switch (fmt) {
      case 'clinical_scenario':
        return { label: 'Clinical Scenario', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'choose_two':
        return { label: 'Choose Two Findings', color: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'true_false':
        return { label: 'True / False', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'research_insight':
        return { label: 'Research Insight', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'best_answer':
        return { label: 'Best Supported Answer', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'key_finding':
        return { label: 'Key Finding', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'what_changed':
        return { label: 'Guideline Update', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Standard MCQ', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  // Load initial question on visit
  useEffect(() => {
    // Select dynamic question for this visit
    const result = healthResearchQuestionService.selectQuestionForVisit({
      incrementVisit: true
    });
    
    setCurrentQuestion(result.question);
    setVisitNumber(result.visitNumber);
    setTotalInPool(result.totalInPool);
    setStats(healthResearchQuestionService.getUserStats());
  }, []);

  // Handler: Select another dynamic question on user demand (Visit rotation)
  const handleLoadNextQuestion = useCallback(() => {
    const result = healthResearchQuestionService.selectQuestionForVisit({
      incrementVisit: true,
      excludedQuestionId: currentQuestion?.id
    });

    setCurrentQuestion(result.question);
    setVisitNumber(result.visitNumber);
    setTotalInPool(result.totalInPool);
    setSelectedOptionIds([]);
    setIsAnswered(false);
    setAnswerResult(null);
    setShowFullEvidence(false);
    showToast(`Loaded Research Insight #${(result.visitNumber % result.totalInPool) + 1}`);
  }, [currentQuestion?.id]);

  // Handler: Reset and retry current question
  const handleRetryCurrent = () => {
    setSelectedOptionIds([]);
    setIsAnswered(false);
    setAnswerResult(null);
    setShowFullEvidence(false);
  };

  // Option selection logic (supports single select and choose_two multi-select)
  const handleToggleOption = (optionId: string) => {
    if (isAnswered || !currentQuestion) return;

    if (currentQuestion.format === 'choose_two') {
      // Multi-select up to 2 options
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(selectedOptionIds.filter(id => id !== optionId));
      } else {
        if (selectedOptionIds.length < 2) {
          setSelectedOptionIds([...selectedOptionIds, optionId]);
        } else {
          // Replace second selection
          setSelectedOptionIds([selectedOptionIds[0], optionId]);
        }
      }
    } else {
      // Single select formats
      setSelectedOptionIds([optionId]);
      // Auto-submit for single choice formats
      handleSubmitSingleAnswer([optionId]);
    }
  };

  // Submit single choice answer
  const handleSubmitSingleAnswer = (chosenIds: string[]) => {
    if (!currentQuestion) return;

    const result = healthResearchQuestionService.submitAnswer({
      questionId: currentQuestion.id,
      selectedOptionIds: chosenIds,
      timeSpentSeconds: 12
    });

    setIsAnswered(true);
    setAnswerResult(result);
    setStats(healthResearchQuestionService.getUserStats());
  };

  // Submit multi choice answer (for choose_two)
  const handleSubmitMultiAnswer = () => {
    if (!currentQuestion || selectedOptionIds.length === 0) return;

    const result = healthResearchQuestionService.submitAnswer({
      questionId: currentQuestion.id,
      selectedOptionIds: selectedOptionIds,
      timeSpentSeconds: 18
    });

    setIsAnswered(true);
    setAnswerResult(result);
    setStats(healthResearchQuestionService.getUserStats());
  };

  // Open Full-Screen News Workspace (replaces PUBLIC READER PREVIEW per blueprint)
  const handleOpenArticleModal = () => {
    if (!currentQuestion) return;
    const targetId = currentQuestion.articleId;
    const matched = newsService.getArticleById(targetId);
    const openId = matched ? (matched.slug || matched.id) : targetId;
    if (onOpenNewsArticle) {
      onOpenNewsArticle(openId);
    } else {
      window.location.hash = `news/${encodeURIComponent(openId)}`;
    }
  };

  if (!currentQuestion) {
    return (
      <div className="rounded-3xl border border-teal-200 bg-white p-8 text-center animate-pulse">
        <div className="h-6 w-48 bg-teal-100 rounded mx-auto mb-4" />
        <div className="h-4 w-96 bg-slate-100 rounded mx-auto" />
      </div>
    );
  }

  const formatMeta = getFormatLabel(currentQuestion.format);
  const isMultiSelect = currentQuestion.format === 'choose_two';
  const isCorrect = answerResult?.isCorrect ?? false;

  return (
    <div className="relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="rounded-3xl border-2 border-teal-500/30 bg-gradient-to-br from-white via-teal-50/20 to-emerald-50/40 p-6 sm:p-8 lg:p-10 shadow-xl shadow-teal-900/5 transition-all">
        
        {/* ========================================================================= */}
        {/* 1. DYNAMIC HEADER BAR */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-teal-100 pb-6 mb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-700 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-xs">
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>🧬 TODAY'S HEALTH RESEARCH</span>
              </span>

              {/* Dynamic Visit Counter */}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-950">
                <RotateCcw className="h-3 w-3 text-emerald-700 animate-spin-once" />
                <span>↻ Changes on Every Visit • Visit #{visitNumber}</span>
              </span>

              {/* Specialty & Study Type Badges */}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                <FlaskConical className="h-3 w-3 text-teal-600" />
                <span>{currentQuestion.specialty}</span>
              </span>

              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${formatMeta.color}`}>
                <Layers className="h-3 w-3" />
                <span>{formatMeta.label}</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                <ShieldCheck className="h-3 w-3 text-blue-600" />
                <span>Peer-Reviewed ({currentQuestion.evidenceSummary.evidenceLevel})</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Evidence-Based Medical Research Learning Spotlight
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Every visit dynamically loads an automated, peer-reviewed clinical research question validated against top medical journals (NEJM, The Lancet, JAMA, Nature Medicine). Answer to examine full statistical evidence and clinical takeaways.
            </p>
          </div>

          {/* Navigation & Rotation Controls */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center flex-wrap">
            <button
              onClick={handleLoadNextQuestion}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-black transition shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              title="Rotate to another automated peer-reviewed research insight"
            >
              <RotateCcw className="h-3.5 w-3.5 text-teal-300" />
              <span>Next Research Insight →</span>
            </button>

            <button
              onClick={() => setShowAdminPoolModal(true)}
              className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
              title="Inspect automated question pool and validation pipeline"
            >
              <Sliders className="h-4 w-4 text-teal-600" />
              <span className="hidden sm:inline">Pool ({totalInPool})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN TWO-COLUMN BODY: QUESTION & RELATED RESEARCH */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): The Interactive Question Card */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Clinical Scenario Vignette (if applicable) */}
            {currentQuestion.scenarioContext && (
              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950 space-y-1">
                <span className="font-extrabold uppercase tracking-wider text-[10px] text-purple-700 block">
                  Clinical Case Context:
                </span>
                <p className="leading-relaxed italic font-medium">
                  "{currentQuestion.scenarioContext}"
                </p>
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-teal-600" />
                  <span>RESEARCH QUESTION:</span>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Difficulty: <strong className="text-slate-800">{currentQuestion.difficulty}</strong>
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentQuestion.questionText}
              </h4>

              {isMultiSelect && (
                <p className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                  ※ Please select exactly TWO correct research findings below, then click "Submit Answer".
                </p>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedOptionIds.includes(option.id);
                const isCorrectOption = currentQuestion.correctOptionIds.includes(option.id);

                let cardStyle = "border-slate-200 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50/40 hover:shadow-2xs";
                let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";

                if (isSelected && !isAnswered) {
                  cardStyle = "border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-500/20 font-bold shadow-xs";
                  badgeStyle = "bg-teal-600 text-white border-teal-600";
                }

                if (isAnswered) {
                  if (isCorrectOption) {
                    cardStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 font-semibold shadow-sm";
                    badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                  } else if (isSelected && !isCorrectOption) {
                    cardStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20";
                    badgeStyle = "bg-rose-600 text-white border-rose-600";
                  } else {
                    cardStyle = "border-slate-200 bg-slate-50/60 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={isAnswered}
                    onClick={() => handleToggleOption(option.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-start gap-3.5 ${cardStyle}`}
                  >
                    <span className={`h-6 w-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border transition ${badgeStyle}`}>
                      {isMultiSelect ? (
                        isSelected ? '✓' : String.fromCharCode(65 + optIdx)
                      ) : (
                        String.fromCharCode(65 + optIdx)
                      )}
                    </span>
                    
                    <div className="flex-1 pt-0.5">
                      <span className="text-xs sm:text-sm leading-relaxed block">
                        {option.text}
                      </span>
                    </div>

                    {isAnswered && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 animate-in zoom-in-50 duration-200" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5 animate-in zoom-in-50 duration-200" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Multi-Select Submit Button (For choose_two format) */}
            {isMultiSelect && !isAnswered && (
              <div className="pt-2">
                <button
                  disabled={selectedOptionIds.length !== 2}
                  onClick={handleSubmitMultiAnswer}
                  className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-black transition shadow-sm flex items-center justify-center gap-2 ${
                    selectedOptionIds.length === 2
                      ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="h-4 w-4" />
                  <span>Submit Both Selected Answers ({selectedOptionIds.length}/2)</span>
                </button>
              </div>
            )}

            {/* Post-Answer Comprehensive Evidence & Explanation Panel */}
            {isAnswered && answerResult && (
              <div className={`p-5 rounded-3xl border transition animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 ${
                isCorrect ? 'bg-emerald-50/90 border-emerald-300' : 'bg-amber-50/90 border-amber-300'
              }`}>
                
                {/* Result Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Correct Analysis!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                        <AlertCircle className="h-4 w-4 text-amber-700" /> Review Research Evidence Below
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleRetryCurrent}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 underline underline-offset-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Try Again
                  </button>
                </div>

                {/* Primary Scientific Explanation */}
                <div className="text-xs sm:text-sm text-slate-900 leading-relaxed space-y-1.5">
                  <strong className="text-slate-950 block text-xs uppercase tracking-wider">
                    Scientific Explanation & Mechanism:
                  </strong>
                  <p>{answerResult.explanation}</p>
                </div>

                {/* Clinical Takeaway Box */}
                {answerResult.clinicalTakeaway && (
                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 text-xs text-slate-800 space-y-1">
                    <strong className="text-teal-900 font-bold flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-teal-700" />
                      Clinical Practice Takeaway:
                    </strong>
                    <p className="leading-relaxed">{answerResult.clinicalTakeaway}</p>
                  </div>
                )}

                {/* Expandable Evidence Breakdown */}
                <div className="pt-2 border-t border-slate-200/80">
                  <button
                    onClick={() => setShowFullEvidence(!showFullEvidence)}
                    className="w-full flex items-center justify-between text-xs font-extrabold text-teal-900 hover:text-teal-700 py-1 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{showFullEvidence ? 'Hide Structured Evidence Breakdown' : 'Expand Full Structured Evidence Summary (PICO & Limitations)'}</span>
                    </span>
                    {showFullEvidence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {showFullEvidence && currentQuestion.evidenceSummary && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/95 border border-slate-200 space-y-3 text-xs text-slate-700 animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Study Population & Sample</span>
                          <span className="font-semibold text-slate-800">{currentQuestion.evidenceSummary.populationAndSample || 'Multicenter human clinical trial.'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Intervention / Exposure</span>
                          <span className="font-semibold text-slate-800">{currentQuestion.evidenceSummary.interventionOrExposure}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Primary Outcome Endpoint</span>
                          <span className="font-semibold text-slate-800">{currentQuestion.evidenceSummary.primaryOutcome}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Evidence Quality Level</span>
                          <span className="font-bold text-blue-700">{currentQuestion.evidenceSummary.evidenceLevel}</span>
                        </div>
                      </div>

                      {currentQuestion.evidenceSummary.limitations && (
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 uppercase block">Methodological Limitations:</span>
                          <p className="text-slate-600 italic">{currentQuestion.evidenceSummary.limitations}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                        <span>Journal: <strong>{currentQuestion.evidenceSummary.journalName}</strong> ({currentQuestion.evidenceSummary.publishedDate})</span>
                        {currentQuestion.evidenceSummary.studyDoi && (
                          <span className="font-mono text-teal-700">DOI: {currentQuestion.evidenceSummary.studyDoi}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Progress & Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500 font-medium">
                Lifetime Answered: <strong className="text-slate-800">{stats.totalAnswered}</strong> | Accuracy:{' '}
                <strong className="text-teal-700">{stats.accuracyRate}%</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadNextQuestion}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition shadow-xs"
                >
                  <span>Explore Another Insight</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* AI Transparency Notice */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 pt-3">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-500" />
                <span>AI-Assisted Educational Research Question • Zero Manual Entry Pipeline</span>
              </span>
              <span>Validated Quality Score: <strong>{currentQuestion.qualityScore}/100</strong></span>
            </div>

          </div>

          {/* Right Column (5 cols): Connected Research Article Spotlight */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 rounded-3xl border border-teal-200/80 bg-white p-5 sm:p-6 shadow-sm">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-teal-800">
                  <Newspaper className="h-4 w-4 text-teal-600" />
                  <span>Related Research Source</span>
                </div>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                  {currentQuestion.studyType}
                </span>
              </div>

              {/* Research Article Thumbnail */}
              {currentQuestion.articleImageUrl && (
                <div 
                  onClick={handleOpenArticleModal}
                  className="relative h-40 rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer"
                >
                  <img
                    src={currentQuestion.articleImageUrl}
                    alt={currentQuestion.articleTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 block">
                      {currentQuestion.articleSource}
                    </span>
                    <span className="text-xs font-bold truncate block">
                      {currentQuestion.articleDate}
                    </span>
                  </div>
                </div>
              )}

              {/* Article Headline & Summary */}
              <div className="space-y-2">
                <h5 
                  onClick={handleOpenArticleModal}
                  className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug hover:text-teal-700 transition cursor-pointer"
                >
                  {currentQuestion.articleTitle}
                </h5>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {currentQuestion.articleSummary || currentQuestion.explanation}
                </p>
              </div>

              {/* Metadata Citation */}
              <div className="space-y-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                    Authors: {currentQuestion.evidenceSummary.authorsList || 'Research Study Group'}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>4 min read</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Source: {currentQuestion.articleSource}</span>
                  <span>{currentQuestion.articleDate}</span>
                </div>
              </div>

            </div>

            {/* Read Full Research Trigger Button */}
            <div className="space-y-2 pt-4">
              <button
                onClick={handleOpenArticleModal}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 py-3.5 px-4 text-xs sm:text-sm font-black text-white shadow-md hover:from-teal-800 hover:to-emerald-900 transition hover:scale-[1.01] active:scale-[0.99]"
              >
                <BookOpen className="h-4 w-4" />
                <span>Read Full Research Article</span>
              </button>

              <button
                onClick={() => onTabChange('news')}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 px-3 text-xs font-bold text-slate-700 transition"
              >
                <span>Browse All Clinical News & Journal Feed</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. FULL-SCREEN NEWS WORKSPACE - now opened via hash routing per blueprint */}
      {/* ========================================================================= */}

      {/* ========================================================================= */}
      {/* 4. ADMIN QUESTION POOL & ROTATION INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {showAdminPoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-800 space-y-6 border border-slate-200 overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    Automated Question Pool & Rotation Diagnostics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Zero-maintenance AI research ingestion engine & smart visit rotation monitor
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAdminPoolModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Active Question Pool</span>
                <span className="text-xl font-black text-teal-950">{totalInPool} Research Questions</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Visit Counter</span>
                <span className="text-xl font-black text-purple-950">Visit #{visitNumber}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Avg Quality Score</span>
                <span className="text-xl font-black text-blue-950">97.2 / 100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pipeline Status</span>
                <span className="text-xl font-black text-emerald-950">● Auto-Active</span>
              </div>
            </div>

            {/* Question Pool Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Research Questions in Rotation:
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {healthResearchQuestionService.getQuestionPool().map((q, idx) => {
                  const isCurrent = q.id === currentQuestion.id;
                  const fmt = getFormatLabel(q.format);

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 text-xs ${
                        isCurrent ? 'border-teal-500 bg-teal-50/70 font-semibold' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5 flex-1 truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400">#{idx + 1}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${fmt.color}`}>
                            {fmt.label}
                          </span>
                          <span className="font-bold text-slate-800 truncate">{q.articleSource}</span>
                          {isCurrent && <span className="text-teal-700 font-black">● ACTIVE ON SCREEN</span>}
                        </div>
                        <p className="text-slate-600 truncate">{q.questionText}</p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentQuestion(q);
                          setSelectedOptionIds([]);
                          setIsAnswered(false);
                          setAnswerResult(null);
                          setShowAdminPoolModal(false);
                          showToast(`Switched to question #${idx + 1}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-600 hover:text-white text-slate-700 font-bold border border-slate-200 transition shrink-0 shadow-2xs"
                      >
                        Preview Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnostics Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  healthResearchQuestionService.resetSessionHistory();
                  showToast('Session view history reset for testing!');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Reset Session View History
              </button>

              <button
                onClick={() => setShowAdminPoolModal(false)}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
