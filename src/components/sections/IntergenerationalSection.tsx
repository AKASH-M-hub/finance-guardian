import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Ghost, RefreshCw, BookOpen, Target, Dna, TrendingUp, CheckCircle2 } from 'lucide-react';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import GlowCard from '@/components/reactbits/GlowCard';
import RippleButton from '@/components/reactbits/RippleButton';
import type { IntergenerationalProfile, FinancialArchetype } from '@/types/intergenerational';

const archetypeLabels: Record<FinancialArchetype, string> = {
  scarcity_hoarder: 'Scarcity Hoarder',
  generous_giver: 'Generous Giver',
  status_seeker: 'Status Seeker',
  anxious_avoider: 'Anxious Avoider',
  impulsive_spender: 'Impulsive Spender',
  silent_saver: 'Silent Saver',
  debt_normalizer: 'Debt Normalizer',
  wealth_skeptic: 'Wealth Skeptic'
};

const mockProfile: IntergenerationalProfile = {
  familyDNA: {
    archetypes: [
      {
        id: '1',
        archetype: 'scarcity_hoarder',
        matchPercentage: 72,
        inheritedFrom: 'father',
        manifestations: ['Difficulty spending on self', 'Over-saving at expense of quality of life'],
        healthyAspects: ['Financial security awareness', 'Emergency fund discipline'],
        challengingAspects: ['Missing opportunities', 'Guilt around spending']
      },
      {
        id: '2',
        archetype: 'anxious_avoider',
        matchPercentage: 45,
        inheritedFrom: 'mother',
        manifestations: ['Avoiding financial discussions', 'Delayed money decisions'],
        healthyAspects: ['Careful consideration', 'Avoiding impulsive mistakes'],
        challengingAspects: ['Missed deadlines', 'Accumulating problems']
      }
    ],
    dominantTraits: ['Saving orientation', 'Financial anxiety', 'Delayed gratification'],
    riskFactors: ['Over-restriction', 'Financial avoidance', 'Guilt spending'],
    strengths: ['Strong savings habit', 'Debt aversion', 'Long-term thinking'],
    generationalScore: 58,
    researchInsights: [
      'Children of depression-era parents often inherit scarcity mindset',
      'Financial anxiety can be reduced through gradual exposure exercises',
      'Breaking patterns takes 21-66 days of consistent new behavior'
    ]
  },
  ghostBudgets: [
    {
      id: '1',
      category: 'Groceries',
      allocatedAmount: 15000,
      actualNeed: 10000,
      familyOrigin: 'Father always overstocked pantry during childhood',
      unconsciousReason: 'Fear of running out = fear of poverty',
      adjustmentSuggestion: 'Try weekly smaller shops instead of monthly bulk buying'
    },
    {
      id: '2',
      category: 'Clothing',
      allocatedAmount: 2000,
      actualNeed: 5000,
      familyOrigin: 'Mother rarely bought new clothes for herself',
      unconsciousReason: 'Self-denial as virtue',
      adjustmentSuggestion: 'Schedule one planned clothing purchase monthly'
    }
  ],
  debtCycles: [
    {
      id: '1',
      pattern: 'Major purchase debt at age 28-32',
      currentAge: 30,
      parentAge: 31,
      grandparentAge: 29,
      cyclePhase: 'accumulating',
      breakingStrategy: 'Save 50% before financing remaining 50%'
    }
  ],
  moneyStories: [
    {
      id: '1',
      belief: 'Money is hard to come by',
      origin: 'Heard this phrase repeatedly during childhood',
      emotionalCharge: 'negative',
      currentImpact: 'Leads to hoarding behavior and guilt when spending',
      truthPercentage: 40,
      alternativeBelief: 'Money flows when I add value and manage it wisely'
    },
    {
      id: '2',
      belief: 'Rich people are greedy',
      origin: 'Cultural and family messaging',
      emotionalCharge: 'mixed',
      currentImpact: 'Subconscious resistance to wealth building',
      truthPercentage: 20,
      alternativeBelief: 'Wealth can be a tool for positive impact'
    }
  ],
  activeChallenges: [
    {
      id: '1',
      title: 'The Joy Purchase',
      description: 'Buy one small item purely for joy, not necessity',
      targetPattern: 'Self-denial',
      duration: 'weekly',
      difficulty: 'easy',
      completionRate: 75,
      streakDays: 12
    },
    {
      id: '2',
      title: 'Money Talk Tuesday',
      description: 'Discuss finances openly with partner/friend for 10 minutes',
      targetPattern: 'Financial avoidance',
      duration: 'weekly',
      difficulty: 'medium',
      completionRate: 60,
      streakDays: 4
    }
  ],
  legacyGoals: [
    {
      id: '1',
      newPattern: 'Balanced spending with joy',
      replacingPattern: 'Guilt-based restriction',
      progressPercentage: 45,
      milestones: [
        { id: '1', description: 'Identify restriction triggers', completed: true },
        { id: '2', description: 'Complete 10 joy purchases', completed: true },
        { id: '3', description: 'Spend without guilt 5 times', completed: false }
      ],
      impactOnFuture: 'Children will learn healthy relationship with spending'
    }
  ]
};

