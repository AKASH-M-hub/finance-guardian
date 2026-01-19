import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Download,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  Users,
  Brain
} from 'lucide-react';
import GlowCard from '@/components/reactbits/GlowCard';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import RippleButton from '@/components/reactbits/RippleButton';
import ProgressRing from '@/components/reactbits/ProgressRing';
import GradientText from '@/components/reactbits/GradientText';
import { useUserProfile } from '@/contexts/UserProfileContext';
import type { ConsentSettings, ProtectedCategory, AIExplanation, PrivacyStats } from '@/types/privacy';

const PrivacyTrustSection = () => {
  const { analysis } = useUserProfile();
  
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    dataAnalysis: true,
    anonymizedAggregation: true,
    communitySharing: false,
    thirdPartyAccess: false
  });

  const [categories, setCategories] = useState<ProtectedCategory[]>([
    { id: '1', name: 'Medical & Health', isProtected: true, isIncognito: false },
    { id: '2', name: 'Personal Care', isProtected: true, isIncognito: false },
    { id: '3', name: 'Entertainment', isProtected: false, isIncognito: false },
    { id: '4', name: 'Food & Dining', isProtected: false, isIncognito: false },
    { id: '5', name: 'Transportation', isProtected: false, isIncognito: false },
    { id: '6', name: 'Shopping', isProtected: false, isIncognito: true },
  ]);

  const [aiExplanations] = useState<AIExplanation[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 86400000),
      scoreChange: -5,
      previousScore: analysis?.stressScore || 45,
      newScore: (analysis?.stressScore || 45) - 5,
      reasons: ['Reduced impulse spending', 'Consistent savings pattern'],
      dataPoints: [
        { category: 'Shopping', impact: 'positive', description: '30% less than last week' },
        { category: 'Savings', impact: 'positive', description: 'Met weekly target' }
      ]
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 172800000),
      scoreChange: 8,
      previousScore: (analysis?.stressScore || 45) - 13,
      newScore: (analysis?.stressScore || 45) - 5,
      reasons: ['Unexpected expense detected', 'Bill payment due'],
      dataPoints: [
        { category: 'Utilities', impact: 'negative', description: 'Higher than average' },
        { category: 'EMI', impact: 'neutral', description: 'Regular payment upcoming' }
      ]
    }
  ]);

  const [privacyStats] = useState<PrivacyStats>({
    dataPointsStored: 247,
    lastDataDeletion: new Date(Date.now() - 604800000),
    anonymizedContributions: 12,
    incognitoCategories: categories.filter(c => c.isIncognito).length
  });

  const toggleConsent = (key: keyof ConsentSettings) => {
    setConsentSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIncognito = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isIncognito: !cat.isIncognito } : cat
    ));
  };

  const toggleProtected = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isProtected: !cat.isProtected } : cat
    ));
  };

  const privacyScore = Math.round(
    ((consentSettings.dataAnalysis ? 1 : 0) +
    (consentSettings.anonymizedAggregation ? 1 : 0) +
    (!consentSettings.communitySharing ? 1 : 0) +
    (!consentSettings.thirdPartyAccess ? 1 : 0) +
    (categories.filter(c => c.isProtected).length / categories.length)) / 5 * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <GradientText>Privacy & Trust Center</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">
            Your data, your control. Complete transparency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            Privacy First
          </Badge>
        </div>
      </div>

      {/* Privacy Score Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlowCard className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Privacy Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ProgressRing 
              progress={privacyScore} 
              size={100} 
              strokeWidth={8}
              color={privacyScore >= 80 ? 'hsl(var(--success))' : privacyScore >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {privacyScore >= 80 ? 'Excellent Protection' : privacyScore >= 50 ? 'Good Protection' : 'Review Settings'}
            </p>
          </CardContent>
        </GlowCard>

        <InteractiveCard className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{privacyStats.dataPointsStored}</p>
            <p className="text-xs text-muted-foreground">Minimal storage policy</p>
          </CardContent>
        </InteractiveCard>

        <InteractiveCard className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Incognito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{privacyStats.incognitoCategories}</p>
            <p className="text-xs text-muted-foreground">Hidden categories</p>
          </CardContent>
        </InteractiveCard>

        <InteractiveCard className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{privacyStats.anonymizedContributions}</p>
            <p className="text-xs text-muted-foreground">Anonymous only</p>
          </CardContent>
        </InteractiveCard>
      </div>

      <Tabs defaultValue="consent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consent">Consent Control</TabsTrigger>
          <TabsTrigger value="incognito">Incognito Mode</TabsTrigger>
          <TabsTrigger value="ai-reasoning">AI Reasoning</TabsTrigger>
          <TabsTrigger value="data-control">Data Control</TabsTrigger>
        </TabsList>

        {/* Consent Control Tab */}
        <TabsContent value="consent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Consent-Based Data Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium">Financial Analysis</p>
                  <p className="text-sm text-muted-foreground">Allow AI to analyze your spending patterns</p>
                </div>
                <Switch 
                  checked={consentSettings.dataAnalysis}
                  onCheckedChange={() => toggleConsent('dataAnalysis')}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium">Anonymized Aggregation</p>
                  <p className="text-sm text-muted-foreground">Contribute to community trends (anonymous)</p>
                </div>
                <Switch 
                  checked={consentSettings.anonymizedAggregation}
                  onCheckedChange={() => toggleConsent('anonymizedAggregation')}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium">Community Sharing</p>
                  <p className="text-sm text-muted-foreground">Share tips with community members</p>
                </div>
                <Switch 
                  checked={consentSettings.communitySharing}
                  onCheckedChange={() => toggleConsent('communitySharing')}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex-1">
                  <p className="font-medium text-destructive">Third-Party Access</p>
                  <p className="text-sm text-muted-foreground">Share data with external services</p>
                </div>
                <Switch 
                  checked={consentSettings.thirdPartyAccess}
                  onCheckedChange={() => toggleConsent('thirdPartyAccess')}
                />
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Minimal Data Policy</p>
                    <p className="text-sm text-muted-foreground">
                      We only store category names and amounts. No transaction details, 
                      merchant names, or personally identifiable information is retained.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incognito Mode Tab */}
        <TabsContent value="incognito" className="space-y-4">
          <GlowCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeOff className="h-5 w-5" />
                Incognito Mode ⭐
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Hide specific categories from tracking to maintain your comfort and privacy
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    category.isIncognito 
                      ? 'bg-muted/80 border-2 border-primary/30' 
                      : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {category.isIncognito ? (
                      <EyeOff className="h-5 w-5 text-primary" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <div className="flex gap-2 mt-1">
                        {category.isProtected && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Protected
                          </Badge>
                        )}
                        {category.isIncognito && (
                          <Badge className="text-xs bg-primary/20 text-primary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProtected(category.id)}
                    >
                      {category.isProtected ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                    <RippleButton
                      variant={category.isIncognito ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleIncognito(category.id)}
                    >
                      {category.isIncognito ? 'Visible' : 'Hide'}
                    </RippleButton>
                  </div>
                </div>
              ))}
            </CardContent>
          </GlowCard>
        </TabsContent>

        {/* AI Reasoning Tab */}
        <TabsContent value="ai-reasoning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Explainable AI Reasoning
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Understand exactly why your stress score changes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiExplanations.map((explanation) => (
                <InteractiveCard key={explanation.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {explanation.timestamp.toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold">
                          {explanation.previousScore}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-lg font-bold">
                          {explanation.newScore}
                        </span>
                        <Badge 
                          variant={explanation.scoreChange < 0 ? "default" : "destructive"}
                          className={explanation.scoreChange < 0 ? 'bg-green-500/20 text-green-500' : ''}
                        >
                          {explanation.scoreChange > 0 ? '+' : ''}{explanation.scoreChange}
                        </Badge>
                      </div>
                    </div>
                    {explanation.scoreChange < 0 ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reasons:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {explanation.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm font-medium mb-2">Data Points Used:</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {explanation.dataPoints.map((point, idx) => (
                        <div 
                          key={idx}
                          className={`p-2 rounded text-sm ${
                            point.impact === 'positive' 
                              ? 'bg-green-500/10 text-green-500' 
                              : point.impact === 'negative'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted'
                          }`}
                        >
                          <span className="font-medium">{point.category}:</span> {point.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </InteractiveCard>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Control Tab */}
        <TabsContent value="data-control" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download all your data in your preferred format
                </p>
                <div className="flex gap-2">
                  <RippleButton variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </RippleButton>
                  <RippleButton variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </RippleButton>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Delete Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your data from our servers
                </p>
                <RippleButton variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Data
                </RippleButton>
                {privacyStats.lastDataDeletion && (
                  <p className="text-xs text-muted-foreground text-center">
                    Last deletion: {privacyStats.lastDataDeletion.toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Session Lock</p>
                  <p className="text-sm text-muted-foreground">Auto-lock after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Device Lock Required</p>
                  <p className="text-sm text-muted-foreground">Require device authentication</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Biometric Authentication</p>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face unlock</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivacyTrustSection;
