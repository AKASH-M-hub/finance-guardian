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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setSessions(parsed);
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save sessions whenever they change
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
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{
        id: '1',
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
      id: Date.now().toString(),
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
      const currentMessages = [...messages, userMessage];
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
          userProfile: profile,
          analysis,
          streaks,
          goals,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';

      if (reader) {
        const assistantMsgId = (Date.now() + 1).toString();
        
        // Add empty assistant message first
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, {
                id: assistantMsgId,
                role: 'assistant',
                content: '',
                timestamp: new Date().toISOString(),
              }],
            };
          }
          return s;
        }));

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });
          
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);
            
            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;
            
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;
            
            try {
              const json = JSON.parse(jsonStr);
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setSessions(prev => prev.map(s => {
                  if (s.id === activeSessionId) {
                    return {
                      ...s,
                      messages: s.messages.map(m => 
                        m.id === assistantMsgId 
                          ? { ...m, content: assistantMessage }
                          : m
                      ),
                    };
                  }
                  return s;
                }));
              }
            } catch {
              textBuffer = line + '\n' + textBuffer;
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: (Date.now() + 2).toString(),
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
