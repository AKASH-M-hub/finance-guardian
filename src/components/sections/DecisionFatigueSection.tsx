import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Brain, Moon, ShoppingCart, ArrowLeftRight, Eye, AlertTriangle, Clock, Pause, Zap, Activity, Check, X } from 'lucide-react';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import GlowCard from '@/components/reactbits/GlowCard';
import RippleButton from '@/components/reactbits/RippleButton';
import { addToCalendar, toggleFeature } from '@/lib/modalUtils';
import type { DecisionFatigueProfile } from '@/types/decisionFatigue';

const mockProfile: DecisionFatigueProfile = {
  countTracker: {
    daily: 23,
    weekly: 156,
    monthly: 580,
    averageDaily: 22,
    peakDay: 'Monday',
    optimalRange: { min: 10, max: 20 }
  },
  lateNightActivities: [
    { id: '1', timestamp: new Date(), decisionType: 'Online shopping browse', amount: 2500, focusScore: 35, wasReversed: true, hourOfDay: 23 },
    { id: '2', timestamp: new Date(), decisionType: 'Subscription upgrade', amount: 499, focusScore: 42, wasReversed: false, hourOfDay: 1 }
  ],
  cartPatterns: [
    { id: '1', sessionId: 's1', addRemoveCycles: 8, totalTimeSpent: 45, finalDecision: 'abandoned', indecisionScore: 78 },
    { id: '2', sessionId: 's2', addRemoveCycles: 3, totalTimeSpent: 15, finalDecision: 'purchased', indecisionScore: 32 }
  ],
  planSwitching: [
    { id: '1', planType: 'budget', switchCount: 5, periodDays: 30, stability: 'volatile', lastSwitch: new Date() },
    { id: '2', planType: 'savings', switchCount: 2, periodDays: 30, stability: 'moderate', lastSwitch: new Date() }
  ],
  browsingPatterns: [
    { id: '1', category: 'Electronics', sessionsCount: 12, totalTimeSpent: 180, itemsViewed: 45, conversionRate: 8, mentalLoadScore: 72 },
    { id: '2', category: 'Fashion', sessionsCount: 8, totalTimeSpent: 90, itemsViewed: 32, conversionRate: 12, mentalLoadScore: 58 }
  ],
  highStakesQueue: [
    { id: '1', category: 'gadget', amount: 85000, importance: 'high', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), researchTime: 8, confidenceLevel: 65 },
    { id: '2', category: 'travel', amount: 45000, importance: 'medium', researchTime: 4, confidenceLevel: 80 }
  ],
  densityAnalysis: {
    timeWindow: 'day',
    decisionCount: 23,
    density: 'high',
    clusterPeriods: [
      { start: new Date(), end: new Date(), count: 8 }
    ]
  },
  fatigueThreshold: {
    current: 68,
    threshold: 75,
    predictedDropTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    recoveryNeeded: 3,
    riskLevel: 'approaching'
  },
  impulseFlags: [
    { id: '1', timestamp: new Date(), fatigueLevel: 72, spendingIntent: 5000, riskScore: 78, warningMessage: 'High fatigue + high spending intent detected', suggestedAction: 'Delay this decision by 24 hours' }
  ],
  coolDownMode: {
    isActive: false,
    duration: 4,
    delayedDecisions: [],
    urgentExceptions: ['Bills', 'Emergencies', 'Medical']
  },
  overallFatigueScore: 68
};

