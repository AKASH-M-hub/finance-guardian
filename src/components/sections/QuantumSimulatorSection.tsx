import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Atom, 
  GitBranch, 
  Zap, 
  Target,
  Sparkles,
  Eye,
  Shuffle,
  TrendingUp,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import GlowCard from '@/components/reactbits/GlowCard';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import RippleButton from '@/components/reactbits/RippleButton';
import ProgressRing from '@/components/reactbits/ProgressRing';
import GradientText from '@/components/reactbits/GradientText';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import { useUserProfile } from '@/contexts/UserProfileContext';
import type { QuantumBudgetState, FinancialEntanglement, QuantumTunnelingPath, ParallelReality, CollapsePredictor } from '@/types/quantum';

const QuantumSimulatorSection = () => {
  const { profile, analysis } = useUserProfile();
  const monthlyIncome = 50000;
  const monthlyExpenses = 35000;

  const [observedBudget, setObservedBudget] = useState<string | null>(null);
  const [simulationRuns, setSimulationRuns] = useState(0);

  const [budgetStates] = useState<QuantumBudgetState[]>([
    {
      id: '1',
      name: 'Conservative Path',
      probability: 0.35,
      allocations: [
        { category: 'Savings', amount: monthlyIncome * 0.30, flexibility: 10 },
        { category: 'Essentials', amount: monthlyIncome * 0.50, flexibility: 5 },
        { category: 'Lifestyle', amount: monthlyIncome * 0.15, flexibility: 20 },
        { category: 'Emergency', amount: monthlyIncome * 0.05, flexibility: 0 },
      ],
      isCollapsed: false
    },
    {
      id: '2',
      name: 'Balanced Growth',
      probability: 0.45,
      allocations: [
        { category: 'Savings', amount: monthlyIncome * 0.20, flexibility: 15 },
        { category: 'Essentials', amount: monthlyIncome * 0.45, flexibility: 10 },
        { category: 'Lifestyle', amount: monthlyIncome * 0.25, flexibility: 25 },
        { category: 'Emergency', amount: monthlyIncome * 0.10, flexibility: 5 },
      ],
      isCollapsed: false
    },
    {
      id: '3',
      name: 'Aggressive Saver',
      probability: 0.20,
      allocations: [
        { category: 'Savings', amount: monthlyIncome * 0.40, flexibility: 5 },
        { category: 'Essentials', amount: monthlyIncome * 0.45, flexibility: 3 },
        { category: 'Lifestyle', amount: monthlyIncome * 0.10, flexibility: 30 },
        { category: 'Emergency', amount: monthlyIncome * 0.05, flexibility: 0 },
      ],
      isCollapsed: false
    }
  ]);

  const [entanglements] = useState<FinancialEntanglement[]>([
    {
      id: '1',
      expense1: { category: 'Transport', name: 'Fuel', amount: 5000 },
      expense2: { category: 'Food', name: 'Takeout', amount: 3000 },
      correlationStrength: 0.85,
      explanation: 'When you drive more, you tend to eat out more. These expenses move together.'
    },
    {
      id: '2',
      expense1: { category: 'Entertainment', name: 'Streaming', amount: 1500 },
      expense2: { category: 'Food', name: 'Snacks', amount: 2000 },
      correlationStrength: 0.72,
      explanation: 'Movie nights correlate with snack spending. Bundled behavior pattern.'
    },
    {
      id: '3',
      expense1: { category: 'Shopping', name: 'Online', amount: 8000 },
      expense2: { category: 'Lifestyle', name: 'Stress', amount: 0 },
      correlationStrength: 0.68,
      explanation: 'Stress levels correlate with impulse shopping. Emotional spending detected.'
    }
  ]);

  const [tunnelingPaths] = useState<QuantumTunnelingPath[]>([
    {
      id: '1',
      goal: 'Emergency Fund (3 months)',
      targetAmount: monthlyExpenses * 3,
      conventionalPath: { months: 12, monthlySaving: (monthlyExpenses * 3) / 12 },
      tunnelingPath: {
        months: 6,
        strategy: 'Side Income + Expense Freeze',
        unconventionalActions: [
          'Sell unused items (₹15,000 potential)',
          'Freelance weekends (₹10,000/month)',
          '30-day spending freeze on non-essentials'
        ]
      },
      successProbability: 0.65
    },
    {
      id: '2',
      goal: 'Vacation Fund',
      targetAmount: 50000,
      conventionalPath: { months: 10, monthlySaving: 5000 },
      tunnelingPath: {
        months: 4,
        strategy: 'Cashback + Rewards Optimization',
        unconventionalActions: [
          'Switch to cashback cards (₹2,000/month)',
          'Sell vacation photos as stock (₹5,000)',
          'Travel rewards points conversion'
        ]
      },
      successProbability: 0.45
    }
  ]);

  const [parallelRealities] = useState<ParallelReality[]>([
    {
      id: '1',
      scenario: 'Coffee Shop Decision',
      decisions: [
        { original: 'Daily ₹200 coffee', alternative: 'Home brew + weekend treat' }
      ],
      outcomes: {
        savings: 4500,
        stressLevel: -5,
        financialHealth: 8
      },
      divergencePoint: new Date(Date.now() - 2592000000)
    },
    {
      id: '2',
      scenario: 'Subscription Audit',
      decisions: [
        { original: 'Kept all 8 subscriptions', alternative: 'Kept only 3 essential ones' }
      ],
      outcomes: {
        savings: 2500,
        stressLevel: -3,
        financialHealth: 5
      },
      divergencePoint: new Date(Date.now() - 5184000000)
    }
  ]);

  const [collapsePredictions] = useState<CollapsePredictor[]>([
    { futureState: 'Debt-Free in 6 months', probability: 0.72, requiredActions: ['Pay ₹10k extra on loan', 'No new debt'], timeline: '6 months' },
    { futureState: 'Emergency Fund Complete', probability: 0.58, requiredActions: ['Save ₹15k/month', 'Reduce dining out'], timeline: '8 months' },
    { futureState: 'Financial Stress < 20', probability: 0.45, requiredActions: ['All above', 'Side income'], timeline: '12 months' }
  ]);

  const collapseBudget = (budgetId: string) => {
    setObservedBudget(budgetId);
    setSimulationRuns(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <GradientText>Quantum Financial Simulator</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore parallel financial realities and collapse to your best future
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Atom className="h-3 w-3 animate-spin" />
          {simulationRuns} Observations
        </Badge>
      </div>

      {/* Superposition Budget States */}
      <GlowCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Schrödinger's Budget ⭐
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Multiple budget plans exist simultaneously until you "observe" (choose) one
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {budgetStates.map((state) => (
              <div 
                key={state.id}
                className={`p-4 cursor-pointer transition-all rounded-xl border border-border/50 bg-card ${
                  observedBudget === state.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => collapseBudget(state.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{state.name}</h3>
                  <Badge variant={observedBudget === state.id ? "default" : "outline"}>
                    {Math.round(state.probability * 100)}% likely
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {state.allocations.map((alloc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{alloc.category}</span>
                      <span className="font-medium">₹{alloc.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {observedBudget === state.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-primary">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Observed Reality</span>
                    </div>
                  </div>
                )}

                {!observedBudget && (
                  <div className="mt-3 flex items-center gap-2 text-muted-foreground animate-pulse">
                    <Atom className="h-4 w-4" />
                    <span className="text-xs">In superposition...</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {observedBudget && (
            <div className="mt-4 flex justify-center">
              <RippleButton 
                variant="secondary" 
                onClick={() => setObservedBudget(null)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Superposition
              </RippleButton>
            </div>
          )}
        </CardContent>
      </GlowCard>

      <Tabs defaultValue="entanglement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entanglement">Entanglement</TabsTrigger>
          <TabsTrigger value="tunneling">Quantum Tunneling</TabsTrigger>
          <TabsTrigger value="parallel">Parallel Realities</TabsTrigger>
          <TabsTrigger value="collapse">Collapse Predictor</TabsTrigger>
        </TabsList>

        {/* Entanglement Tab */}
        <TabsContent value="entanglement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Financial Entanglement Detector
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Expenses that are mysteriously connected - changing one affects the other
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {entanglements.map((ent) => (
                <InteractiveCard key={ent.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">{ent.expense1.category}</p>
                      <p className="font-semibold">{ent.expense1.name}</p>
                      <p className="text-sm">₹{ent.expense1.amount.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <ProgressRing 
                          progress={ent.correlationStrength * 100} 
                          size={60} 
                          strokeWidth={4}
                          color="primary"
                        />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(ent.correlationStrength * 100)}% linked
                      </p>
                    </div>

                    <div className="flex-1 text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">{ent.expense2.category}</p>
                      <p className="font-semibold">{ent.expense2.name}</p>
                      {ent.expense2.amount > 0 ? (
                        <p className="text-sm">₹{ent.expense2.amount.toLocaleString()}</p>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Behavioral</Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-3 text-center italic">
                    "{ent.explanation}"
                  </p>
                </InteractiveCard>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quantum Tunneling Tab */}
        <TabsContent value="tunneling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quantum Tunneling for Goals
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Find unexpected shortcuts to your financial targets
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {tunnelingPaths.map((path) => (
                <GlowCard key={path.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{path.goal}</h3>
                      <p className="text-sm text-muted-foreground">
                        Target: ₹{path.targetAmount.toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-primary/20 text-primary">
                      {Math.round(path.successProbability * 100)}% success rate
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium mb-2">Conventional Path</p>
                      <p className="text-2xl font-bold">{path.conventionalPath.months} months</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{path.conventionalPath.monthlySaving.toLocaleString()}/month
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Zap className="h-4 w-4 text-primary" />
                        Tunneling Path
                      </p>
                      <p className="text-2xl font-bold text-primary">{path.tunnelingPath.months} months</p>
                      <p className="text-sm text-muted-foreground">
                        {path.tunnelingPath.strategy}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Unconventional Actions:</p>
                    <ul className="space-y-1">
                      {path.tunnelingPath.unconventionalActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-primary" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlowCard>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parallel Realities Tab */}
        <TabsContent value="parallel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Parallel Reality Explorer
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                See how alternative decisions would have changed your finances
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {parallelRealities.map((reality) => (
                <InteractiveCard key={reality.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{reality.scenario}</h3>
                    <Badge variant="outline">
                      {reality.divergencePoint.toLocaleDateString()}
                    </Badge>
                  </div>

                  {reality.decisions.map((decision, idx) => (
                    <div key={idx} className="flex items-center gap-3 mb-4">
                      <div className="flex-1 p-3 rounded-lg bg-destructive/10 text-sm">
                        <p className="text-xs text-muted-foreground">Your Choice</p>
                        <p>{decision.original}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 p-3 rounded-lg bg-green-500/10 text-sm">
                        <p className="text-xs text-muted-foreground">Alternative</p>
                        <p>{decision.alternative}</p>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-green-500/10">
                      <p className="text-lg font-bold text-green-500">
                        +₹{reality.outcomes.savings.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Saved</p>
                    </div>
                    <div className="p-2 rounded bg-primary/10">
                      <p className="text-lg font-bold text-primary">
                        {reality.outcomes.stressLevel}
                      </p>
                      <p className="text-xs text-muted-foreground">Stress Change</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold">
                        +{reality.outcomes.financialHealth}
                      </p>
                      <p className="text-xs text-muted-foreground">Health Score</p>
                    </div>
                  </div>
                </InteractiveCard>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collapse Predictor Tab */}
        <TabsContent value="collapse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Collapse-to-Reality Predictor
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Which possible futures are most likely to materialize?
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {collapsePredictions.map((prediction, idx) => (
                <GlowCard key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{prediction.futureState}</h3>
                    <div className="flex items-center gap-2">
                      <ProgressRing 
                        progress={prediction.probability * 100} 
                        size={50} 
                        strokeWidth={4}
                        color={prediction.probability >= 0.6 ? 'success' : prediction.probability >= 0.4 ? 'warning' : 'danger'}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{prediction.timeline}</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Required Actions to Collapse:</p>
                    <ul className="space-y-1">
                      {prediction.requiredActions.map((action, actionIdx) => (
                        <li key={actionIdx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Progress 
                    value={prediction.probability * 100} 
                    className="mt-3"
                  />
                </GlowCard>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantumSimulatorSection;
