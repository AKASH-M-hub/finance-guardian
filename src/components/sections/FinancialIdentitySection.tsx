import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Shield, Sparkles, Brain, Lightbulb, BookOpen, TrendingUp, Check } from 'lucide-react';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import GlowCard from '@/components/reactbits/GlowCard';
import RippleButton from '@/components/reactbits/RippleButton';
import type { FinancialIdentityProfile } from '@/types/financialIdentity';

const mockProfile: FinancialIdentityProfile = {
  selfWorthDecoupler: {
    id: '1',
    currentNetWorth: 150000,
    selfWorthScore: 78,
    lastAffirmation: "Your creativity and kindness define you, not your bank balance.",
    decouplingStrength: 'moderate',
    dailyReminders: [
      "Money is a tool, not a measure of your value",
      "Financial setbacks don't define your character",
      "You are worthy regardless of your account balance"
    ]
  },
  identityPreservations: [
    { id: '1', hobby: 'Photography', lowCostAlternative: 'Mobile photography walks', estimatedCost: 0, identityTrait: 'Creative', lastEngaged: new Date() },
    { id: '2', hobby: 'Fitness', lowCostAlternative: 'Home workouts & park runs', estimatedCost: 0, identityTrait: 'Health-conscious', lastEngaged: new Date() },
    { id: '3', hobby: 'Reading', lowCostAlternative: 'Library membership', estimatedCost: 100, identityTrait: 'Intellectual', lastEngaged: new Date() }
  ],
  evenIfScenarios: [
    { id: '1', financialSituation: "can't afford a vacation", coreIdentityTrait: 'an adventurous person', affirmationMessage: "Even if you can't afford a vacation, you're still an adventurous person who finds joy in exploration.", relevanceScore: 85 },
    { id: '2', financialSituation: "have credit card debt", coreIdentityTrait: 'responsible and learning', affirmationMessage: "Even if you have credit card debt, you're still responsible and learning from this experience.", relevanceScore: 90 }
  ],
  imposterAlerts: [
    { id: '1', timestamp: new Date(), triggerEvent: 'Received salary increment', anxietyLevel: 'medium', copingStrategy: 'Remember: You earned this through your skills and effort', resolved: false }
  ],
  microInvestments: [
    { id: '1', category: 'Self-care', description: 'Quality coffee at home', cost: 500, identityReinforcement: 'You deserve small pleasures', frequency: 'weekly' },
    { id: '2', category: 'Learning', description: 'One new book monthly', cost: 300, identityReinforcement: 'Continuous growth matters', frequency: 'monthly' }
  ],
  narrativeReframes: [
    { id: '1', originalNarrative: "I'm bad with money", reframedNarrative: "I'm learning to manage money better every day", emotion: 'shame', lessonLearned: 'Past mistakes are stepping stones, not destinations' }
  ],
  compassionScore: {
    overall: 72,
    components: {
      selfKindness: 75,
      commonHumanity: 80,
      mindfulness: 70,
      selfJudgment: 35,
      isolation: 30,
      overIdentification: 40
    },
    trend: 'improving',
    lastAssessment: new Date()
  }
};