export const DecisionFatigueSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'stakes' | 'cooldown'>('overview');
  const [cooldownActive, setCooldownActive] = useState(mockProfile.coolDownMode.isActive);
  const [focusScheduleDialogOpen, setFocusScheduleDialogOpen] = useState(false);
  const [manageExceptionsDialogOpen, setManageExceptionsDialogOpen] = useState(false);
  const [newException, setNewException] = useState('');
  const [exceptions, setExceptions] = useState(mockProfile.coolDownMode.urgentExceptions);
  const [calendarSuccess, setCalendarSuccess] = useState(false);

  const getFatigueColor = (score: number): 'success' | 'warning' | 'danger' => {
    if (score < 40) return 'success';
    if (score < 70) return 'warning';
    return 'danger';
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'safe': return 'default';
      case 'approaching': return 'secondary';
      case 'exceeded': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="h-8 w-8 text-amber-500" />
            Decision Fatigue Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Protect your decision quality when mental energy is low
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getRiskBadgeVariant(mockProfile.fatigueThreshold.riskLevel)} className="text-lg px-4 py-2">
            Fatigue: <CountUpNumber value={mockProfile.overallFatigueScore} />%
          </Badge>
          <RippleButton
            variant={cooldownActive ? 'danger' : 'primary'}
            onClick={() => setCooldownActive(!cooldownActive)}
            className="flex items-center gap-2"
          >
            <Pause className="h-4 w-4" />
            {cooldownActive ? 'Exit Cool-Down' : 'Activate Cool-Down'}
          </RippleButton>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'overview', label: 'Fatigue Overview', icon: Activity },
          { key: 'patterns', label: 'Decision Patterns', icon: ArrowLeftRight },
          { key: 'stakes', label: 'High Stakes Queue', icon: AlertTriangle },
          { key: 'cooldown', label: 'Cool-Down Mode', icon: Pause }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlowCard glowColor="hsl(var(--primary))" className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Current Fatigue Level
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <ProgressRing 
                progress={mockProfile.fatigueThreshold.current} 
                size={180}
                color={getFatigueColor(mockProfile.fatigueThreshold.current)}
              />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Quality drops at {mockProfile.fatigueThreshold.threshold}%</p>
                <p className="text-lg font-medium mt-1">
                  ~{Math.round((mockProfile.fatigueThreshold.predictedDropTime.getTime() - Date.now()) / (60 * 60 * 1000))}h until quality drop
                </p>
              </div>
              <div className="w-full p-3 bg-muted rounded-lg text-center">
                <p className="text-sm">Recovery needed: <span className="font-bold">{mockProfile.fatigueThreshold.recoveryNeeded}h rest</span></p>
              </div>
            </CardContent>
          </GlowCard>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Decision Count
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold"><CountUpNumber value={mockProfile.countTracker.daily} /></p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold"><CountUpNumber value={mockProfile.countTracker.weekly} /></p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold"><CountUpNumber value={mockProfile.countTracker.monthly} /></p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm">Optimal range: <span className="font-medium">{mockProfile.countTracker.optimalRange.min}-{mockProfile.countTracker.optimalRange.max}/day</span></p>
                <p className="text-xs text-muted-foreground mt-1">Peak decision day: {mockProfile.countTracker.peakDay}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Late Night Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockProfile.lateNightActivities.slice(0, 2).map((activity) => (
                <div key={activity.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{activity.decisionType}</span>
                    <Badge variant={activity.wasReversed ? 'outline' : 'destructive'}>
                      {activity.wasReversed ? 'Reversed' : 'Kept'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.hourOfDay}:00 • Focus: {activity.focusScore}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Impulse Risk Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockProfile.impulseFlags.map((flag) => (
                <div key={flag.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-medium">{flag.warningMessage}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Fatigue: {flag.fatigueLevel}% | Intent: ₹{flag.spendingIntent.toLocaleString()}
                  </p>
                  <div className="mt-2 p-2 bg-primary/10 rounded text-xs">
                    💡 {flag.suggestedAction}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Decision Density
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <Badge variant={mockProfile.densityAnalysis.density === 'high' ? 'destructive' : 'default'} className="text-lg">
                  {mockProfile.densityAnalysis.density.toUpperCase()} Density
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {mockProfile.densityAnalysis.decisionCount} decisions clustered in this {mockProfile.densityAnalysis.timeWindow}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart Edit Patterns
              </CardTitle>
              <CardDescription>Indecision through add/remove cycles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProfile.cartPatterns.map((pattern) => (
                <div key={pattern.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Add/Remove Cycles: <span className="font-bold">{pattern.addRemoveCycles}</span></span>
                    <Badge variant={pattern.finalDecision === 'purchased' ? 'default' : 'secondary'}>
                      {pattern.finalDecision}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">Indecision Score:</span>
                    <Progress value={pattern.indecisionScore} className="h-2 flex-1" />
                    <span className="text-xs font-medium">{pattern.indecisionScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Time spent: {pattern.totalTimeSpent} min</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                Plan Switching
              </CardTitle>
              <CardDescription>Frequent changes in budgets & plans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProfile.planSwitching.map((plan) => (
                <div key={plan.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{plan.planType}</span>
                    <Badge variant={plan.stability === 'volatile' ? 'destructive' : plan.stability === 'moderate' ? 'secondary' : 'default'}>
                      {plan.stability}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.switchCount} changes in {plan.periodDays} days
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Browsing Without Buying
              </CardTitle>
              <CardDescription>Mental overload without resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProfile.browsingPatterns.map((pattern) => (
                  <div key={pattern.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{pattern.category}</span>
                      <ProgressRing progress={pattern.mentalLoadScore} size={50} color={getFatigueColor(pattern.mentalLoadScore)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sessions</p>
                        <p className="font-medium">{pattern.sessionsCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Items Viewed</p>
                        <p className="font-medium">{pattern.itemsViewed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time Spent</p>
                        <p className="font-medium">{pattern.totalTimeSpent} min</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversion</p>
                        <p className="font-medium">{pattern.conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* High Stakes Tab */}
      {activeTab === 'stakes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockProfile.highStakesQueue.map((decision) => (
            <GlowCard key={decision.id} glowColor="hsl(var(--primary))">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{decision.category}</span>
                  <Badge variant={decision.importance === 'critical' ? 'destructive' : decision.importance === 'high' ? 'secondary' : 'outline'}>
                    {decision.importance}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">₹{decision.amount.toLocaleString()}</p>
                  {decision.deadline && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Deadline: {decision.deadline.toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Research Time</span>
                    <span className="font-medium">{decision.researchTime}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Confidence:</span>
                    <Progress value={decision.confidenceLevel} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{decision.confidenceLevel}%</span>
                  </div>
                </div>
                <Dialog open={focusScheduleDialogOpen} onOpenChange={setFocusScheduleDialogOpen}>
                  <DialogTrigger asChild>
                    <RippleButton variant="primary" className="w-full">
                      Schedule Focused Decision Time
                    </RippleButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Focused Decision Time</DialogTitle>
                      <DialogDescription>
                        Make this high-stakes decision during your optimal focus period
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Decision Category:</p>
                        <p className="font-bold text-lg">{decision.category}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Amount:</p>
                        <p className="font-bold text-2xl">₹{decision.amount.toLocaleString()}</p>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          const success = addToCalendar({
                            title: `Focus Time: ${decision.category} Decision (₹${decision.amount})`,
                            description: `Dedicated focus time for your ${decision.category} purchase decision`,
                            date: new Date(),
                            time: '09:00',
                            duration: 120,
                          });
                          if (success) {
                            setCalendarSuccess(true);
                            setTimeout(() => {
                              setFocusScheduleDialogOpen(false);
                              setCalendarSuccess(false);
                            }, 1500);
                          }
                        }}
                      >
                        {calendarSuccess ? <><Check className="h-4 w-4 mr-2" /> Scheduled!</> : 'Add to Calendar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </GlowCard>
          ))}
        </div>
      )}

      {/* Cool-Down Tab */}
      {activeTab === 'cooldown' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlowCard glowColor={cooldownActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pause className="h-5 w-5" />
                Decision Cool-Down Mode
              </CardTitle>
              <CardDescription>Temporarily delay non-urgent financial actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${cooldownActive ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Pause className={`h-16 w-16 ${cooldownActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <p className="text-xl font-bold mt-4">{cooldownActive ? 'ACTIVE' : 'INACTIVE'}</p>
                <p className="text-sm text-muted-foreground">Duration: {mockProfile.coolDownMode.duration} hours</p>
              </div>
              <RippleButton
                variant={cooldownActive ? 'danger' : 'primary'}
                className="w-full"
                onClick={() => setCooldownActive(!cooldownActive)}
              >
                {cooldownActive ? 'Deactivate Cool-Down' : 'Activate Cool-Down'}
              </RippleButton>
            </CardContent>
          </GlowCard>

          <Card>
            <CardHeader>
              <CardTitle>Urgent Exceptions</CardTitle>
              <CardDescription>These categories bypass cool-down mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockProfile.coolDownMode.urgentExceptions.map((exception, index) => (
                <div key={index} className="p-3 bg-primary/10 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>{exception}</span>
                </div>
              ))}
              <Dialog open={manageExceptionsDialogOpen} onOpenChange={setManageExceptionsDialogOpen}>
                <DialogTrigger asChild>
                  <RippleButton variant="secondary" className="w-full mt-4">
                    Manage Exceptions
                  </RippleButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage Urgent Exceptions</DialogTitle>
                    <DialogDescription>
                      Categories that can bypass cool-down mode in emergencies
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {exceptions.map((exception, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                          <span>{exception}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setExceptions(exceptions.filter((_, i) => i !== index))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add new exception..."
                        value={newException}
                        onChange={(e) => setNewException(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newException) {
                            setExceptions([...exceptions, newException]);
                            setNewException('');
                          }
                        }}
                      />
                      <Button 
                        onClick={() => {
                          if (newException) {
                            setExceptions([...exceptions, newException]);
                            setNewException('');
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        localStorage.setItem('decision_exceptions', JSON.stringify(exceptions));
                        setManageExceptionsDialogOpen(false);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" /> Save Exceptions
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {cooldownActive && mockProfile.coolDownMode.delayedDecisions.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Delayed Decisions</CardTitle>
                <CardDescription>Pending for review after cool-down</CardDescription>
              </CardHeader>
              <CardContent>
                {mockProfile.coolDownMode.delayedDecisions.map((decision) => (
                  <div key={decision.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{decision.description}</p>
                        <p className="text-sm text-muted-foreground">₹{decision.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Scheduled Review</p>
                        <p className="text-sm font-medium">{decision.scheduledReview.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
