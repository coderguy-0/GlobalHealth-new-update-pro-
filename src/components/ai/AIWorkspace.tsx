import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, History, Plus, X as XIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePatientEhr } from '../../context/PatientEhrContext';
import { AIAvatar } from './AIAvatar';
import { AIChat } from './AIChat';
import { AIInput } from './AIInput';
import { AIConversationSidebar } from './AIConversationSidebar';
import { AIDisclaimer } from './AIDisclaimer';
import { AIAuthPrompt } from './AIAuthPrompt';
import type { AIErrorKind } from './AIErrorState';
import { aiChat, createAiMessageId } from '../../services/aiChatService';
import { titleFromPrompt } from './aiUtils';
import type { AIMessage, AIConversation, AIConversationSummary, AIHistoryFilter } from './types';
import { buildAssistantContext } from '../../core/ai/aiAssistantContext';

interface AIWorkspaceProps {
  currentLanguage: string;
  /** Optional prompt pre-filled when arriving from a context page. */
  initialPrompt?: string;
  /** Mobile back button — leaves the workspace. */
  onBack: () => void;
  /** Navigate to another GlobalHealth tab (action cards). */
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  /**
   * The workspace stays mounted (hidden) across page navigation so guest
   * session conversations persist. Account data is only loaded the first
   * time the workspace actually becomes visible.
   */
  active?: boolean;
}

interface SendError {
  kind: AIErrorKind;
  message: string;
}

interface PendingSend {
  prompt: string;
  clientMessageId: string;
}

function freshConversation(): AIConversation {
  const now = Date.now();
  return { id: `session-${now}`, title: 'New conversation', messages: [], createdAt: now, updatedAt: now };
}

function toErrorKind(err: unknown): { kind: AIErrorKind; message: string } {
  const e = err as { code?: string; message?: string };
  if (e?.code === 'AUTH_REQUIRED' || e?.code === 'SESSION_EXPIRED') {
    return { kind: 'auth', message: 'Your session has expired. Please sign in again to continue.' };
  }
  if (e?.code === 'NETWORK_ERROR') {
    return { kind: 'network', message: 'We could not reach the server. Please check your connection and try again.' };
  }
  return { kind: 'unavailable', message: e?.message || 'The AI service is temporarily unavailable. Please try again shortly.' };
}

/**
 * The GlobalHealth AI Assistant workspace — dedicated full-page experience
 * at the /ai-assistant route. Desktop: identity + history sidebar beside the
 * chat. Mobile: single-column chat-first with a slide-in history drawer.
 *
 * Data rules:
 *  - Guests: one session-only conversation held in React state. Never
 *    persisted, never account-linked, never auto-merged on login.
 *  - Signed-in: conversations persist to the account's own
 *    ai_conversations / ai_messages tables via the documented API. The
 *    server identifies the user from its session and validates ownership on
 *    every request — the client never sends a userId.
 *  - Chat content is never an EHR: nothing is transferred into medical
 *    records unless the user explicitly saves it.
 */
