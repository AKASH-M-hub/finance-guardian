import { LifeEvent } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface LifeEventsCardProps {
  events: LifeEvent[];
}

const LifeEventsCard = ({ events: initialEvents }: LifeEventsCardProps) => {
  const [events, setEvents] = useState(initialEvents);
  const [isOpen, setIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<{ name: string; impact: 'low' | 'medium' | 'high' }>({ name: '', impact: 'medium' });

  const addEvent = () => {
    if (!newEvent.name) return;
    
    const event: LifeEvent = {
      id: Date.now().toString(),
      name: newEvent.name,
      startDate: new Date().toISOString().split('T')[0],
      impact: newEvent.impact
    };
    
    setEvents(prev => [...prev, event]);
    setNewEvent({ name: '', impact: 'medium' });
    setIsOpen(false);
    toast.success(`Life event "${event.name}" added. Your stress analysis will account for this.`);
  };

  const getImpactConfig = (impact: string) => {
    switch (impact) {
      case 'high':
        return { color: 'bg-destructive text-destructive-foreground', label: 'High Impact' };
      case 'medium':
        return { color: 'bg-amber-500 text-primary-foreground', label: 'Medium Impact' };
      default:
        return { color: 'bg-primary text-primary-foreground', label: 'Low Impact' };
    }
  };

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Life Events
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Life Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    placeholder="e.g., Wedding, Medical, Exam Month"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="event-impact">Financial Impact</Label>
                  <Select
                    value={newEvent.impact}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setNewEvent(prev => ({ ...prev, impact: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor extra expenses</SelectItem>
                      <SelectItem value="medium">Medium - Moderate spending increase</SelectItem>
                      <SelectItem value="high">High - Major financial impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addEvent} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No life events added. Add events like festivals, medical needs, or family functions for smarter detection.
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const config = getImpactConfig(event.impact);
              return (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                >
                  <div>
                    <p className="font-medium text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Started {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <Badge className={cn("text-xs", config.color)}>
                    {config.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
        
        <p className="mt-4 text-xs text-muted-foreground">
          💡 Adding life events helps us understand spending spikes and provide better recommendations.
        </p>
      </CardContent>
    </Card>
  );
};

export default LifeEventsCard;