export const FinancialIdentitySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'worth' | 'identity' | 'compassion'>('worth');
  const [hobbyDialogOpen, setHobbyDialogOpen] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<any>(null);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'success';
      case 'moderate': return 'warning';
      case 'weak': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-500" />
            Financial Identity Protector
          </h1>
          <p className="text-muted-foreground mt-1">
            Separate your self-worth from your net worth
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Compassion Score: <CountUpNumber value={mockProfile.compassionScore.overall} />%
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { key: 'worth', label: 'Self-Worth Decoupler', icon: Shield },
          { key: 'identity', label: 'Identity Preservation', icon: Sparkles },
          { key: 'compassion', label: 'Self-Compassion', icon: Heart }
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

      {/* Self-Worth Decoupler Tab */}
      {activeTab === 'worth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor="hsl(var(--primary))">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Worth vs Net Worth
              </CardTitle>
              <CardDescription>Your value isn't your valuation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <ProgressRing 
                  progress={mockProfile.selfWorthDecoupler.selfWorthScore} 
                  size={150}
                  color={getStrengthColor(mockProfile.selfWorthDecoupler.decouplingStrength) as 'primary' | 'success' | 'warning' | 'danger'}
                />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">Self-Worth Score</p>
                <p className="text-muted-foreground">Independent of finances</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm italic text-center">"{mockProfile.selfWorthDecoupler.lastAffirmation}"</p>
              </div>
            </CardContent>
          </GlowCard>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Daily Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockProfile.selfWorthDecoupler.dailyReminders.map((reminder, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg flex items-start gap-3">
                  <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{reminder}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                "Even If" Affirmations
              </CardTitle>
              <CardDescription>Your identity remains strong regardless of financial circumstances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProfile.evenIfScenarios.map((scenario) => (
                  <div key={scenario.id} className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                    <p className="text-sm text-foreground">{scenario.affirmationMessage}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={scenario.relevanceScore} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">{scenario.relevanceScore}% relevant</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Identity Preservation Tab */}
      {activeTab === 'identity' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockProfile.identityPreservations.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.hobby}</span>
                  <Badge>{item.identityTrait}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.lowCostAlternative}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cost:</span>
                  <span className="font-bold text-primary">
                    {item.estimatedCost === 0 ? 'Free!' : `₹${item.estimatedCost}`}
                  </span>
                </div>
                <Dialog open={hobbyDialogOpen && selectedHobby?.id === item.id} onOpenChange={(open) => {
                  setHobbyDialogOpen(open);
                  if (open) setSelectedHobby(item);
                }}>
                  <DialogTrigger asChild>
                    <RippleButton 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => {
                        setSelectedHobby(item);
                        setHobbyDialogOpen(true);
                      }}
                    >
                      Explore This
                    </RippleButton>
                  </DialogTrigger>
                  {selectedHobby && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedHobby.hobby}</DialogTitle>
                        <DialogDescription>
                          Low-cost alternative to keep your {selectedHobby.identityTrait.toLowerCase()} identity alive
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium mb-2">Your Identity:</p>
                          <p className="text-lg font-bold">{selectedHobby.identityTrait}</p>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-lg">
                          <p className="text-sm font-medium mb-2">Low-Cost Alternative:</p>
                          <p className="text-lg">{selectedHobby.lowCostAlternative}</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-2">Estimated Cost:</p>
                          <p className="text-2xl font-bold text-primary">
                            {selectedHobby.estimatedCost === 0 ? '₹0 (Free!)' : `₹${selectedHobby.estimatedCost}`}
                          </p>
                        </div>
                        <RippleButton className="w-full" onClick={() => setHobbyDialogOpen(false)}>
                          <Check className="h-4 w-4 mr-2" /> Got it!
                        </RippleButton>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Micro-Identity Investments
              </CardTitle>
              <CardDescription>Small purchases that reinforce who you are</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProfile.microInvestments.map((investment) => (
                  <div key={investment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{investment.category}</Badge>
                      <span className="text-sm font-medium">₹{investment.cost}/{investment.frequency}</span>
                    </div>
                    <p className="font-medium">{investment.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">{investment.identityReinforcement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Self-Compassion Tab */}
      {activeTab === 'compassion' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor="hsl(var(--primary))">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Financial Self-Compassion Score
              </CardTitle>
              <CardDescription>How kindly you treat yourself about money</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <ProgressRing 
                  progress={mockProfile.compassionScore.overall} 
                  size={180}
                  color="success"
                />
              </div>
              <Badge className="w-full justify-center py-2" variant={mockProfile.compassionScore.trend === 'improving' ? 'default' : 'secondary'}>
                <TrendingUp className="h-4 w-4 mr-2" />
                {mockProfile.compassionScore.trend.charAt(0).toUpperCase() + mockProfile.compassionScore.trend.slice(1)}
              </Badge>
            </CardContent>
          </GlowCard>

          <Card>
            <CardHeader>
              <CardTitle>Compassion Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(mockProfile.compassionScore.components).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Narrative Reframes
              </CardTitle>
              <CardDescription>Transform your money stories</CardDescription>
            </CardHeader>
            <CardContent>
              {mockProfile.narrativeReframes.map((reframe) => (
                <div key={reframe.id} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Old Story:</p>
                      <p className="text-sm line-through opacity-60">"{reframe.originalNarrative}"</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">New Story:</p>
                      <p className="text-sm font-medium">"{reframe.reframedNarrative}"</p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-muted rounded">
                    <p className="text-xs text-center text-muted-foreground">
                      💡 {reframe.lessonLearned}
                    </p>
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
