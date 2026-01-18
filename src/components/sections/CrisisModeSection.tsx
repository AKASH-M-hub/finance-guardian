import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlowCard from '@/components/reactbits/GlowCard';
import ShimmerButton from '@/components/reactbits/ShimmerButton';
import AnimatedCounter from '@/components/reactbits/AnimatedCounter';
import GradientText from '@/components/reactbits/GradientText';
import PulseRing from '@/components/reactbits/PulseRing';
import { incomeRangeToNumber } from '@/types/userProfile';
import { 
  AlertTriangle, 
  Shield, 
  Clock,
  Ban,
  TrendingDown,
  Wallet,
  Target,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  ArrowRight
} from 'lucide-react';

const CrisisModeSection: React.FC = () => {
  const { profile, analysis, crisisStatus } = useUserProfile();
  const [freezeEnabled, setFreezeEnabled] = useState(false);
  const [sosPlanActive, setSosPlanActive] = useState(false);

  if (!profile || !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Complete onboarding to access Crisis Mode features</p>
      </div>
    );
  }

  const income = incomeRangeToNumber(profile.monthlyIncomeRange);
  
  // Calculate emergency fund target (3-6 months of expenses)
  const monthlyExpenses = profile.totalFixedAmount + (income.avg - profile.totalFixedAmount) * 0.7;
  const emergencyFundTarget = monthlyExpenses * 4;
  const estimatedCurrentSavings = Math.max(0, income.avg - profile.totalFixedAmount - (income.avg * 0.3));
  const emergencyFundProgress = (estimatedCurrentSavings / emergencyFundTarget) * 100;

  // SOS Survival Plan
  const sosPlan = {
    duration: 10,
    dailyBudget: Math.round(analysis.dailyBudget * 0.6),
    essentialCategories: ['Food', 'Transport', 'Utilities', 'Medical'],
    blockedCategories: ['Shopping', 'Entertainment', 'Dining Out', 'Subscriptions'],
    potentialSavings: Math.round(analysis.dailyBudget * 0.4 * 10),
  };

  // Recovery timeline
  const recoveryWeeks = Math.ceil(analysis.recoveryDays / 7);

  // Borrowing detection
  const borrowingRisk = profile.emergencyReadiness === 'need_to_borrow' || 
    profile.reachZeroFrequency === 'often';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-destructive" />
            <GradientText>Crisis Mode & Financial Rescue</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">Emergency protection and survival budgeting</p>
        </div>
        
        {crisisStatus.isInCrisis && (
          <Badge variant="destructive" className="animate-pulse">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Crisis Detected
          </Badge>
        )}
      </div>

      {/* Crisis Status Alert */}
      {crisisStatus.crisisLevel !== 'none' && (
        <Alert variant={crisisStatus.isInCrisis ? 'destructive' : 'default'} className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-bold">
            {crisisStatus.isInCrisis ? 'Financial Crisis Mode Active' : 'Financial Warning Detected'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="list-disc list-inside space-y-1">
              {crisisStatus.triggerReasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Crisis Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debt Risk Radar */}
        <GlowCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-destructive" />
              Debt Risk Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={analysis.debtRisk > 70 ? 'hsl(var(--destructive))' : analysis.debtRisk > 40 ? 'hsl(var(--amber-500, 245 158 11))' : 'hsl(var(--emerald-500, 16 185 129))'}
                    strokeWidth="8"
                    strokeDasharray={`${analysis.debtRisk * 2.83} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold"><AnimatedCounter value={analysis.debtRisk} />%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {analysis.debtRisk > 60 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    High risk of entering a debt cycle. Consider freezing non-essential spending.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {profile.commitments.some(c => c.includes('emi')) ? (
                    <XCircle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  <span>Active EMI/Loans</span>
                </div>
                <div className="flex items-center gap-2">
                  {profile.commitments.includes('credit_card') ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  <span>Credit Card Dependency</span>
                </div>
                <div className="flex items-center gap-2">
                  {borrowingRisk ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  <span>Borrowing Pattern</span>
                </div>
              </div>
            </div>
          </CardContent>
        </GlowCard>

        {/* Emergency Fund Estimator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Emergency Fund Target
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">You need</p>
              <p className="text-3xl font-bold text-primary">
                ₹<AnimatedCounter value={emergencyFundTarget} />
              </p>
              <p className="text-sm text-muted-foreground">for 4 months of expenses</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(emergencyFundProgress)}%</span>
              </div>
              <Progress value={Math.min(emergencyFundProgress, 100)} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded bg-muted/50 text-center">
                <p className="text-muted-foreground">Monthly Expenses</p>
                <p className="font-bold">₹{Math.round(monthlyExpenses).toLocaleString()}</p>
              </div>
              <div className="p-2 rounded bg-muted/50 text-center">
                <p className="text-muted-foreground">Gap to Fill</p>
                <p className="font-bold text-destructive">₹{Math.round(emergencyFundTarget - estimatedCurrentSavings).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Non-Essential Spending Freeze */}
      <Card className={freezeEnabled ? 'border-destructive/50 bg-destructive/5' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-destructive" />
              Non-Essential Spending Freeze
            </div>
            <Switch
              checked={freezeEnabled}
              onCheckedChange={setFreezeEnabled}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {freezeEnabled ? (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Spending freeze is active. You will be warned before any non-essential purchases.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-2">✓ Allowed</p>
                  <ul className="text-sm space-y-1">
                    {['Food & Groceries', 'Transport', 'Utilities', 'Medical'].map((cat) => (
                      <li key={cat} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-destructive mb-2">✗ Blocked</p>
                  <ul className="text-sm space-y-1">
                    {['Shopping', 'Entertainment', 'Dining Out', 'Subscriptions'].map((cat) => (
                      <li key={cat} className="flex items-center gap-2">
                        <XCircle className="h-3 w-3 text-destructive" />
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Enable spending freeze to temporarily block high-risk categories and protect your essentials.
            </p>
          )}
        </CardContent>
      </Card>

      {/* SOS Survival Plan */}
      <GlowCard>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PulseRing color="danger" size="sm">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </PulseRing>
              SOS Survival Plan
            </div>
            {sosPlanActive && <Badge variant="destructive">Active</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A 10-day "essentials only" budget plan to help you survive a financial emergency.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-destructive/10 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-destructive" />
              <p className="text-lg font-bold">{sosPlan.duration}</p>
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-center">
              <Wallet className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">₹{sosPlan.dailyBudget}</p>
              <p className="text-xs text-muted-foreground">Daily Budget</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
              <TrendingDown className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
              <p className="text-lg font-bold">₹{sosPlan.potentialSavings}</p>
              <p className="text-xs text-muted-foreground">Potential Savings</p>
            </div>
          </div>
          
          <ShimmerButton 
            onClick={() => setSosPlanActive(!sosPlanActive)}
            className="w-full"
          >
            {sosPlanActive ? 'Deactivate SOS Plan' : 'Activate SOS Survival Plan'}
          </ShimmerButton>
        </CardContent>
      </GlowCard>

      {/* Recovery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recovery Timeline Estimator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary"><AnimatedCounter value={recoveryWeeks} /></p>
              <p className="text-sm text-muted-foreground">weeks to stability</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="text-sm font-medium">Stabilize</p>
                    <p className="text-xs text-muted-foreground">Stop the bleeding</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="text-sm font-medium">Build Buffer</p>
                    <p className="text-xs text-muted-foreground">Create safety margin</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="text-sm font-medium">Grow</p>
                    <p className="text-xs text-muted-foreground">Sustainable habits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Borrowing Warning System */}
      {borrowingRisk && (
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Borrowing Pattern Warning</AlertTitle>
          <AlertDescription className="mt-2">
            <p>Your financial pattern indicates a risk of relying on borrowing. Here are safer alternatives:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Activate the SOS Survival Plan above</li>
              <li>Use the spending freeze to protect essentials</li>
              <li>Contact service providers to negotiate payment dates</li>
              <li>Consider the micro-savings challenge in AI Coach</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CrisisModeSection;
