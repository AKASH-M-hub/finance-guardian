import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlowCard from '@/components/reactbits/GlowCard';
import ShimmerButton from '@/components/reactbits/ShimmerButton';
import GradientText from '@/components/reactbits/GradientText';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import TypewriterText from '@/components/reactbits/TypewriterText';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import { getCurrentUser } from '@/integrations/supabase';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  History,
  Settings,
  BarChart3,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  Calendar,
  Trash2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  lastUpdated: string;
}

const CHAT_HISTORY_KEY = 'fyf_chat_history';

const AICoachChatSection: React.FC = () => {
  const { profile, analysis, streaks, goals } = useUserProfile();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { user } = await getCurrentUser();
      if (user) {
        // User loaded - optional for future analytics
      }
    };
    getUser();
  }, []);

  // Load chat history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory) as ChatSession[];

      // Migrate any legacy numeric IDs to UUIDs to satisfy DB schema
      const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
      let mutated = false;
      const migrated = parsed.map((s) => {
        let newId = s.id;
        if (!isUuid(newId)) {
          newId = crypto.randomUUID();
          mutated = true;
        }

        const newMessages = s.messages.map((m) => ({
          ...m,
          id: isUuid(m.id) ? m.id : crypto.randomUUID(),
        }));

        return { ...s, id: newId, messages: newMessages };
      });

      if (mutated) {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(migrated));
      }

      setSessions(migrated);
      if (migrated.length > 0) {
        setActiveSessionId(migrated[0].id);
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "👋 Hi! I'm your AI Financial Coach. I've analyzed your profile and I'm here to help you understand your financial situation. Ask me anything about your finances, stress score, or how to build better money habits!",
        timestamp: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining[0]?.id ?? null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Update session with user message
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = s.messages.length <= 1 ? input.trim().slice(0, 30) + '...' : s.title;
        return {
          ...s,
          title: newTitle,
          messages: [...s.messages, userMessage],
          lastUpdated: new Date().toISOString(),
        };
      }
      return s;
    }));

    setInput('');
    setIsLoading(true);
    setShowTypewriter(true);

    try {
      // Build personalized system context from user profile
      const hasProfile = profile && (profile.monthlyIncomeRange || profile.incomeType);
      const hasAnalysis = analysis && (analysis.weeklyBudget || analysis.dailyBudget);
      const hasGoals = goals.length > 0;

      let systemPrompt = '';
      
      if (hasProfile || hasAnalysis || hasGoals) {
        // User has data - provide personalized coaching
        const userData = [];
        if (profile?.monthlyIncomeRange) userData.push(`Income Range: ${profile.monthlyIncomeRange}`);
        if (profile?.incomeType) userData.push(`Income Type: ${profile.incomeType}`);
        if (profile?.spendingStyle) userData.push(`Spending Style: ${profile.spendingStyle}`);
        if (analysis?.riskLevel) userData.push(`Risk Level: ${analysis.riskLevel}`);
        if (analysis?.weeklyBudget) userData.push(`Weekly Budget: ₹${analysis.weeklyBudget}`);
        if (analysis?.dailyBudget) userData.push(`Daily Budget: ₹${analysis.dailyBudget}`);
        if (analysis?.stressScore) userData.push(`Stress Score: ${analysis.stressScore}%`);
        if (analysis?.survivalDays) userData.push(`Survival Days: ${analysis.survivalDays}`);
        if (analysis?.silentBurdenIndex) userData.push(`Silent Burden: ${analysis.silentBurdenIndex}%`);
        if (hasGoals) userData.push(`Goals: ${goals.map(g => `${g.title} (₹${g.currentAmount}/₹${g.targetAmount})`).join(', ')}`);
        if (analysis?.activeSignals?.length) userData.push(`Stress Signals: ${analysis.activeSignals.map(s => s.type).join(', ')}`);
        
        systemPrompt = `You are a helpful AI financial assistant. Answer the user's question directly and concisely.

AVAILABLE USER DATA:
${userData.join('\n')}

INSTRUCTIONS:
- Answer ONLY what the user asks
- Keep responses brief and focused
- Reference their data ONLY if relevant to their specific question
- Don't ask for more information - use what's available
- Don't list all their data unless they ask for it
- Be conversational and helpful`;
      } else {
        // No profile data - just answer their questions
        systemPrompt = `You are a helpful AI financial assistant. Answer the user's questions directly and concisely. Keep responses brief and focused on what they ask. Don't request information - just provide helpful answers.`;
      }

      const currentMessages = [...messages, userMessage];
      
      // Call OpenRouter directly from frontend with personalized context
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...currentMessages.map(m => ({ role: m.role, content: m.content }))
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error:', errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content || "I received your message!";

      const assistantMsgId = crypto.randomUUID();
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: assistantMsgId,
              role: 'assistant',
              content: content,
              timestamp: new Date().toISOString(),
            }],
          };
        }
        return s;
      }));
    } catch (error) {
      console.error('Chat error:', error);
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: "I'm having trouble connecting right now. Please try again in a moment.",
              timestamp: new Date().toISOString(),
            }],
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
      setShowTypewriter(false);
    }
  };

  const quickPrompts = [
    { label: "Why is my stress score high?", icon: AlertTriangle },
    { label: "Create a weekly budget plan", icon: Calendar },
    { label: "How to build an emergency fund?", icon: PiggyBank },
    { label: "Help me reduce impulse spending", icon: TrendingUp },
  ];

  const formatMessageContent = (content: string) => {
    // Format markdown-like content
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## ')) {
          return <h3 key={i} className="text-lg font-bold mt-3 mb-2">{line.slice(3)}</h3>;
        }
        if (line.startsWith('### ')) {
          return <h4 key={i} className="text-base font-semibold mt-2 mb-1">{line.slice(4)}</h4>;
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
        }
        if (line.startsWith('✅') || line.startsWith('⚠️') || line.startsWith('💡') || line.startsWith('📊')) {
          return <p key={i} className="py-1">{line}</p>;
        }
        if (line.match(/^\d+\./)) {
          return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\./, '').trim()}</li>;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i}>{line}</p>;
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            <GradientText>AI Financial Coach</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">Your personal finance companion - no judgment, just help</p>
        </div>
        <ShimmerButton onClick={createNewSession}>
          <MessageCircle className="h-4 w-4 mr-2" />
          New Chat
        </ShimmerButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InteractiveCard className="p-4">
          <div className="flex items-center gap-3">
            <ProgressRing progress={100 - (analysis?.stressScore ?? 50)} size={50} strokeWidth={5} color={analysis?.stressScore && analysis.stressScore > 60 ? 'danger' : 'primary'}>
              <span className="text-xs font-bold">{100 - (analysis?.stressScore ?? 50)}</span>
            </ProgressRing>
            <div>
              <p className="text-xs text-muted-foreground">Health Score</p>
              <p className="font-bold">{analysis?.healthScore ?? 50}%</p>
            </div>
          </div>
        </InteractiveCard>
        
        <InteractiveCard className="p-4">
          <div className="flex items-center gap-3">
            <PiggyBank className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">Daily Budget</p>
              <p className="font-bold">₹<CountUpNumber value={analysis?.dailyBudget ?? 0} /></p>
            </div>
          </div>
        </InteractiveCard>
        
        <InteractiveCard className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Survival Days</p>
              <p className="font-bold">{analysis?.survivalDays ?? 0} days</p>
            </div>
          </div>
        </InteractiveCard>
        
        <InteractiveCard className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Active Streaks</p>
              <p className="font-bold">{streaks.filter(s => s.currentDays > 0).length}</p>
            </div>
          </div>
        </InteractiveCard>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat History Sidebar */}
        <Card className="lg:col-span-1 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" />
              Chat History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group',
                      session.id === activeSessionId 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-muted'
                    )}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <GlowCard className="lg:col-span-3 flex flex-col min-h-[70vh] h-auto">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Coach Chat</CardTitle>
                  <p className="text-xs text-muted-foreground">No Shame Mode Active 💚</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {analysis?.riskLevel === 'crisis' ? '🔴 Crisis' : 
                 analysis?.riskLevel === 'watch' ? '🟡 Watch' : '🟢 Healthy'}
              </Badge>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-xl px-4 py-3 text-sm',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {formatMessageContent(msg.content)}
                    </div>
                    <p className="text-[10px] opacity-50 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-xl px-4 py-3">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 border-t pt-2">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(prompt.label);
                      inputRef.current?.focus();
                    }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <prompt.icon className="h-3 w-3" />
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances, stress score, or get advice..."
                disabled={isLoading}
                className="flex-1"
              />
              <ShimmerButton
                type="submit"
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </ShimmerButton>
            </form>
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

export default AICoachChatSection;
