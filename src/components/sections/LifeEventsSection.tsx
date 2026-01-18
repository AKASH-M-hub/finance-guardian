import LifeEventsCard from '@/components/dashboard/LifeEventsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockLifeEvents } from '@/data/mockData';
import { Calendar, Lightbulb, Heart, Gift, Stethoscope, GraduationCap, Home } from 'lucide-react';

const LifeEventsSection = () => {
  const eventTypes = [
    { icon: Gift, label: 'Festival/Celebration', description: 'Diwali, Eid, Christmas, Weddings' },
    { icon: Stethoscope, label: 'Medical/Health', description: 'Checkups, treatments, emergencies' },
    { icon: GraduationCap, label: 'Education', description: 'Exam months, admissions, courses' },
    { icon: Home, label: 'Housing', description: 'Moving, renovations, repairs' },
    { icon: Heart, label: 'Family Events', description: 'Birthdays, anniversaries, gatherings' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Life Events Context
        </h1>
        <p className="text-muted-foreground mt-1">
          Add life events to help us understand spending spikes better
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Why Add Life Events?</h3>
              <p className="text-sm text-muted-foreground">
                Life events like festivals, medical needs, or family functions naturally increase spending. 
                By adding these events, our stress detection becomes smarter and won't flag expected 
                expenses as warning signs. This helps provide more accurate, contextual advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LifeEventsCard events={mockLifeEvents} />
        
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Common Event Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventTypes.map((event) => (
              <div 
                key={event.label}
                className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <event.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{event.label}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">How Life Events Improve Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h4 className="font-medium mb-2">Add Event</h4>
              <p className="text-sm text-muted-foreground">
                Tell us about upcoming or ongoing life events that might affect your spending.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h4 className="font-medium mb-2">Context Analysis</h4>
              <p className="text-sm text-muted-foreground">
                We adjust our stress detection to account for expected spending increases.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h4 className="font-medium mb-2">Smarter Alerts</h4>
              <p className="text-sm text-muted-foreground">
                You only get alerts for truly concerning patterns, not planned expenses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifeEventsSection;
