import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlowCard from '@/components/reactbits/GlowCard';
import ShimmerButton from '@/components/reactbits/ShimmerButton';
import GradientText from '@/components/reactbits/GradientText';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import HoverCard3D from '@/components/reactbits/HoverCard3D';
import { 
  SavingChallenge, 
  CommunityTip, 
  PeerTrend, 
  StressHeatmapData,
  MotivationContent,
  TrustedContact
} from '@/types/community';
import { incomeRangeToNumber } from '@/types/userProfile';
import { 
  Users, 
  Trophy, 
  Heart, 
  MapPin, 
  MessageSquare, 
  Shield, 
  Flame,
  TrendingUp,
  UserPlus,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  Share2,
  Target,
  Sparkles,
  Gift,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

// Mock community data
const communityTips: CommunityTip[] = [
  {
    id: '1',
    category: 'saving',
    tip: "Use the 48-hour rule before buying anything over ₹2,000. If you still want it after 48 hours, it's probably worth it.",
    upvotes: 156,
    userDemographic: 'young_professional',
    isAnonymous: true,
  },
  {
    id: '2',
    category: 'impulse_control',
    tip: "Remove saved cards from shopping apps. The extra step of entering card details gives you time to reconsider.",
    upvotes: 243,
    userDemographic: 'general',
    isAnonymous: true,
  },
  {
    id: '3',
    category: 'budgeting',
    tip: "Pay yourself first! Transfer 10% to savings as soon as salary arrives, before spending on anything.",
    upvotes: 189,
    userDemographic: 'young_professional',
    isAnonymous: true,
  },
  {
    id: '4',
    category: 'emergency',
    tip: "Start with just ₹500/week for emergency fund. Small consistent amounts add up faster than you think!",
    upvotes: 312,
    userDemographic: 'student',
    isAnonymous: true,
  },
];

const savingChallenges: SavingChallenge[] = [
  {
    id: '1',
    title: 'No Food Delivery Week',
    description: 'Cook at home for 7 days and save what you would have spent on delivery.',
    duration: 7,
    targetSavings: 2000,
    participants: 1245,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    userProgress: {
      joined: false,
      savedAmount: 0,
      daysCompleted: 0,
    },
  },
  {
    id: '2',
    title: 'Spare Change Collector',
    description: 'Round up every expense and save the difference for a month.',
    duration: 30,
    targetSavings: 5000,
    participants: 876,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    userProgress: {
      joined: false,
      savedAmount: 0,
      daysCompleted: 0,
    },
  },
  {
    id: '3',
    title: 'No Impulse Shopping',
    description: 'Avoid any unplanned purchases for 2 weeks.',
    duration: 14,
    targetSavings: 3000,
    participants: 654,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
  },
];

const peerTrends: PeerTrend[] = [
  { id: '1', ageGroup: '26-35', incomeRange: '₹50k-1L', metric: 'Average Savings Rate', averageValue: 18, trend: 'up', percentile: 65 },
  { id: '2', ageGroup: '26-35', incomeRange: '₹50k-1L', metric: 'Food Delivery Spend', averageValue: 4500, trend: 'up', percentile: 45 },
  { id: '3', ageGroup: '26-35', incomeRange: '₹50k-1L', metric: 'Subscription Count', averageValue: 4.2, trend: 'stable', percentile: 70 },
];

const stressHeatmap: StressHeatmapData[] = [
  { region: 'Mumbai', stressLevel: 62, sampleSize: 15420, topStressors: ['High rent', 'EMIs', 'Long commute'], timestamp: new Date().toISOString() },
  { region: 'Bangalore', stressLevel: 58, sampleSize: 12350, topStressors: ['Rising costs', 'Job uncertainty', 'Traffic'], timestamp: new Date().toISOString() },
  { region: 'Delhi NCR', stressLevel: 55, sampleSize: 18900, topStressors: ['Pollution costs', 'Education', 'Healthcare'], timestamp: new Date().toISOString() },
  { region: 'Hyderabad', stressLevel: 48, sampleSize: 8760, topStressors: ['Rent increases', 'Lifestyle inflation'], timestamp: new Date().toISOString() },
  { region: 'Pune', stressLevel: 45, sampleSize: 6540, topStressors: ['IT layoffs', 'EMIs'], timestamp: new Date().toISOString() },
];

const motivationContent: MotivationContent[] = [
  { id: '1', type: 'quote', content: "Every rupee saved is a rupee earned for your future self.", category: 'saving' },
  { id: '2', type: 'encouragement', content: "You're doing better than you think. Small steps lead to big changes! 💪", category: 'general' },
  { id: '3', type: 'tip', content: "Remember: Financial wellness is a journey, not a destination. Be patient with yourself.", category: 'recovery' },
  { id: '4', type: 'success_story', content: "User saved ₹50,000 in 6 months by following the micro-savings challenge. You can too!", author: "Anonymous User", category: 'saving' },
];

const CommunitySupportSection: React.FC = () => {
  const { profile, analysis, streaks } = useUserProfile();
  const [activeTab, setActiveTab] = useState('challenges');
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [likedTips, setLikedTips] = useState<string[]>([]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Complete onboarding to access Community features</p>
      </div>
    );
  }

  const income = incomeRangeToNumber(profile.monthlyIncomeRange);

  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => [...prev, challengeId]);
  };

  const handleAddContact = () => {
    if (newContactName.trim()) {
      const contact: TrustedContact = {
        id: Date.now().toString(),
        name: newContactName.trim(),
        relationship: 'friend',
        canReceiveAlerts: true,
        addedAt: new Date().toISOString(),
      };
      setTrustedContacts(prev => [...prev, contact]);
      setNewContactName('');
    }
  };

  const handleLikeTip = (tipId: string) => {
    setLikedTips(prev => 
      prev.includes(tipId) ? prev.filter(id => id !== tipId) : [...prev, tipId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            <GradientText>Community & Support</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">Connect, learn, and grow together</p>
        </div>
      </div>

      {/* Motivation Banner */}
      <GlowCard>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {motivationContent[Math.floor(Math.random() * motivationContent.length)].content}
              </p>
            </div>
          </div>
        </CardContent>
      </GlowCard>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="tips">Community Tips</TabsTrigger>
          <TabsTrigger value="trends">Peer Trends</TabsTrigger>
          <TabsTrigger value="heatmap">Stress Map</TabsTrigger>
          <TabsTrigger value="circle">My Circle</TabsTrigger>
        </TabsList>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingChallenges.map((challenge) => {
              const isJoined = joinedChallenges.includes(challenge.id);
              return (
                <HoverCard3D key={challenge.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${challenge.status === 'active' ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        <span className="font-medium">{challenge.title}</span>
                      </div>
                      <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                        {challenge.status === 'active' ? 'Live' : 'Coming Soon'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {challenge.participants.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        ₹{challenge.targetSavings.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        {challenge.duration} days
                      </span>
                    </div>
                    
                    {isJoined ? (
                      <div className="space-y-2">
                        <Progress value={30} className="h-2" />
                        <p className="text-xs text-muted-foreground">Day 2 of {challenge.duration}</p>
                      </div>
                    ) : (
                      <ShimmerButton 
                        onClick={() => handleJoinChallenge(challenge.id)} 
                        className="w-full"
                        disabled={challenge.status !== 'active'}
                      >
                        Join Challenge
                      </ShimmerButton>
                    )}
                  </CardContent>
                </HoverCard3D>
              );
            })}
          </div>
        </TabsContent>

        {/* Community Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          {communityTips.map((tip) => (
            <InteractiveCard key={tip.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{tip.tip}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="outline">{tip.category}</Badge>
                    <button 
                      onClick={() => handleLikeTip(tip.id)}
                      className={`flex items-center gap-1 text-sm ${likedTips.includes(tip.id) ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {tip.upvotes + (likedTips.includes(tip.id) ? 1 : 0)}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      From {tip.userDemographic.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </InteractiveCard>
          ))}
        </TabsContent>

        {/* Peer Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertTitle>See how you compare</AlertTitle>
            <AlertDescription>
              Anonymous data from users with similar profiles
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peerTrends.map((trend) => (
              <InteractiveCard key={trend.id} className="p-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{trend.metric}</p>
                  <p className="text-2xl font-bold">
                    {trend.metric.includes('Rate') ? `${trend.averageValue}%` : 
                     trend.metric.includes('Spend') ? `₹${trend.averageValue.toLocaleString()}` : 
                     trend.averageValue}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={trend.trend === 'up' ? 'default' : trend.trend === 'down' ? 'destructive' : 'secondary'}>
                      {trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '→'} {trend.trend}
                    </Badge>
                    {trend.percentile && (
                      <span className="text-sm text-muted-foreground">
                        You're in top {100 - trend.percentile}%
                      </span>
                    )}
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </TabsContent>

        {/* Stress Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-4">
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertTitle>Financial Stress Heatmap</AlertTitle>
            <AlertDescription>
              See stress levels across different regions (anonymized data)
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stressHeatmap.map((data) => (
              <Card key={data.region} className={
                data.stressLevel > 60 ? 'border-destructive/50' : 
                data.stressLevel > 50 ? 'border-amber-500/50' : 'border-emerald-500/50'
              }>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {data.region}
                    </span>
                    <ProgressRing 
                      progress={data.stressLevel} 
                      size={50} 
                      strokeWidth={4}
                      color={data.stressLevel > 60 ? 'danger' : data.stressLevel > 50 ? 'warning' : 'success'}
                    >
                      <span className="text-xs font-bold">{data.stressLevel}</span>
                    </ProgressRing>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Based on {data.sampleSize.toLocaleString()} users
                  </p>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Top Stressors:</p>
                    <div className="flex flex-wrap gap-1">
                      {data.topStressors.map((stressor, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{stressor}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trusted Circle Tab */}
        <TabsContent value="circle" className="space-y-4">
          <GlowCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Trusted Circle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add trusted people who can receive alerts if you need support. Privacy-preserving - they only see what you choose to share.
              </p>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Contact name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                />
                <ShimmerButton onClick={handleAddContact}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add
                </ShimmerButton>
              </div>
              
              {/* SOS Alert Feature */}
              <Alert className="border-destructive/50 bg-destructive/10 mb-4">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertTitle>Send SOS Alert</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>Notify your trusted contacts that you need financial support</span>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (trustedContacts.length === 0) {
                        toast.error('Please add at least one trusted contact first');
                        return;
                      }
                      toast.success(`SOS alert sent to ${trustedContacts.length} contact(s)!`);
                    }}
                  >
                    Send SOS
                  </Button>
                </AlertDescription>
              </Alert>

              {trustedContacts.length > 0 ? (
                <div className="space-y-2">
                  {trustedContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <Badge variant="outline">{contact.relationship}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No trusted contacts added yet
                </p>
              )}
            </CardContent>
          </GlowCard>
          
          {/* SOS Button */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <div>
                    <p className="font-medium">Need Support?</p>
                    <p className="text-sm text-muted-foreground">Send an SOS to your trusted circle</p>
                  </div>
                </div>
                <Button variant="destructive">
                  Send SOS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunitySupportSection;