export const IntergenerationalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dna' | 'ghosts' | 'stories' | 'legacy'>('dna');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Dna className="h-8 w-8 text-purple-500" />
            Intergenerational Pattern Breaker
          </h1>
          <p className="text-muted-foreground mt-1">
            Break free from inherited financial patterns
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Pattern Breaking: <CountUpNumber value={mockProfile.familyDNA.generationalScore} />%
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'dna', label: 'Family DNA', icon: Dna },
          { key: 'ghosts', label: 'Ghost Budgets', icon: Ghost },
          { key: 'stories', label: 'Money Stories', icon: BookOpen },
          { key: 'legacy', label: 'Legacy Builder', icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <RippleButton
            key={key}
            variant={activeTab === key ? 'primary' : 'secondary'}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </RippleButton>
        ))}
      </div>

      {/* Family DNA Tab */}
      {activeTab === 'dna' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor="hsl(var(--primary))">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5" />
                Your Financial Archetypes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProfile.familyDNA.archetypes.map((archetype) => (
                <div key={archetype.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{archetypeLabels[archetype.archetype]}</span>
                    <Badge variant="outline">From {archetype.inheritedFrom}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Progress value={archetype.matchPercentage} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{archetype.matchPercentage}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-primary/10 rounded">
                      <p className="font-medium text-primary mb-1">Strengths:</p>
                      {archetype.healthyAspects.map((a, i) => (
                        <p key={i} className="text-muted-foreground">• {a}</p>
                      ))}
                    </div>
                    <div className="p-2 bg-destructive/10 rounded">
                      <p className="font-medium text-destructive mb-1">Challenges:</p>
                      {archetype.challengingAspects.map((a, i) => (
                        <p key={i} className="text-muted-foreground">• {a}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </GlowCard>

          <Card>
            <CardHeader>
              <CardTitle>Research Insights</CardTitle>
              <CardDescription>Science-backed understanding of your patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockProfile.familyDNA.researchInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ghost Budgets Tab */}
      {activeTab === 'ghosts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockProfile.ghostBudgets.map((ghost) => (
            <Card key={ghost.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ghost className="h-5 w-5" />
                  {ghost.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <p className="text-2xl font-bold">₹{ghost.allocatedAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">You Allocate</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold">₹{ghost.actualNeed.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Actual Need</p>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Family Origin:</p>
                  <p className="text-sm">{ghost.familyOrigin}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Unconscious Driver:</p>
                  <p className="text-sm italic">{ghost.unconsciousReason}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">💡 Suggestion:</p>
                  <p className="text-sm">{ghost.adjustmentSuggestion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Money Stories Tab */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          {mockProfile.moneyStories.map((story) => (
            <Card key={story.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                      <p className="text-xs text-muted-foreground mb-1">Inherited Belief:</p>
                      <p className="text-lg font-medium">"{story.belief}"</p>
                      <p className="text-sm text-muted-foreground mt-2">Origin: {story.origin}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Truth Score:</span>
                      <Progress value={story.truthPercentage} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{story.truthPercentage}%</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                      <p className="text-xs text-muted-foreground mb-1">New Narrative:</p>
                      <p className="text-lg font-medium">"{story.alternativeBelief}"</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Current Impact:</p>
                      <p className="text-sm">{story.currentImpact}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Legacy Builder Tab */}
      {activeTab === 'legacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Active Challenges
              </CardTitle>
              <CardDescription>Weekly micro-challenges to break patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProfile.activeChallenges.map((challenge) => (
                <div key={challenge.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{challenge.title}</span>
                    <Badge>{challenge.streakDays} day streak 🔥</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={challenge.completionRate} className="h-2 flex-1" />
                    <span className="text-xs">{challenge.completionRate}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Legacy Goals
              </CardTitle>
              <CardDescription>New patterns for future generations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProfile.legacyGoals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{goal.newPattern}</p>
                      <p className="text-xs text-muted-foreground">Replacing: {goal.replacingPattern}</p>
                    </div>
                    <ProgressRing progress={goal.progressPercentage} size={60} color="primary" />
                  </div>
                  <div className="space-y-2">
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`h-4 w-4 ${milestone.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={milestone.completed ? '' : 'text-muted-foreground'}>{milestone.description}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    {goal.impactOnFuture}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
