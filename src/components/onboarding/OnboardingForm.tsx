import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import SpotlightButton from '@/components/reactbits/SpotlightButton';
import GradientText from '@/components/reactbits/GradientText';
import GlowCard from '@/components/reactbits/GlowCard';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { 
  UserProfile, 
  IncomeRange, 
  IncomeType, 
  Commitment, 
  SpendingStyle,
  OverspendTrigger,
  ImpulseCategory,
  MoneyFeeling,
  ZeroFrequency,
  EmergencyReadiness,
  LifeSituation,
  PlannedPurchase,
  AIHelpLevel,
  incomeRangeLabels,
  incomeTypeLabels,
  commitmentLabels,
  spendingStyleLabels,
  overspendTriggerLabels,
  impulseCategoryLabels,
  moneyFeelingLabels,
  zeroFrequencyLabels,
  emergencyReadinessLabels,
  lifeSituationLabels,
  plannedPurchaseLabels,
  aiHelpLevelLabels,
} from '@/types/userProfile';
import { User, Wallet, ShoppingBag, Heart, Brain, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingFormProps {
  onComplete: () => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const { setProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    monthlyIncomeRange: 'below_25k',
    incomeType: 'salary',
    country: 'India',
    commitments: [],
    totalFixedAmount: 10000,
    spendingStyle: 'mixed',
    overspendTrigger: 'weekends',
    topImpulseCategory: 'food_delivery',
    moneyFeeling: 'slightly_worried',
    reachZeroFrequency: 'sometimes',
    emergencyReadiness: 'will_struggle',
    lifeSituation: 'none',
    plannedPurchase: 'none',
    aiHelpLevel: 'insights_suggestions',
    isOnboarded: false,
  });

  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCommitment = (commitment: Commitment) => {
    const current = formData.commitments || [];
    const updated = current.includes(commitment)
      ? current.filter(c => c !== commitment)
      : [...current, commitment];
    updateField('commitments', updated);
  };

  const handleSubmit = () => {
    setProfile(formData as UserProfile);
    onComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.monthlyIncomeRange && formData.incomeType;
      case 2: return formData.totalFixedAmount !== undefined;
      case 3: return formData.spendingStyle && formData.overspendTrigger;
      case 4: return formData.moneyFeeling && formData.reachZeroFrequency;
      case 5: return true;
      default: return false;
    }
  };

  const stepIcons = [User, Wallet, ShoppingBag, Heart, Brain];
  const stepTitles = ['Basic Profile', 'Fixed Commitments', 'Spending Behaviour', 'Financial Comfort', 'Context & AI'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <GradientText variant="cool">Future Your Finance</GradientText>
          </h1>
          <p className="text-muted-foreground">Let's understand your financial situation to help you better</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {stepIcons.map((Icon, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  i + 1 <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            ))}
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">{stepTitles[step - 1]}</p>
        </div>

        {/* Form Card */}
        <GlowCard className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Monthly Income Range</Label>
                <RadioGroup
                  value={formData.monthlyIncomeRange}
                  onValueChange={(v) => updateField('monthlyIncomeRange', v as IncomeRange)}
                  className="grid grid-cols-2 gap-3"
                >
                  {(Object.entries(incomeRangeLabels) as [IncomeRange, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.monthlyIncomeRange === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Primary Income Type</Label>
                <RadioGroup
                  value={formData.incomeType}
                  onValueChange={(v) => updateField('incomeType', v as IncomeType)}
                  className="grid grid-cols-2 gap-3"
                >
                  {(Object.entries(incomeTypeLabels) as [IncomeType, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.incomeType === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Select Your Commitments</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(commitmentLabels) as [Commitment, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.commitments?.includes(value) ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <Checkbox
                        checked={formData.commitments?.includes(value)}
                        onCheckedChange={() => toggleCommitment(value)}
                      />
                      <span>{label}</span>
                    </Label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Total Fixed Monthly Amount: ₹{formData.totalFixedAmount?.toLocaleString()}
                </Label>
                <Slider
                  value={[formData.totalFixedAmount || 10000]}
                  onValueChange={([v]) => updateField('totalFixedAmount', v)}
                  min={0}
                  max={100000}
                  step={1000}
                  className="mt-4"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Your Spending Style</Label>
                <RadioGroup
                  value={formData.spendingStyle}
                  onValueChange={(v) => updateField('spendingStyle', v as SpendingStyle)}
                  className="space-y-3"
                >
                  {(Object.entries(spendingStyleLabels) as [SpendingStyle, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.spendingStyle === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">When Do You Overspend Most?</Label>
                <RadioGroup
                  value={formData.overspendTrigger}
                  onValueChange={(v) => updateField('overspendTrigger', v as OverspendTrigger)}
                  className="grid grid-cols-2 gap-3"
                >
                  {(Object.entries(overspendTriggerLabels) as [OverspendTrigger, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.overspendTrigger === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Top Impulse Category</Label>
                <RadioGroup
                  value={formData.topImpulseCategory}
                  onValueChange={(v) => updateField('topImpulseCategory', v as ImpulseCategory)}
                  className="grid grid-cols-2 gap-3"
                >
                  {(Object.entries(impulseCategoryLabels) as [ImpulseCategory, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.topImpulseCategory === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">How Do You Feel About Money Recently?</Label>
                <RadioGroup
                  value={formData.moneyFeeling}
                  onValueChange={(v) => updateField('moneyFeeling', v as MoneyFeeling)}
                  className="grid grid-cols-2 gap-3"
                >
                  {(Object.entries(moneyFeelingLabels) as [MoneyFeeling, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.moneyFeeling === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Do You Reach Zero Before Salary?</Label>
                <RadioGroup
                  value={formData.reachZeroFrequency}
                  onValueChange={(v) => updateField('reachZeroFrequency', v as ZeroFrequency)}
                  className="space-y-3"
                >
                  {(Object.entries(zeroFrequencyLabels) as [ZeroFrequency, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.reachZeroFrequency === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Emergency ₹10,000 Today?</Label>
                <RadioGroup
                  value={formData.emergencyReadiness}
                  onValueChange={(v) => updateField('emergencyReadiness', v as EmergencyReadiness)}
                  className="space-y-3"
                >
                  {(Object.entries(emergencyReadinessLabels) as [EmergencyReadiness, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.emergencyReadiness === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Current Life Situation (Optional)</Label>
                <RadioGroup
                  value={formData.lifeSituation}
                  onValueChange={(v) => updateField('lifeSituation', v as LifeSituation)}
                  className="grid grid-cols-2 gap-3"
                >
                  {(Object.entries(lifeSituationLabels) as [LifeSituation, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.lifeSituation === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">AI Help Level</Label>
                <RadioGroup
                  value={formData.aiHelpLevel}
                  onValueChange={(v) => updateField('aiHelpLevel', v as AIHelpLevel)}
                  className="space-y-3"
                >
                  {(Object.entries(aiHelpLevelLabels) as [AIHelpLevel, string][]).map(([value, label]) => (
                    <Label
                      key={value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.aiHelpLevel === value ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <RadioGroupItem value={value} />
                      <span>{label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <SpotlightButton
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </SpotlightButton>

            {step < totalSteps ? (
              <SpotlightButton
                variant="primary"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </SpotlightButton>
            ) : (
              <SpotlightButton
                variant="primary"
                onClick={handleSubmit}
              >
                <Sparkles className="w-4 h-4" /> Start My Journey
              </SpotlightButton>
            )}
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

export default OnboardingForm;
