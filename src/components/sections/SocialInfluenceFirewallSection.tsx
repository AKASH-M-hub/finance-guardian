import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Smartphone, 
  Clock, 
  Trophy,
  Eye,
  ShieldCheck,
  Flame,
  Calendar,
  Instagram,
  Twitter
} from 'lucide-react';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import InteractiveCard from '@/components/reactbits/InteractiveCard';

const SocialInfluenceFirewallSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const socialImmunityScore = {
    overall: 72,
    trend: 'improving' as const,
    immunityLevel: 'moderate' as const,
    breakdown: [
      { category: 'FOMO Resistance', score: 78, description: 'Good at resisting fear of missing out' },
      { category: 'Peer Comparison', score: 65, description: 'Moderate sensitivity to peer spending' },
      { category: 'Social Media Immunity', score: 70, description: 'Average resistance to social triggers' },
      { category: 'Status Anxiety', score: 75, description: 'Low anxiety about status purchases' },
    ]
  };

  const upcomingEvents = [
    { id: '1', eventName: "Friend's Birthday Party", date: new Date('2024-01-25'), riskLevel: 'high', predictedSpend: 2500, historicalAvgSpend: 2200 },
    { id: '2', eventName: 'Office Team Lunch', date: new Date('2024-01-22'), riskLevel: 'medium', predictedSpend: 800, historicalAvgSpend: 650 },
    { id: '3', eventName: 'Weekend Getaway', date: new Date('2024-02-01'), riskLevel: 'critical', predictedSpend: 8500, historicalAvgSpend: 7000 },
  ];

  const keepingUpData = {
    yourSpendingTrend: 12,
    peerGroupTrend: 18,
    gapPercentage: -6,
    topInfluencedCategories: [
      { category: 'Dining Out', yourSpend: 4500, peerAverage: 6200, difference: -1700 },
      { category: 'Fashion', yourSpend: 3200, peerAverage: 4800, difference: -1600 },
      { category: 'Entertainment', yourSpend: 2100, peerAverage: 2800, difference: -700 },
    ]
  };

  const purchaseTriggerMaps = [
    { platform: 'Instagram', usageHours: 14.5, correlatedSpending: 3200, triggerCategories: ['Fashion', 'Beauty', 'Food'] },
    { platform: 'YouTube', usageHours: 12.0, correlatedSpending: 1800, triggerCategories: ['Tech', 'Gaming', 'Subscriptions'] },
    { platform: 'Twitter/X', usageHours: 8.5, correlatedSpending: 650, triggerCategories: ['News', 'Books'] },
  ];

  const detoxSuggestions = [
    { id: '1', app: 'Instagram', suggestedBlockTime: '10 PM - 7 AM', reason: 'Late night impulse purchases', potentialSavings: 1200, vulnerabilityScore: 85 },
    { id: '2', app: 'Shopping Apps', suggestedBlockTime: 'Payday week', reason: 'High spending correlation', potentialSavings: 2500, vulnerabilityScore: 92 },
  ];

  const antiFOMORewards = [
    { id: '1', eventResisted: 'Flash Sale Skip', amountSaved: 3500, rewardPoints: 350, streakDays: 5, badge: '🛡️ Sale Survivor' },
    { id: '2', eventResisted: 'Group Trip Decline', amountSaved: 12000, rewardPoints: 1200, streakDays: 12, badge: '🏆 FOMO Fighter' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'critical': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getImmunityColor = (level: string) => {
    switch (level) {
      case 'weak': return 'danger';
      case 'developing': return 'warning';
      case 'moderate': return 'primary';
      case 'strong': return 'success';
      case 'bulletproof': return 'success';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/20">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Social Influence Firewall</h1>
          <p className="text-muted-foreground">Protect your finances from peer pressure & social triggers</p>
        </div>
      </div>

      {/* Main Immunity Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InteractiveCard className="lg:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-4">Social Immunity Score</h3>
            <ProgressRing 
              progress={socialImmunityScore.overall} 
              size={160} 
              strokeWidth={12}
              color={getImmunityColor(socialImmunityScore.immunityLevel)}
            >
              <div className="text-center">
                <CountUpNumber value={socialImmunityScore.overall} className="text-3xl font-bold" />
                <p className="text-xs text-muted-foreground mt-1">/ 100</p>
              </div>
            </ProgressRing>
            <Badge className="mt-4 capitalize" variant="outline">
              <ShieldCheck className="h-3 w-3 mr-1" />
              {socialImmunityScore.immunityLevel} Immunity
            </Badge>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              {socialImmunityScore.trend}
            </p>
          </div>
        </InteractiveCard>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Immunity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialImmunityScore.breakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm font-bold">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Events</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="detox">Detox</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Upcoming Social Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-400" />
                Social Event Risk Predictor
              </CardTitle>
              <CardDescription>Upcoming events with spending risk analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{event.eventName}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getRiskColor(event.riskLevel)}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {event.riskLevel.toUpperCase()}
                      </Badge>
                      <p className="text-sm font-semibold mt-1">
                        ₹<CountUpNumber value={event.predictedSpend} />
                      </p>
                      <p className="text-xs text-muted-foreground">predicted spend</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keeping Up Meter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                "Keeping Up" Meter
              </CardTitle>
              <CardDescription>Anonymous comparison with peer group spending trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-2xl font-bold text-primary">+{keepingUpData.yourSpendingTrend}%</p>
                  <p className="text-sm text-muted-foreground">Your Trend</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-2xl font-bold">+{keepingUpData.peerGroupTrend}%</p>
                  <p className="text-sm text-muted-foreground">Peer Group</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/10 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{keepingUpData.gapPercentage}%</p>
                  <p className="text-sm text-muted-foreground">You're Saving More!</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Top Influenced Categories</h4>
                {keepingUpData.topInfluencedCategories.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span>{cat.category}</span>
                    <div className="text-right">
                      <span className="text-sm">You: ₹{cat.yourSpend.toLocaleString()}</span>
                      <span className="text-muted-foreground text-sm ml-2">vs ₹{cat.peerAverage.toLocaleString()}</span>
                      <Badge variant="outline" className="ml-2 text-emerald-400">
                        Saving ₹{Math.abs(cat.difference).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6 mt-6">
          {/* Social Media Purchase Triggers Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Social Media Purchase Triggers Map
              </CardTitle>
              <CardDescription>Correlation between platform usage and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseTriggerMaps.map((platform, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {platform.platform === 'Instagram' && <Instagram className="h-5 w-5 text-pink-400" />}
                        {platform.platform === 'Twitter/X' && <Twitter className="h-5 w-5 text-blue-400" />}
                        {platform.platform === 'YouTube' && <Flame className="h-5 w-5 text-red-400" />}
                        <span className="font-medium">{platform.platform}</span>
                      </div>
                      <Badge variant="destructive">
                        ₹{platform.correlatedSpending.toLocaleString()} triggered
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Weekly Usage</p>
                        <p className="font-medium">{platform.usageHours} hours</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trigger Categories</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {platform.triggerCategories.map((cat, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detox" className="space-y-6 mt-6">
          {/* Digital Detox Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                Digital Detox Assistant
              </CardTitle>
              <CardDescription>Smart app blocking suggestions for vulnerable periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detoxSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-amber-400" />
                        <span className="font-medium">{suggestion.app}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-400">
                          Save ₹{suggestion.potentialSavings.toLocaleString()}/month
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Block Time:</strong> {suggestion.suggestedBlockTime}</p>
                      <p className="text-sm text-muted-foreground"><strong>Reason:</strong> {suggestion.reason}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Progress value={suggestion.vulnerabilityScore} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{suggestion.vulnerabilityScore}% vulnerable</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Enable Block Schedule
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6 mt-6">
          {/* Anti-FOMO Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                Anti-FOMO Rewards
              </CardTitle>
              <CardDescription>Gamified rewards for resisting social spending pressure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {antiFOMORewards.map((reward) => (
                  <div key={reward.id} className="p-4 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{reward.badge?.split(' ')[0]}</span>
                        <div>
                          <p className="font-medium">{reward.eventResisted}</p>
                          <p className="text-sm text-muted-foreground">{reward.badge?.split(' ').slice(1).join(' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-400">
                          ₹<CountUpNumber value={reward.amountSaved} />
                        </p>
                        <p className="text-xs text-muted-foreground">saved</p>
                        <Badge variant="outline" className="mt-1">
                          +{reward.rewardPoints} pts
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">{reward.streakDays} day streak</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-primary/10 text-center">
                <p className="text-2xl font-bold text-primary">
                  ₹<CountUpNumber value={15500} />
                </p>
                <p className="text-sm text-muted-foreground">Total saved by resisting FOMO</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialInfluenceFirewallSection;
