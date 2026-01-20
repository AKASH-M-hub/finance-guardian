import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlowCard from '@/components/reactbits/GlowCard';
import ShimmerButton from '@/components/reactbits/ShimmerButton';
import AnimatedCounter from '@/components/reactbits/AnimatedCounter';
import GradientText from '@/components/reactbits/GradientText';
import { incomeRangeToNumber } from '@/types/userProfile';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Target, 
  Flame, 
  Calendar,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Circle,
  Gift,
  Zap,
  Trophy,
  Plus,
  Clock,
  Check
} from 'lucide-react';

const AICoachSection: React.FC = () => {
  const { profile, analysis, streaks, checkIns, goals, addCheckIn, addGoal, updateGoalProgress } = useUserProfile();
  const { toast } = useToast();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: 10000,
    deadline: '',
    category: 'emergency_fund' as const,
  });
  const [dailyMood, setDailyMood] = useState<'great' | 'good' | 'okay' | 'stressed' | 'anxious'>('okay');
  const [dailySpend, setDailySpend] = useState('');
  const [roundOffActive, setRoundOffActive] = useState(() => {
    return localStorage.getItem('fyf_roundoff_savings') === 'true';
  });
  const [roundOffTotal, setRoundOffTotal] = useState(() => {
    return parseInt(localStorage.getItem('fyf_roundoff_total') || '0', 10);
  });

  if (!profile || !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Complete onboarding to access AI Coach features</p>
      </div>
    );
  }

  const income = incomeRangeToNumber(profile.monthlyIncomeRange);

  // Weekly survival plan based on analysis
  const weeklyPlan = {
    dailyBudget: analysis.dailyBudget,
    weeklyBudget: analysis.weeklyBudget,
    priorityActions: analysis.recommendations.slice(0, 3),
    savedSoFar: checkIns.reduce((sum, c) => sum + (c.stayedUnderBudget ? analysis.dailyBudget * 0.1 : 0), 0),
  };

  // Round-off savings simulation
  const roundOffSavings = Math.round(analysis.dailyBudget * 0.05 * 30); // 5% of daily budget

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount > 0) {
      const dailyAmount = Math.round(newGoal.targetAmount / 30);
      addGoal({
        title: newGoal.title,
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        deadline: newGoal.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: newGoal.category,
        microGoals: [
          { id: '1', title: `Save ₹${dailyAmount} today`, amount: dailyAmount, isCompleted: false, dueDate: new Date().toISOString() },
          { id: '2', title: `Save ₹${dailyAmount * 7} this week`, amount: dailyAmount * 7, isCompleted: false, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        ],
      });
      setNewGoal({ title: '', targetAmount: 10000, deadline: '', category: 'emergency_fund' });
      setShowAddGoal(false);
    }
  };

  const handleDailyCheckIn = () => {
    const spent = parseFloat(dailySpend) || 0;
    addCheckIn({
      date: new Date().toISOString(),
      mood: dailyMood,
      spentToday: spent,
      stayedUnderBudget: spent <= analysis.dailyBudget,
    });
    setDailySpend('');
  };

  const streakIcons = {
    under_budget: Flame,
    no_impulse: Zap,
    savings_daily: TrendingUp,
    check_in: CheckCircle2,
  };

  const streakLabels = {
    under_budget: 'Under Budget',
    no_impulse: 'No Impulse',
    savings_daily: 'Daily Savings',
    check_in: 'Check-in',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <GradientText>AI Personal Coach</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">Your personalized financial wellness guide</p>
        </div>
      </div>

      {/* Stress Explanation Engine */}
      <GlowCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Why Your Stress Score is {analysis.stressScore}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <AnimatedCounter value={analysis.stressScore} className="text-3xl font-bold text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Top contributing factors:</p>
              <div className="space-y-2">
                {analysis.silentBurdenIndex > 50 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-sm">{analysis.silentBurdenIndex}% of income goes to fixed expenses</span>
                  </div>
                )}
                {profile.reachZeroFrequency !== 'never' && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm">You {profile.reachZeroFrequency} reach zero before salary</span>
                  </div>
                )}
                {profile.emergencyReadiness !== 'can_handle' && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm">Emergency readiness: {profile.emergencyReadiness.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </GlowCard>

      {/* Weekly Survival Plan */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Survival Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-500/10">
              <p className="text-sm text-muted-foreground">Daily Budget</p>
              <p className="text-2xl font-bold text-emerald-600">₹<AnimatedCounter value={weeklyPlan.dailyBudget} /></p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <p className="text-sm text-muted-foreground">Weekly Budget</p>
              <p className="text-2xl font-bold text-primary">₹<AnimatedCounter value={weeklyPlan.weeklyBudget} /></p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Priority Actions This Week:</p>
            <div className="space-y-2">
              {weeklyPlan.priorityActions.map((action, i) => (
                <div key={action.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Check-In */}
      <Card className="border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            15-Second Daily Check-In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">How are you feeling about money today?</p>
            <div className="flex flex-wrap gap-2">
              {(['great', 'good', 'okay', 'stressed', 'anxious'] as const).map((mood) => (
                <Button
                  key={mood}
                  variant={dailyMood === mood ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDailyMood(mood)}
                  className="capitalize"
                >
                  {mood === 'great' && '😊'} {mood === 'good' && '🙂'} {mood === 'okay' && '😐'} 
                  {mood === 'stressed' && '😟'} {mood === 'anxious' && '😰'} {mood}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="How much did you spend today?"
              value={dailySpend}
              onChange={(e) => setDailySpend(e.target.value)}
              className="flex-1"
            />
            <ShimmerButton onClick={handleDailyCheckIn} disabled={!dailySpend}>
              Check In
            </ShimmerButton>
          </div>
          
          {checkIns.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Last check-in: {new Date(checkIns[0].date).toLocaleDateString()} - 
              {checkIns[0].stayedUnderBudget ? ' ✅ Under budget!' : ' 📊 Over budget'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Gamified Streaks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {streaks.map((streak) => {
          const Icon = streakIcons[streak.type];
          return (
            <Card key={streak.id} className={streak.currentDays > 0 ? 'border-amber-500/50 bg-amber-500/5' : ''}>
              <CardContent className="p-4 text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${streak.currentDays > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={streak.currentDays} />
                </p>
                <p className="text-xs text-muted-foreground">{streakLabels[streak.type]} Streak</p>
                {streak.longestDays > 0 && (
                  <p className="text-xs text-primary mt-1">Best: {streak.longestDays} days</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Micro-Savings Challenge */}
      <GlowCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Micro-Savings Auto Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Round-off Savings {roundOffActive ? 'Accumulated' : 'Potential'}</span>
              <Badge variant={roundOffActive ? 'default' : 'secondary'}>
                {roundOffActive ? 'Active' : 'Simulated'}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-primary">
              ₹<AnimatedCounter value={roundOffActive ? roundOffTotal : roundOffSavings} />{roundOffActive ? '' : '/month'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {roundOffActive 
                ? `Total saved since activation • ₹${roundOffSavings}/month potential`
                : 'By rounding up each transaction to the nearest ₹10'}
            </p>
          </div>
          
          {roundOffActive ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    const simulated = Math.floor(Math.random() * 50) + 5;
                    const newTotal = roundOffTotal + simulated;
                    setRoundOffTotal(newTotal);
                    localStorage.setItem('fyf_roundoff_total', newTotal.toString());
                    toast({
                      title: `+₹${simulated} saved!`,
                      description: 'Round-off from your last transaction',
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Simulate Transaction
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (roundOffTotal > 0 && goals.length > 0) {
                      const firstGoal = goals[0];
                      updateGoalProgress(firstGoal.id, roundOffTotal);
                      toast({
                        title: 'Transferred to goal!',
                        description: `₹${roundOffTotal} added to "${firstGoal.title}"`,
                      });
                      setRoundOffTotal(0);
                      localStorage.setItem('fyf_roundoff_total', '0');
                    } else if (goals.length === 0) {
                      toast({
                        title: 'No goals found',
                        description: 'Create a goal first to transfer savings',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  Transfer to Goal
                </Button>
              </div>
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground"
                onClick={() => {
                  setRoundOffActive(false);
                  localStorage.setItem('fyf_roundoff_savings', 'false');
                  toast({
                    title: 'Round-off savings deactivated',
                    description: 'You can reactivate anytime',
                  });
                }}
              >
                Deactivate Round-Off
              </Button>
            </div>
          ) : (
            <ShimmerButton 
              className="w-full"
              onClick={() => {
                setRoundOffActive(true);
                localStorage.setItem('fyf_roundoff_savings', 'true');
                toast({
                  title: '🎉 Round-off savings activated!',
                  description: 'We\'ll round up your transactions and save the difference.',
                });
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Activate Round-Off Savings
            </ShimmerButton>
          )}
        </CardContent>
      </GlowCard>

      {/* Goal-Based Coaching */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Financial Goals
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAddGoal(!showAddGoal)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddGoal && (
            <div className="p-4 rounded-lg border border-dashed border-primary/50 space-y-3">
              <Input
                placeholder="Goal title (e.g., Emergency Fund)"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <div>
                <label className="text-sm text-muted-foreground">Target Amount: ₹{newGoal.targetAmount.toLocaleString()}</label>
                <Slider
                  value={[newGoal.targetAmount]}
                  onValueChange={([v]) => setNewGoal({ ...newGoal, targetAmount: v })}
                  min={1000}
                  max={100000}
                  step={1000}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <ShimmerButton onClick={handleAddGoal} className="flex-1">Create Goal</ShimmerButton>
                <Button variant="ghost" onClick={() => setShowAddGoal(false)}>Cancel</Button>
              </div>
            </div>
          )}
          
          {goals.length === 0 && !showAddGoal && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No goals yet. Create your first savings goal!</p>
            </div>
          )}
          
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="p-4 rounded-lg border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-medium">{goal.title}</span>
                  </div>
                  <Badge variant={progress >= 100 ? 'default' : 'secondary'}>
                    {progress >= 100 ? 'Completed!' : `${Math.round(progress)}%`}
                  </Badge>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{goal.currentAmount.toLocaleString()}</span>
                  <span>₹{goal.targetAmount.toLocaleString()}</span>
                </div>
                
                {/* Micro-goals */}
                <div className="mt-3 space-y-1">
                  {goal.microGoals.map((micro) => (
                    <div key={micro.id} className="flex items-center gap-2 text-sm">
                      {micro.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={micro.isCompleted ? 'line-through text-muted-foreground' : ''}>
                        {micro.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateGoalProgress(goal.id, 500)}
                  >
                    +₹500
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateGoalProgress(goal.id, 1000)}
                  >
                    +₹1000
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoachSection;