export const AIWorkspace: React.FC<AIWorkspaceProps> = ({ currentLanguage, initialPrompt, onBack, onNavigate, onLogout, active = true }) => {
  const { user, requireAuth } = useAuth();
  const { activePatient, wellness, medicationReminders, appointments } = usePatientEhr();
  const isSignedIn = !!user;
  const displayName = isSignedIn ? user!.fullName || activePatient.name : activePatient.name;

  // ---- Guest: session-only conversation (never persisted) ----
  const [sessionConversation, setSessionConversation] = useState<AIConversation>(() => freshConversation());

  // ---- Signed-in: account-owned conversation history ----
  const [summaries, setSummaries] = useState<AIConversationSummary[]>([]);
  const [activeUserConversation, setActiveUserConversation] = useState<AIConversation | null>(null);
  const [historyStatus, setHistoryStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [historyError, setHistoryError] = useState<{ kind: AIErrorKind; message: string } | null>(null);
  const [historyFilter, setHistoryFilter] = useState<AIHistoryFilter>('recent');
  const [historyQuery, setHistoryQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // ---- Send pipeline ----
  const [loadingReply, setLoadingReply] = useState(false);
  const [failedMessageId, setFailedMessageId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<SendError | null>(null);
  const retryRef = useRef<{ prompt: string } | null>(null);
  const pendingSendRef = useRef<PendingSend | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [armedClear, setArmedClear] = useState(false);

  // ---- UI state ----
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [injectedPrompt, setInjectedPrompt] = useState<string | null>(initialPrompt || null);
  // The workspace stays mounted (hidden) across navigation, so a context
  // prompt arriving later (e.g. disease page → "Ask AI") must still inject.
  useEffect(() => {
    if (initialPrompt) setInjectedPrompt(initialPrompt);
  }, [initialPrompt]);
  // Set when the user explicitly starts a fresh chat: don't re-open the most
  // recent conversation the next time the workspace becomes visible.
  const freshRequestedRef = useRef(false);
  // Explicit opt-in: session-only messages the guest chose to save to their
  // account after signing in. Cleared if they continue without saving.
  const pendingSaveRef = useRef<AIMessage[] | null>(null);

  const userSummary = useMemo(
    () => (user ? { fullName: user.fullName, mrn: user.mrn || activePatient.mrn } : null),
    [user, activePatient.mrn]
  );

  const activeConversation = isSignedIn ? activeUserConversation : sessionConversation;
  const activeId = activeConversation?.id ?? null;
  const messages = activeConversation?.messages ?? [];
  const initializing = isSignedIn && historyStatus === 'loading';

  /* ----------------------------------------------------------------
   * Login / logout lifecycle
   * -------------------------------------------------------------- */
  useEffect(() => {
    if (!user) {
      // Logout (here or in another tab): drop all account state immediately.
      // The anonymous session conversation is a fresh one — the previous
      // user's chat is never shown to the next visitor.
      pendingSaveRef.current = null;
      setSummaries([]);
      setActiveUserConversation(null);
      setHistoryStatus('idle');
      setHistoryError(null);
      setSessionConversation(freshConversation());
      setFailedMessageId(null);
      setSendError(null);
      setShareUrl(null);
      return;
    }
    // Defer account data until the workspace is actually visible so a hidden
    // mount at app start never loads private conversations in the background.
    if (!active) return;
    if (pendingSaveRef.current) {
        // Explicit user choice: "Save this conversation to my account".
        const toSave = pendingSaveRef.current;
        pendingSaveRef.current = null;
        setHistoryStatus('loading');
        aiChat
          .createConversation({
            title: titleFromPrompt(toSave.find((m) => m.role === 'user')?.content || 'Saved conversation'),
            messages: toSave,
          })
          .then((conv) => {
            setActiveUserConversation(conv);
            setHistoryStatus('idle');
            setSummaries([{ id: conv.id, title: conv.title, messageCount: conv.messages.length, createdAt: conv.createdAt, updatedAt: conv.updatedAt }]);
          })
          .catch((err) => {
            setHistoryStatus('error');
            setHistoryError(toErrorKind(err));
          });
        return;
      }
      // Normal signed-in entry: load the account's conversation history and
      // resume the most recent conversation (or show the welcome state).
      setHistoryStatus('loading');
      setHistoryError(null);
      aiChat
        .listConversations()
        .then(async (list) => {
          setSummaries(list);
          if (!freshRequestedRef.current) {
            const sorted = [...list].sort((a, b) => b.updatedAt - a.updatedAt);
            if (sorted.length > 0) {
              const conv = await aiChat.getConversation(sorted[0].id);
              setActiveUserConversation(conv);
            } else {
              setActiveUserConversation(null);
            }
          } else {
            setActiveUserConversation(null);
          }
          freshRequestedRef.current = false;
          setHistoryStatus('idle');
        })
        .catch((err) => {
          setHistoryStatus('error');
          setHistoryError(toErrorKind(err));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, active]);

  /* ----------------------------------------------------------------
   * Multi-tab safety: refresh history when the window regains focus.
   * -------------------------------------------------------------- */
  useEffect(() => {
    if (!isSignedIn) return;
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      aiChat.listConversations().then((list) => setSummaries(list)).catch(() => {});
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [isSignedIn]);

  /* ----------------------------------------------------------------
   * EHR-grounded replies — the signed-in account owner's own record only.
   * -------------------------------------------------------------- */
  const buildEhrReply = useCallback(
    (text: string): { text: string; sourceContext: string } | null => {
      const lower = text.toLowerCase();
      const isEhrQuery =
        lower.includes('lab') ||
        lower.includes('test result') ||
        lower.includes('cbc') ||
        lower.includes('blood test') ||
        lower.includes('medication') ||
        lower.includes('prescription') ||
        lower.includes('pills') ||
        lower.includes('drugs') ||
        lower.includes('vital') ||
        lower.includes('blood pressure') ||
        lower.includes('weight') ||
        lower.includes('bmi') ||
        lower.includes('bp') ||
        lower.includes('appointment') ||
        lower.includes('doctor') ||
        lower.includes('consult');

      if (!isEhrQuery) return null;

      if (!isSignedIn) {
        return {
          text:
            'To answer questions about personal labs, vitals, medications or appointments, you need to be signed in — the assistant is linked to the health record of the logged-in account only, so I can’t see (and will never show) anyone’s personal details while you are a guest.\n\nI’m still happy to help with general health questions right now!',
          sourceContext: 'Authentication required',
        };
      }

      const firstName = displayName.split(' ')[0] || 'there';

      if (lower.includes('lab') || lower.includes('test result') || lower.includes('cbc') || lower.includes('blood test')) {
        const labs = activePatient.labReports || [];
        if (labs.length === 0) {
          return {
            text: `No lab panels are on your record yet, ${firstName}. Labs appear here once you or your authorized care team add them (e.g. from the Medical Tests or Health Records sections). I won’t substitute another person’s results for yours.\n\nIn the meantime, I can explain what any lab test measures and what the reference ranges mean — just ask!`,
            sourceContext: `Your personal EHR (MRN: ${activePatient.mrn})`,
          };
        }
        let resp = `Here is the laboratory diagnostic record on YOUR file, ${firstName}:\n\n`;
        labs.forEach((l) => {
          resp += `🧪 **${l.testName}**\n- **Result:** ${l.resultValue} ${l.unit} (Ref: ${l.referenceRange})\n- **Status:** ${l.status}\n- **Date:** ${new Date(l.performedAt).toLocaleDateString()}\n- **Review Status:** ${l.reviewStatus || 'REVIEWED'} by ${l.reviewedBy || 'your care team'}\n- **Physician Note:** ${l.doctorNotes}\n\n`;
        });
        return { text: resp, sourceContext: `Your personal EHR (MRN: ${activePatient.mrn})` };
      }

      if (lower.includes('medication') || lower.includes('prescription') || lower.includes('pills') || lower.includes('drugs')) {
        const meds = activePatient.currentMedications || [];
        if (meds.length === 0 && medicationReminders.length === 0) {
          return {
            text: `There are no medications or prescriptions on YOUR record yet, ${firstName}. Your own medications will appear here as soon as they are added — I never show anyone else’s prescription list.\n\nIf you’d like, tell me the name of a medicine and I can share general educational information about what it treats, common dosing patterns and side effects to discuss with your doctor.`,
            sourceContext: `Your personal EHR (MRN: ${activePatient.mrn})`,
          };
        }
        let resp = `Here are the active medications on YOUR record:\n\n`;
        meds.forEach((m) => {
          resp += `💊 **${m}**\n`;
        });
        if (medicationReminders.length > 0) {
          resp += `\n**Active Dosing Reminders:**\n`;
          medicationReminders.forEach((r) => {
            resp += `• ${r.name} at ${r.time} (${r.takenToday ? '✓ Taken today' : 'Pending'}) - ${r.notes || ''}\n`;
          });
        }
        return { text: resp, sourceContext: `Your personal EHR (MRN: ${activePatient.mrn})` };
      }

      if (lower.includes('vital') || lower.includes('blood pressure') || lower.includes('weight') || lower.includes('bmi') || lower.includes('bp')) {
        const v = activePatient.recentVitals;
        const hasVitals = (v && (v.hr > 0 || !v.bp.startsWith('—'))) || wellness.weightKg > 0 || (activePatient.vitalsHistory || []).length > 0;
        if (!hasVitals) {
          return {
            text: `No vitals have been recorded on YOUR record yet, ${firstName}. Once you log blood pressure, weight or other readings from your Health Dashboard, I can summarize your trends here.\n\nFor general reference: normal resting blood pressure is around 120/80 mmHg, normal resting heart rate is 60–100 BPM, and SpO2 is typically 95% or above. Ask me about any of these in general terms anytime!`,
            sourceContext: `Your personal EHR (MRN: ${activePatient.mrn})`,
          };
        }
        const resp = `Here are the latest vitals on YOUR record:\n\n• **Blood Pressure:** ${v.bp} (Resting)\n• **Heart Rate:** ${v.hr} BPM\n• **Blood Oxygen (SpO2):** ${v.spo2}%\n• **Body Weight:** ${wellness.weightKg} kg (Target: ${wellness.targetWeightKg} kg)\n• **Height:** ${wellness.heightCm} cm\n• **Calculated BMI:** ${+(wellness.weightKg / Math.pow((wellness.heightCm || 175) / 100, 2)).toFixed(1)} kg/m²\n\n*Recorded by you and your authorized care team.*`;
        return { text: resp, sourceContext: `Your personal EHR (MRN: ${activePatient.mrn})` };
      }

      if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('consult')) {
        let resp = `Here are the appointments on YOUR schedule:\n\n`;
        if (appointments.length > 0) {
          appointments.forEach((a) => {
            resp += `📅 **${a.doctorName || 'Attending Physician'}** (${a.type})\n- **Date & Time:** ${a.date} at ${a.time}\n- **Status:** ${a.status}\n- **Location:** ${a.roomOrDesk || 'Clinic Room 302'}\n\n`;
          });
        } else {
          resp += `No appointments are scheduled on your record yet. You can book one from the Appointments section — it will then be saved to your own private schedule.`;
        }
        return { text: resp, sourceContext: 'GlobalHealth Appointment Service' };
      }

      return null;
    },
    [isSignedIn, displayName, activePatient, wellness, medicationReminders, appointments]
  );

  /* ----------------------------------------------------------------
   * Conversation mutation helpers
   * -------------------------------------------------------------- */
  const updateActiveLocal = useCallback((updater: (c: AIConversation) => AIConversation) => {
    if (isSignedIn) {
      setActiveUserConversation((prev) => (prev ? updater(prev) : prev));
    } else {
      setSessionConversation((prev) => updater(prev));
    }
  }, [isSignedIn]);

  const bumpSummary = useCallback((id: string, messageCount: number) => {
    setSummaries((prev) => {
      const existing = prev.find((s) => s.id === id);
      if (!existing) return prev;
      return prev.map((s) => (s.id === id ? { ...s, messageCount, updatedAt: Date.now() } : s));
    });
  }, []);

  const refreshSummaries = useCallback(async (filter: AIHistoryFilter, q: string) => {
    setHistoryStatus('loading');
    setHistoryError(null);
    try {
      const list = await aiChat.listConversations(filter, q);
      setSummaries(list);
      setHistoryStatus('idle');
    } catch (err) {
      setHistoryStatus('error');
      setHistoryError(toErrorKind(err));
    }
  }, []);

  /* ----------------------------------------------------------------
   * Send pipeline
   * -------------------------------------------------------------- */
  const persistMessage = useCallback(
    async (convId: string, msg: AIMessage): Promise<AIMessage> => {
      // Server returns the stored message (server-assigned id + timestamps).
      const stored = await aiChat.appendMessage(convId, msg);
      return stored;
    },
    []
  );

  const runAssistantReply = useCallback(
    async (
      prompt: string,
      systemContext: string,
      conversationHistory: string,
      onDone: (content: string) => void
    ): Promise<{ ok: true; err?: undefined; stopped?: boolean } | { ok: false; err: SendError; stopped: boolean }> => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const response = await aiChat.requestAssistantResponse(
          prompt,
          currentLanguage,
          isSignedIn
            ? { displayName: user!.fullName, mrn: activePatient.mrn, authenticated: true, systemContext, conversationHistory }
            : { authenticated: false, systemContext, conversationHistory },
          controller.signal
        );
        onDone(response);
        return { ok: true };
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === 'AI_STOPPED') return { ok: false, stopped: true, err: { kind: 'unavailable', message: 'Stopped.' } };
        return { ok: false, stopped: false, err: toErrorKind(err) };
      } finally {
        abortRef.current = null;
      }
    },
    [currentLanguage, isSignedIn, user, activePatient.mrn]
  );

  const handleSend = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || loadingReply) return;
      setSendError(null);
      setFailedMessageId(null);
      // Re-submitting a message whose POST may have succeeded but whose
      // response was lost must reuse the SAME idempotency key so the server
      // cannot create a duplicate user message.
      const retrying = pendingSendRef.current?.prompt === text ? pendingSendRef.current : null;
      pendingSendRef.current = null;

      const userMsg: AIMessage = {
        id: retrying?.clientMessageId || createAiMessageId('user'),
        role: 'user',
        content: text,
        createdAt: Date.now(),
      };

      // Signed-in: ensure a conversation exists and persist the user message.
      let convId: string | null = null;
      if (isSignedIn) {
        let conv = activeUserConversation;
        setSaveStatus('saving');
        try {
          if (!conv || conv.messages.length === 0) {
            conv = await aiChat.createConversation({ title: titleFromPrompt(text) });
            setActiveUserConversation(conv);
            setSummaries((prev) => [
              { id: conv!.id, title: conv!.title, messageCount: 0, createdAt: conv!.createdAt, updatedAt: conv!.updatedAt },
              ...prev,
            ]);
          }
          convId = conv.id;
          const stored = await persistMessage(conv.id, userMsg);
          updateActiveLocal((c) => ({ ...c, messages: [...c.messages, stored], updatedAt: Date.now() }));
          bumpSummary(conv.id, conv.messages.length + 1);
          setSaveStatus('saved');
        } catch (err) {
          setSaveStatus('error');
          setSendError(toErrorKind(err));
          pendingSendRef.current = { prompt: text, clientMessageId: userMsg.id };
          return;
        }
      } else {
        updateActiveLocal((c) => ({ ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() }));
      }

      // Safety engine runs FIRST: urgent symptoms get emergency guidance and
      // never continue into a normal knowledge answer.
      const aiContext = buildAssistantContext(text, {
        authenticated: isSignedIn,
        displayName,
        mrn: activePatient.mrn,
        language: currentLanguage,
        recentTopics: messages.slice(-6).map((m) => m.content),
      });
      if (aiContext.safety.risk === 'urgent' && aiContext.safety.emergencyMessage) {
        const safetyBot: AIMessage = {
          id: `bot-safety-${Date.now()}`,
          role: 'assistant',
          content: aiContext.safety.emergencyMessage,
          createdAt: Date.now(),
          sourceContext: 'GlobalHealth Safety Engine',
        };
        updateActiveLocal((c) => ({ ...c, messages: [...c.messages, safetyBot], updatedAt: Date.now() }));
        if (convId) {
          try {
            await persistMessage(convId, safetyBot);
            bumpSummary(convId, (activeUserConversation?.messages.length ?? 0) + 2);
          } catch {
            /* message still shown locally */
          }
        }
        return;
      }

      // EHR-grounded local reply (own record for signed-in; invite for guests).
      const ehr = buildEhrReply(text);
      if (ehr) {
        const bot: AIMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: ehr.text,
          createdAt: Date.now(),
          sourceContext: ehr.sourceContext,
        };
        updateActiveLocal((c) => ({ ...c, messages: [...c.messages, bot], updatedAt: Date.now() }));
        if (convId) {
          try {
            await persistMessage(convId, bot);
            bumpSummary(convId, (activeUserConversation?.messages.length ?? 0) + 2);
          } catch {
            /* reply still shown locally; next load reconciles */
          }
        }
        return;
      }

      // General AI reply.
      setLoadingReply(true);
      const conversationHistory = [...messages, userMsg]
        .slice(-8)
        .map((m) => `${m.role === 'user' ? 'You' : 'GlobalHealth AI'}: ${m.content}`)
        .join('\n');
      const result = await runAssistantReply(text, aiContext.systemContext, conversationHistory, (content) => {
        const bot: AIMessage = {
          id: createAiMessageId('assistant'),
          role: 'assistant',
          content,
          createdAt: Date.now(),
        };
        updateActiveLocal((c) => ({ ...c, messages: [...c.messages, bot], updatedAt: Date.now() }));
        if (convId) {
          persistMessage(convId, bot)
            .then(() => bumpSummary(convId, (activeUserConversation?.messages.length ?? 0) + 2))
            .catch(() => {});
        }
      });
      setLoadingReply(false);

      if (result.ok) return;

      if (result.stopped) {
        // User pressed Stop — nothing to clean up (the reply never appended).
        return;
      }
      // Failed: keep the user message, show a retryable failure in the thread.
      const failedBot: AIMessage = {
        id: `bot-failed-${Date.now()}`,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        failed: true,
      };
      updateActiveLocal((c) => ({ ...c, messages: [...c.messages, failedBot], updatedAt: Date.now() }));
      retryRef.current = { prompt: text };
      setFailedMessageId(failedBot.id);
    },
    [loadingReply, isSignedIn, activeUserConversation, updateActiveLocal, persistMessage, bumpSummary, buildEhrReply, runAssistantReply]
  );

  const handleRetryReply = useCallback(async () => {
    const prompt = retryRef.current?.prompt;
    if (!prompt || loadingReply) return;
    setFailedMessageId(null);
    retryRef.current = null;
    setLoadingReply(true);
    const retryBotId = createAiMessageId('assistant');
    const retryContext = buildAssistantContext(prompt, {
      authenticated: isSignedIn,
      displayName,
      mrn: activePatient.mrn,
      language: currentLanguage,
      recentTopics: messages.slice(-6).map((m) => m.content),
    });
    const history = messages.slice(-8).map((m) => `${m.role === 'user' ? 'You' : 'GlobalHealth AI'}: ${m.content}`).join('\n');
    const result = await runAssistantReply(prompt, retryContext.systemContext, history, (content) => {
      // Replace the failed placeholder with the real reply.
      if (isSignedIn) {
        setActiveUserConversation((prev) => {
          if (!prev) return prev;
          const withoutFailed = prev.messages.filter((m) => m.id !== failedMessageId);
          const bot: AIMessage = { id: retryBotId, role: 'assistant', content, createdAt: Date.now() };
          return { ...prev, messages: [...withoutFailed, bot], updatedAt: Date.now() };
        });
        const convId = activeUserConversation?.id;
        if (convId) {
          aiChat
            .appendMessage(convId, { id: retryBotId, role: 'assistant', content, createdAt: Date.now() })
            .catch(() => {});
        }
      } else {
        setSessionConversation((prev) => {
          const withoutFailed = prev.messages.filter((m) => m.id !== failedMessageId);
          const bot: AIMessage = { id: retryBotId, role: 'assistant', content, createdAt: Date.now() };
          return { ...prev, messages: [...withoutFailed, bot], updatedAt: Date.now() };
        });
      }
    });
    setLoadingReply(false);
    if (!result.ok && !result.stopped) {
      const failedBot: AIMessage = {
        id: `bot-failed-${Date.now()}`,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        failed: true,
      };
      updateActiveLocal((c) => ({ ...c, messages: [...c.messages, failedBot], updatedAt: Date.now() }));
      retryRef.current = { prompt };
      setFailedMessageId(failedBot.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runAssistantReply, loadingReply, isSignedIn, updateActiveLocal, failedMessageId, activeUserConversation?.id]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setLoadingReply(false);
  }, []);

  /* ----------------------------------------------------------------
   * Conversation actions
   * -------------------------------------------------------------- */
  const handleNewChat = useCallback(() => {
    retryRef.current = null;
    pendingSendRef.current = null;
    setFailedMessageId(null);
    setSendError(null);
    setArmedClear(false);
    setShareUrl(null);
    if (isSignedIn) {
      freshRequestedRef.current = true;
      setActiveUserConversation(null);
    } else {
      setSessionConversation(freshConversation());
    }
    setMobileSidebarOpen(false);
  }, [isSignedIn]);

  /** Two-step "Clear chat" — wipes the current conversation. */
  const handleClearChat = useCallback(() => {
    if (!armedClear) {
      setArmedClear(true);
      window.setTimeout(() => setArmedClear(false), 3500);
      return;
    }
    setArmedClear(false);
    retryRef.current = null;
    pendingSendRef.current = null;
    setFailedMessageId(null);
    setSendError(null);
    if (isSignedIn && activeUserConversation) {
      const id = activeUserConversation.id;
      updateActiveLocal((c) => ({ ...c, messages: [], updatedAt: Date.now() }));
      aiChat
        .deleteConversation(id)
        .then(() => {
          setSummaries((prev) => prev.filter((s) => s.id !== id));
          setActiveUserConversation(null);
        })
        .catch((err) => setHistoryError(toErrorKind(err)));
    } else {
      setSessionConversation(freshConversation());
    }
  }, [armedClear, isSignedIn, activeUserConversation, updateActiveLocal]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      if (activeId === id) {
        setMobileSidebarOpen(false);
        return;
      }
      setShareUrl(null);
      try {
        const conv = await aiChat.getConversation(id);
        setActiveUserConversation(conv);
      } catch (err) {
        setHistoryError(toErrorKind(err));
      }
      setMobileSidebarOpen(false);
    },
    [activeId]
  );

  const handleRename = useCallback(
    async (id: string, title: string) => {
      setSummaries((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
      setActiveUserConversation((prev) => (prev && prev.id === id ? { ...prev, title } : prev));
      try {
        await aiChat.renameConversation(id, title);
      } catch (err) {
        setHistoryError(toErrorKind(err));
      }
    },
    []
  );

  const handleToggleSave = useCallback(
    async (id: string) => {
      const target = summaries.find((s) => s.id === id) || (activeUserConversation?.id === id ? activeUserConversation : null);
      const nextSaved = !(target?.isSaved ?? false);
      try {
        const updated = await aiChat.setConversationSaved(id, nextSaved);
        setSummaries((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
        setActiveUserConversation((prev) => (prev && prev.id === id ? { ...prev, isSaved: nextSaved } : prev));
      } catch (err) {
        setHistoryError(toErrorKind(err));
      }
    },
    [summaries, activeUserConversation]
  );

  const handleToggleArchive = useCallback(
    async (id: string, archived?: boolean) => {
      const target = summaries.find((s) => s.id === id);
      const nextArchived = archived ?? !(target?.isArchived ?? false);
      try {
        const updated = await aiChat.setConversationArchived(id, nextArchived);
        setActiveUserConversation((prev) => (prev && prev.id === id ? { ...prev, isArchived: nextArchived } : prev));
        await refreshSummaries(historyFilter, historyQuery);
      } catch (err) {
        setHistoryError(toErrorKind(err));
      }
    },
    [summaries, historyFilter, historyQuery, refreshSummaries]
  );

  const handleRestore = useCallback(
    async (id: string) => {
      try {
        await aiChat.restoreConversation(id);
        if (activeId === id) {
          const conv = await aiChat.getConversation(id);
          setActiveUserConversation(conv);
        }
        await refreshSummaries(historyFilter, historyQuery);
      } catch (err) {
        setHistoryError(toErrorKind(err));
      }
    },
    [activeId, historyFilter, historyQuery, refreshSummaries]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await aiChat.deleteConversation(id);
      } catch (err) {
        setHistoryError(toErrorKind(err));
        return;
      }
      await refreshSummaries(historyFilter, historyQuery);
      if (activeId === id) {
        setShareUrl(null);
        setActiveUserConversation(null);
      }
    },
    [activeId, historyFilter, historyQuery, refreshSummaries]
  );

  const handlePermanentDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('Permanently delete this AI conversation? This cannot be undone.')) return;
      try {
        await aiChat.permanentlyDeleteConversation(id);
      } catch (err) {
        setHistoryError(toErrorKind(err));
        return;
      }
      await refreshSummaries(historyFilter, historyQuery);
      if (activeId === id) {
        setShareUrl(null);
        setActiveUserConversation(null);
      }
    },
    [activeId, historyFilter, historyQuery, refreshSummaries]
  );

  const handleDeleteAll = useCallback(async () => {
    try {
      await aiChat.deleteAllConversations();
    } catch (err) {
      setHistoryError(toErrorKind(err));
      return;
    }
    setShareUrl(null);
    setActiveUserConversation(null);
    await refreshSummaries(historyFilter, historyQuery);
  }, [historyFilter, historyQuery, refreshSummaries]);

  const handleRetryHistory = useCallback(() => {
    void refreshSummaries(historyFilter, historyQuery);
  }, [historyFilter, historyQuery, refreshSummaries]);

  const handleExportChat = useCallback(
    async (format: 'text' | 'json' | 'pdf') => {
      if (!activeId) return;
      try {
        if (format === 'pdf') {
          const result = await aiChat.exportConversation(activeId, 'text');
          aiChat.openChatPdf(result);
        } else {
          const result = await aiChat.exportConversation(activeId, format);
          aiChat.downloadChatExport(result);
        }
      } catch (err) {
        setHistoryError(toErrorKind(err));
      }
    },
    [activeId]
  );

  const handleShareChat = useCallback(async () => {
    if (!activeId) return;
    try {
      const link = await aiChat.createConversationShare(activeId);
      const absolute = new URL(link.url, window.location.origin).toString();
      setShareUrl(absolute);
    } catch (err) {
      setHistoryError(toErrorKind(err));
    }
  }, [activeId]);

  const handleRevokeShare = useCallback(async () => {
    if (!shareUrl) return;
    const token = shareUrl.split('/').pop();
    if (!token) return;
    try {
      await aiChat.revokeConversationShare(token);
      setShareUrl(null);
    } catch (err) {
      setHistoryError(toErrorKind(err));
    }
  }, [shareUrl]);

  const handleFilterChange = useCallback((filter: AIHistoryFilter) => {
    setHistoryFilter(filter);
    void refreshSummaries(filter, historyQuery);
  }, [historyQuery, refreshSummaries]);

  /* ----------------------------------------------------------------
   * Auth gating
   * -------------------------------------------------------------- */
  const openAuthPrompt = useCallback(() => setAuthPromptOpen(true), []);
  const closeAuthPrompt = useCallback(() => setAuthPromptOpen(false), []);

  const handleSaveSession = useCallback(() => {
    if (!isSignedIn && sessionConversation.messages.length > 0) {
      pendingSaveRef.current = sessionConversation.messages;
      openAuthPrompt();
    } else if (!isSignedIn) {
      openAuthPrompt();
    }
  }, [isSignedIn, sessionConversation, openAuthPrompt]);

  const handleAuthLogin = useCallback(() => {
    closeAuthPrompt();
    requireAuth({ feature: 'save your AI conversations to your account' }, 'login');
  }, [closeAuthPrompt, requireAuth]);

  const handleAuthCreate = useCallback(() => {
    closeAuthPrompt();
    requireAuth({ feature: 'save your AI conversations to your account' }, 'signup');
  }, [closeAuthPrompt, requireAuth]);

  const handleContinueGuest = useCallback(() => {
    pendingSaveRef.current = null;
    closeAuthPrompt();
  }, [closeAuthPrompt]);

  const handleSignOut = useCallback(async () => {
    setMobileSidebarOpen(false);
    await onLogout();
  }, [onLogout]);

  /* ----------------------------------------------------------------
   * Render
   * -------------------------------------------------------------- */
  return (
    <div className="bg-slate-100 py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex h-[calc(100dvh-150px)] min-h-[480px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift lg:h-[calc(100dvh-170px)]">
          {/* Sidebar (desktop) */}
          <div className="hidden w-80 shrink-0 border-r border-slate-200 lg:block">
            <AIConversationSidebar
              signedIn={isSignedIn}
              user={userSummary}
              conversations={summaries}
              activeId={activeId}
              loading={historyStatus === 'loading'}
              historyError={historyError}
              filter={historyFilter}
              onFilterChange={handleFilterChange}
              onRetryHistory={handleRetryHistory}
              onSignIn={openAuthPrompt}
              onSelect={handleSelectConversation}
              onNewChat={handleNewChat}
              onRename={handleRename}
              onToggleSave={handleToggleSave}
              onToggleArchive={handleToggleArchive}
              onRestore={handleRestore}
              onDelete={handleDelete}
              onPermanentDelete={handlePermanentDelete}
              onDeleteAll={handleDeleteAll}
              onSaveSession={handleSaveSession}
              onExportChat={handleExportChat}
              onShareChat={handleShareChat}
              shareUrl={shareUrl}
              onRevokeShare={handleRevokeShare}
            />
          </div>

          {/* Chat column */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Workspace header */}
            <header className="flex shrink-0 items-center gap-2.5 border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to GlobalHealth"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <AIAvatar size={40} showStatus />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-[15px] font-extrabold tracking-tight text-slate-900 sm:text-base">
                    GlobalHealth AI
                  </h1>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    Online
                  </span>
                </div>
                <p className="truncate text-[11px] text-slate-500 sm:text-xs">Your personal health information assistant</p>
                {isSignedIn && saveStatus !== 'idle' && (
                  <p className={`mt-0.5 text-[10px] font-bold ${saveStatus === 'saved' ? 'text-emerald-600' : saveStatus === 'error' ? 'text-rose-600' : 'text-slate-400'}`} role="status">
                    {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Failed to save — retry on next message'}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className={`hidden rounded-xl px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 sm:block ${
                      armedClear ? 'bg-rose-600 text-white hover:bg-rose-700' : 'text-rose-500 hover:bg-rose-50'
                    }`}
                  >
                    {armedClear ? 'Confirm clear?' : 'Clear chat'}
                  </button>
                )}
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="hidden rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 sm:block"
                  >
                    Sign out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openAuthPrompt}
                    className="hidden rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 sm:block"
                  >
                    Sign in
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-medical-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-medical-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-600 focus-visible:ring-offset-2"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">New Chat</span>
                  <span className="sm:hidden">New</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open conversation history"
                  aria-haspopup="dialog"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 lg:hidden"
                >
                  <History className="h-4.5 w-4.5" />
                </button>
              </div>
            </header>

            {/* Always-visible disclaimer */}
            <div className="shrink-0 px-3 pt-2.5 sm:px-4">
              <AIDisclaimer />
            </div>

            {/* Messages */}
            <div className="min-h-0 flex-1">
              <AIChat
                messages={messages}
                loading={loadingReply}
                failedMessageId={failedMessageId}
                onRetryMessage={handleRetryReply}
                onPrompt={(p) => {
                  setInjectedPrompt(null);
                  handleSend(p);
                }}
                onNavigate={onNavigate}
                signedIn={isSignedIn}
                displayName={displayName}
                initializing={initializing}
                historyError={historyError}
                onRetryHistory={handleRetryHistory}
                onSignIn={openAuthPrompt}
                sendError={sendError}
                onRetrySend={() => {
                  const pending = pendingSendRef.current;
                  if (pending) handleSend(pending.prompt);
                }}
              />
            </div>

            {/* Sticky input */}
            <AIInput
              onSend={handleSend}
              onStop={handleStop}
              disabled={initializing}
              loading={loadingReply}
              placeholder="Ask GlobalHealth AI…"
              inject={injectedPrompt}
              onInjected={() => setInjectedPrompt(null)}
            />
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          GlobalHealth AI is an AI information assistant — it does not replace a doctor, diagnosis or treatment plan.
        </p>
      </div>

      {/* Mobile history drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Conversation history">
          <button
            type="button"
            aria-label="Close history"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-[1px]"
          />
          <div className="gh-fade-up absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-extrabold text-slate-900">My AI Conversations</h2>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close history"
                className="grid h-11 w-11 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <AIConversationSidebar
                signedIn={isSignedIn}
                user={userSummary}
                conversations={summaries}
                activeId={activeId}
                loading={historyStatus === 'loading'}
                historyError={historyError}
                onRetryHistory={handleRetryHistory}
                onSignIn={openAuthPrompt}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
                onRename={handleRename}
                onDelete={handleDelete}
                onDeleteAll={handleDeleteAll}
                onSaveSession={handleSaveSession}
                onToggleSave={handleToggleSave}
                onToggleArchive={handleToggleArchive}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
                filter={historyFilter}
                onFilterChange={handleFilterChange}
                onExportChat={handleExportChat}
                onShareChat={handleShareChat}
                shareUrl={shareUrl}
                onRevokeShare={handleRevokeShare}
              />
            </div>
          </div>
        </div>
      )}

      {/* Auth gate for persistent features */}
      <AIAuthPrompt
        open={authPromptOpen}
        onClose={closeAuthPrompt}
        onLogin={handleAuthLogin}
        onCreateAccount={handleAuthCreate}
        onContinue={handleContinueGuest}
      />
    </div>
  );
};
