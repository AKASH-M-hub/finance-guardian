import React, { useState } from 'react';
import { Heart, TrendingUp, Shield, Star, Clock, CheckCircle, AlertTriangle, Sparkles, Target, ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/reactbits/GlowCard';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import RippleButton from '@/components/reactbits/RippleButton';
import { createRecoveryPlan, navigateToAICoach } from '@/lib/modalUtils';
import type { 
  StressRecoveryPath, 
  StabilityTimeline, 
  LowPainCostReduction, 
  EssentialExpenseProtection,
  SmallWinSuggestion,
  RelapseRisk,
  RecoveryConfidenceScore,
  PositiveReinforcement
} from '@/types/financialRecovery';

const mockRecoveryPath: StressRecoveryPath = {
  id: '1',
  currentStage: 3,
  totalStages: 5,
  stages: [
    { number: 1, title: 'Awareness', description: 'Acknowledge the financial stress', isCompleted: true, estimatedDays: 3 },
    { number: 2, title: 'Stabilization', description: 'Stop the bleeding - pause non-essentials', isCompleted: true, estimatedDays: 7 },
    { number: 3, title: 'Restructure', description: 'Reorganize budget priorities', isCompleted: false, estimatedDays: 14 },
    { number: 4, title: 'Recovery', description: 'Rebuild emergency buffer', isCompleted: false, estimatedDays: 30 },
    { number: 5, title: 'Resilience', description: 'Establish long-term protection', isCompleted: false, estimatedDays: 60 }
  ],
  startDate: new Date('2024-01-01'),
  estimatedEndDate: new Date('2024-04-15')
};

const mockTimeline: StabilityTimeline = {
  currentStatus: 'recovering',
  daysToStability: 45,
  milestones: [
    { name: 'Emergency fund started', targetDate: new Date('2024-02-01'), isAchieved: true },
    { name: 'Credit card debt reduced 25%', targetDate: new Date('2024-02-15'), isAchieved: true },
    { name: 'Monthly savings automated', targetDate: new Date('2024-03-01'), isAchieved: false },
    { name: 'Full stability achieved', targetDate: new Date('2024-04-15'), isAchieved: false }
  ],
  confidenceLevel: 72
};

const mockCostReductions: LowPainCostReduction[] = [
  { id: '1', category: 'Streaming Services', currentSpend: 1500, suggestedReduction: 800, painLevel: 'minimal', implementationTip: 'Switch to one family plan instead of multiple', annualSavings: 9600 },
  { id: '2', category: 'Food Delivery', currentSpend: 4000, suggestedReduction: 2000, painLevel: 'low', implementationTip: 'Limit to weekends only, meal prep weekdays', annualSavings: 24000 },
  { id: '3', category: 'Gym Membership', currentSpend: 2500, suggestedReduction: 1500, painLevel: 'moderate', implementationTip: 'Switch to home workouts or outdoor runs temporarily', annualSavings: 18000 }
];

const mockEssentials: EssentialExpenseProtection[] = [
  { category: 'food', monthlyAmount: 12000, isProtected: true, minimumRequired: 10000, currentAllocation: 12000 },
  { category: 'rent', monthlyAmount: 25000, isProtected: true, minimumRequired: 25000, currentAllocation: 25000 },
  { category: 'transport', monthlyAmount: 5000, isProtected: true, minimumRequired: 4000, currentAllocation: 5000 },
  { category: 'healthcare', monthlyAmount: 2000, isProtected: true, minimumRequired: 2000, currentAllocation: 2000 },
  { category: 'utilities', monthlyAmount: 3000, isProtected: true, minimumRequired: 2500, currentAllocation: 3000 }
];

const mockSmallWins: SmallWinSuggestion[] = [
  { id: '1', title: 'Cancel unused subscription', description: 'You haven\'t used Netflix in 45 days', difficulty: 'easy', estimatedSavings: 649, timeToComplete: '2 mins', confidenceBoost: 15 },
  { id: '2', title: 'Negotiate phone bill', description: 'Your carrier has a loyalty discount', difficulty: 'moderate', estimatedSavings: 300, timeToComplete: '15 mins', confidenceBoost: 20 },
  { id: '3', title: 'Pack lunch tomorrow', description: 'Save ₹250 by bringing food from home', difficulty: 'easy', estimatedSavings: 250, timeToComplete: '30 mins', confidenceBoost: 10 }
];

const mockRelapseRisk: RelapseRisk = {
  riskLevel: 'moderate',
  riskScore: 42,
  triggerFactors: ['Upcoming birthday party', 'Sale season approaching', 'Incomplete budget setup'],
  preventionSuggestions: ['Set spending limit for party', 'Unsubscribe from sale emails', 'Complete budget categories'],
  lastAssessment: new Date()
};

const mockConfidenceScore: RecoveryConfidenceScore = {
  score: 68,
  previousScore: 55,
  trend: 'improving',
  keyFactors: [
    { factor: 'Consistent savings', contribution: 25, status: 'positive' },
    { factor: 'Reduced impulse spending', contribution: 20, status: 'positive' },
    { factor: 'Emergency fund progress', contribution: 15, status: 'positive' },
    { factor: 'Credit card balance', contribution: -10, status: 'negative' },
    { factor: 'Income stability', contribution: 18, status: 'positive' }
  ],
  nextMilestone: 'Debt-free credit card',
  distanceToStability: 32
};

const mockReinforcements: PositiveReinforcement[] = [
  { id: '1', message: '🎉 You saved ₹2,500 more than last week!', achievement: 'Savings streak', timestamp: new Date(), impactScore: 8 },
  { id: '2', message: '💪 No impulse purchases for 5 days straight!', achievement: 'Self-control champion', timestamp: new Date(), impactScore: 9 },
  { id: '3', message: '🌟 Your stress score improved by 15 points!', achievement: 'Stress reducer', timestamp: new Date(), impactScore: 7 }
];

const FinancialRecoverySection: React.FC = () => {
  const [showAllWins, setShowAllWins] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [planSuccess, setPlanSuccess] = useState(false);
  const [aiCoachNavigated, setAiCoachNavigated] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stressed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'recovering': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'stable': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'thriving': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPainLevelColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'text-emerald-400';
      case 'low': return 'text-amber-400';
      case 'moderate': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-emerald-400" />
            Financial Recovery Intelligence Engine
          </h2>
          <p className="text-muted-foreground mt-1">Gentle guidance to recover from financial stress - no punishment, just progress</p>
        </div>
        <Badge className={getStatusColor(mockTimeline.currentStatus)}>
          {mockTimeline.currentStatus.toUpperCase()}
        </Badge>
      </div>

      {/* Recovery Confidence Score - Hero Card */}
      <GlowCard className="p-6" glowColor="rgba(16, 185, 129, 0.3)">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Recovery Confidence Score
          </h3>
          <Badge className={mockConfidenceScore.trend === 'improving' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
            {mockConfidenceScore.trend === 'improving' ? '↑ Improving' : '→ Stable'}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <ProgressRing 
              progress={mockConfidenceScore.score} 
              size={160} 
              strokeWidth={14}
              color={mockConfidenceScore.score > 60 ? 'success' : 'warning'}
            >
              <div className="text-center">
                <CountUpNumber value={mockConfidenceScore.score} className="text-4xl font-bold text-foreground" />
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </ProgressRing>
            <p className="text-sm text-muted-foreground mt-2">
              +{mockConfidenceScore.score - mockConfidenceScore.previousScore} from last week
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground mb-3">Key Contributing Factors:</p>
              {mockConfidenceScore.keyFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{factor.factor}</span>
                  <span className={factor.status === 'positive' ? 'text-emerald-400' : 'text-red-400'}>
                    {factor.contribution > 0 ? '+' : ''}{factor.contribution}%
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-border/50 mt-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm">Next milestone: <strong>{mockConfidenceScore.nextMilestone}</strong></span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockConfidenceScore.distanceToStability}% away from full stability
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Positive Reinforcement Messages */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {mockReinforcements.map((msg) => (
          <Card key={msg.id} className="flex-shrink-0 bg-emerald-500/10 border-emerald-500/30 min-w-[250px]">
            <CardContent className="p-4">
              <p className="text-sm font-medium">{msg.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{msg.achievement}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recovery Path & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              Stress Recovery Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecoveryPath.stages.map((stage, idx) => (
                <div 
                  key={stage.number}
                  className={`flex items-center gap-3 p-2 rounded-lg ${stage.isCompleted ? 'bg-emerald-500/10' : idx === mockRecoveryPath.currentStage - 1 ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stage.isCompleted ? 'bg-emerald-500 text-white' : idx === mockRecoveryPath.currentStage - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {stage.isCompleted ? <CheckCircle className="h-4 w-4" /> : stage.number}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{stage.title}</p>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{stage.estimatedDays}d</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              Stability Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <CountUpNumber value={mockTimeline.daysToStability} className="text-4xl font-bold text-purple-400" />
              <p className="text-sm text-muted-foreground">days to estimated stability</p>
              <Progress value={mockTimeline.confidenceLevel} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{mockTimeline.confidenceLevel}% confidence</p>
            </div>
            <div className="space-y-2">
              {mockTimeline.milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {milestone.isAchieved ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className={milestone.isAchieved ? 'text-muted-foreground line-through' : 'text-foreground'}>
                    {milestone.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Small Wins & Essential Protection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Small-Win Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSmallWins.map((win) => (
                <div key={win.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{win.title}</p>
                    <Badge variant="outline" className="text-xs">{win.difficulty}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{win.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400">Save ₹{win.estimatedSavings}</span>
                    <span className="text-muted-foreground">{win.timeToComplete}</span>
                    <span className="text-primary">+{win.confidenceBoost}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              Essential Expense Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEssentials.map((essential, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${essential.isProtected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-sm capitalize">{essential.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">₹{essential.currentAllocation.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      (min: ₹{essential.minimumRequired.toLocaleString()})
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  All essentials protected during recovery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low-Pain Cost Reductions */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            Low-Pain Cost Reduction Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCostReductions.map((reduction) => (
              <div key={reduction.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{reduction.category}</p>
                    <p className={`text-xs ${getPainLevelColor(reduction.painLevel)}`}>
                      Pain level: {reduction.painLevel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">
                      -₹{reduction.suggestedReduction.toLocaleString()}/mo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{reduction.annualSavings.toLocaleString()}/year
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  {reduction.implementationTip}
                </p>
              </div>
            ))}
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Potential Savings</span>
                <span className="text-xl font-bold text-emerald-400">
                  ₹{mockCostReductions.reduce((sum, r) => sum + r.annualSavings, 0).toLocaleString()}/year
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relapse Risk Monitor */}
      <Card className={`border ${mockRelapseRisk.riskLevel === 'moderate' ? 'border-amber-500/30 bg-amber-500/5' : mockRelapseRisk.riskLevel === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${mockRelapseRisk.riskLevel === 'moderate' ? 'text-amber-400' : mockRelapseRisk.riskLevel === 'high' ? 'text-red-400' : 'text-emerald-400'}`} />
            Relapse Risk Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <ProgressRing 
                  progress={mockRelapseRisk.riskScore} 
                  size={80} 
                  strokeWidth={8}
                  color={mockRelapseRisk.riskLevel === 'low' ? 'success' : mockRelapseRisk.riskLevel === 'moderate' ? 'warning' : 'danger'}
                >
                  <span className="text-lg font-bold">{mockRelapseRisk.riskScore}%</span>
                </ProgressRing>
                <div>
                  <p className="font-medium capitalize">{mockRelapseRisk.riskLevel} Risk</p>
                  <p className="text-xs text-muted-foreground">Last assessed: Just now</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Trigger Factors:</p>
                <div className="flex flex-wrap gap-1">
                  {mockRelapseRisk.triggerFactors.map((factor, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{factor}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Prevention Suggestions:</p>
              <div className="space-y-2">
                {mockRelapseRisk.preventionSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
          <DialogTrigger asChild>
            <RippleButton variant="primary">
              <Target className="h-4 w-4 mr-2" />
              Start Recovery Plan
            </RippleButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Your Recovery Plan</DialogTitle>
              <DialogDescription>
                Begin your journey to financial stability
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium mb-2">Recovery Stages:</p>
                <ul className="space-y-2 text-sm">
                  {mockRecoveryPath.stages.map((stage) => (
                    <li key={stage.number} className="flex items-center gap-2">
                      {stage.isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                      )}
                      <span>{stage.number}. {stage.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Estimated Duration:</p>
                <p className="font-bold text-lg">{mockRecoveryPath.stages.reduce((sum, s) => sum + s.estimatedDays, 0)} days</p>
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  const plan = createRecoveryPlan({
                    type: 'financial_recovery',
                    duration: mockRecoveryPath.stages.reduce((sum, s) => sum + s.estimatedDays, 0),
                    milestones: mockRecoveryPath.stages.map((s, i) => ({
                      day: mockRecoveryPath.stages.slice(0, i).reduce((sum, x) => sum + x.estimatedDays, 0),
                      goal: s.title,
                      target: s.number,
                    })),
                    actionItems: mockRecoveryPath.stages.map(s => s.description),
                  });
                  if (plan) {
                    setPlanSuccess(true);
                    setTimeout(() => {
                      setPlanDialogOpen(false);
                      setPlanSuccess(false);
                    }, 1500);
                  }
                }}
              >
                {planSuccess ? <><Check className="h-4 w-4 mr-2" /> Started!</> : 'Start Recovery Plan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <RippleButton 
          variant="secondary"
          onClick={() => {
            navigateToAICoach();
            setAiCoachNavigated(true);
          }}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Talk to AI Coach
        </RippleButton>
      </div>
    </div>
  );
};

export default FinancialRecoverySection;
