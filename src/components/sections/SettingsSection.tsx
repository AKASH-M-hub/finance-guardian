import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import GlowCard from '@/components/reactbits/GlowCard';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import ProgressRing from '@/components/reactbits/ProgressRing';
import SpotlightButton from '@/components/reactbits/SpotlightButton';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  History, 
  LogOut, 
  Download, 
  Trash2,
  MessageCircle,
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  Moon,
  Sun
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SettingsSection: React.FC = () => {
  const { profile, analysis, checkIns, goals, clearProfile } = useUserProfile();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    stressAlerts: true,
    weeklyReport: false,
    goalProgress: true,
  });

  useEffect(() => {
    // Load chat history from localStorage
    const savedChats = localStorage.getItem('fyf_chat_history');
    if (savedChats) {
      setChatHistory(JSON.parse(savedChats));
    }

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      clearProfile();
      toast.success('Signed out successfully');
    }
  };

  const handleExportData = () => {
    const exportData = {
      profile,
      analysis,
      chatHistory,
      checkIns,
      goals,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fyf-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleClearChatHistory = () => {
    localStorage.removeItem('fyf_chat_history');
    setChatHistory([]);
    toast.success('Chat history cleared');
  };

  // Generate chart data from check-ins
  const moodChartData = checkIns.slice(0, 14).reverse().map((checkIn, index) => ({
    day: `Day ${index + 1}`,
    mood: checkIn.mood === 'great' ? 100 : checkIn.mood === 'good' ? 75 : checkIn.mood === 'okay' ? 50 : 25,
    budget: checkIn.stayedUnderBudget ? 100 : 50,
  }));

  const goalProgressData = goals.map(goal => ({
    name: goal.name,
    progress: Math.round((goal.currentAmount / goal.targetAmount) * 100),
    target: 100,
  }));

  const categoryData = [
    { name: 'Essentials', value: profile?.totalFixedAmount || 0, color: 'hsl(var(--primary))' },
    { name: 'Savings', value: analysis?.dailyBudget ? analysis.dailyBudget * 30 * 0.2 : 0, color: 'hsl(var(--chart-2))' },
    { name: 'Flexible', value: analysis?.dailyBudget ? analysis.dailyBudget * 30 * 0.5 : 0, color: 'hsl(var(--chart-3))' },
    { name: 'Fun', value: analysis?.dailyBudget ? analysis.dailyBudget * 30 * 0.3 : 0, color: 'hsl(var(--chart-4))' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, view analytics, and access your data
        </p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">Chat History</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InteractiveCard className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                <CountUpNumber end={checkIns.length} duration={1000} />
              </div>
              <p className="text-sm text-muted-foreground">Total Check-ins</p>
            </InteractiveCard>
            
            <InteractiveCard className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                <CountUpNumber end={goals.length} duration={1000} />
              </div>
              <p className="text-sm text-muted-foreground">Active Goals</p>
            </InteractiveCard>
            
            <InteractiveCard className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                <CountUpNumber end={chatHistory.length} duration={1000} />
              </div>
              <p className="text-sm text-muted-foreground">AI Conversations</p>
            </InteractiveCard>
            
            <InteractiveCard className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                <CountUpNumber end={analysis?.healthScore || 0} duration={1000} />%
              </div>
              <p className="text-sm text-muted-foreground">Health Score</p>
            </InteractiveCard>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood & Budget Trend */}
            <GlowCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Mood & Budget Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moodChartData.length > 0 ? moodChartData : [{ day: 'No Data', mood: 0, budget: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      name="Mood"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="budget" 
                      stroke="hsl(var(--chart-2))" 
                      fill="hsl(var(--chart-2))" 
                      fillOpacity={0.2}
                      name="Budget"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>

            {/* Goal Progress */}
            <GlowCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Goal Progress
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={goalProgressData.length > 0 ? goalProgressData : [{ name: 'No Goals', progress: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>

            {/* Spending Distribution */}
            <GlowCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Spending Distribution
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </GlowCard>

            {/* Health Score */}
            <GlowCard className="p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Financial Health Score
              </h3>
              <div className="flex items-center justify-center">
                <ProgressRing 
                  progress={analysis?.healthScore || 0} 
                  size={180}
                  strokeWidth={12}
                />
              </div>
              <p className="mt-4 text-center text-muted-foreground">
                {analysis?.healthScore && analysis.healthScore >= 70 
                  ? "You're doing great! Keep it up!"
                  : analysis?.healthScore && analysis.healthScore >= 40
                  ? "Room for improvement. Check your stress signals."
                  : "Need attention. Consider activating Crisis Mode."}
              </p>
            </GlowCard>
          </div>
        </TabsContent>

        {/* Chat History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Chat History
                </CardTitle>
                <CardDescription>
                  Your conversations with the AI Financial Coach
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearChatHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No chat history yet</p>
                    <p className="text-sm">Start a conversation with your AI coach!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((msg, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary/10 ml-8' 
                            : 'bg-muted mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">
                            {msg.role === 'user' ? 'You' : 'AI Coach'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.email || 'Not signed in'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Account Created</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Preferences
                </h4>
                
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <SpotlightButton
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </SpotlightButton>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Control your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium mb-2">Your Data is Yours</h4>
                  <p className="text-sm text-muted-foreground">
                    We store your financial data locally and securely. You can export or delete it anytime.
                  </p>
                </div>

                <div className="space-y-2">
                  <SpotlightButton
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download All My Data
                  </SpotlightButton>
                  
                  <SpotlightButton
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm('Are you sure? This will reset all your profile data.')) {
                        clearProfile();
                        toast.success('Profile data cleared');
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Profile Data
                  </SpotlightButton>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data We Collect</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Financial profile information (income range, spending style)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Daily check-in responses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Goal and streak progress
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    AI coach conversation history
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;