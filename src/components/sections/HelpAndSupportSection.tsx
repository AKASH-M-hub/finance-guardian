import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  HelpCircle,
  BookOpen,
  Mail,
  MessageSquare,
  Phone,
  ExternalLink,
  ChevronDown,
  Check,
  Send
} from 'lucide-react';
import GlowCard from '@/components/reactbits/GlowCard';
import RippleButton from '@/components/reactbits/RippleButton';

const HelpAndSupportSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const faqs = [
    {
      id: '1',
      question: 'How do I set up my financial profile?',
      answer: 'Start with the onboarding questionnaire from your dashboard. Provide information about your income, expenses, financial goals, and habits. This helps personalize all recommendations.',
      category: 'Getting Started'
    },
    {
      id: '2',
      question: 'How often should I check my financial analysis?',
      answer: 'We recommend reviewing your analysis weekly to stay updated on trends and patterns. Daily check-ins with our AI Coach can also help you stay on track.',
      category: 'Using FYF'
    },
    {
      id: '3',
      question: 'Can I undo or change a financial plan?',
      answer: 'Yes! All plans and goals can be modified anytime. Click the settings icon on any plan to edit or deactivate it.',
      category: 'Features'
    },
    {
      id: '4',
      question: 'How is my financial data protected?',
      answer: 'Your data is encrypted and stored securely. We never share your information with third parties. You can review our privacy policy for full details.',
      category: 'Security'
    },
    {
      id: '5',
      question: 'What should I do in a financial crisis?',
      answer: 'Navigate to Crisis Mode (Siren icon) for emergency strategies. Activate the SOS Survival Plan for a 10-day essentials-only budget. Contact our support team for personalized guidance.',
      category: 'Emergencies'
    },
    {
      id: '6',
      question: 'How do I interpret my stress signals?',
      answer: 'Stress signals indicate potential financial challenges (high debt, low savings, erratic spending). Each signal includes actionable recommendations to address them.',
      category: 'Understanding Data'
    }
  ];

  const resources = [
    {
      id: '1',
      title: 'Financial Wellness Guide',
      description: 'Complete guide to understanding your finances',
      url: '#',
      icon: BookOpen
    },
    {
      id: '2',
      title: 'Video Tutorials',
      description: 'Step-by-step videos for all FYF features',
      url: '#',
      icon: MessageSquare
    },
    {
      id: '3',
      title: 'Budget Templates',
      description: 'Pre-made templates for different situations',
      url: '#',
      icon: BookOpen
    },
    {
      id: '4',
      title: 'Financial Dictionary',
      description: 'Understand all financial terms',
      url: '#',
      icon: BookOpen
    }
  ];

  const contactMethods = [
    {
      id: '1',
      method: 'Email',
      value: 'support@fyf.com',
      icon: Mail,
      responseTime: '24-48 hours'
    },
    {
      id: '2',
      method: 'Live Chat',
      value: 'Available 9 AM - 6 PM IST',
      icon: MessageSquare,
      responseTime: 'Instant'
    },
    {
      id: '3',
      method: 'Phone',
      value: '+91 1234-567-890',
      icon: Phone,
      responseTime: '2-4 hours'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/20">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Find answers and get support</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
          <DialogTrigger asChild>
            <GlowCard className="p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Get help from our team</p>
                </div>
                <Mail className="h-5 w-5 text-primary" />
              </div>
            </GlowCard>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>
                Tell us how we can help
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Subject</Label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 rounded border bg-background"
                >
                  <option value="">Select a subject...</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label>Message</Label>
                <textarea 
                  placeholder="Describe your issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 rounded border bg-background min-h-[100px]"
                />
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  if (email && subject && message) {
                    localStorage.setItem('support_ticket', JSON.stringify({
                      email, subject, message, timestamp: new Date().toISOString()
                    }));
                    setContactSubmitted(true);
                    setTimeout(() => {
                      setContactDialogOpen(false);
                      setContactSubmitted(false);
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }, 1500);
                  }
                }}
              >
                {contactSubmitted ? (
                  <><Check className="h-4 w-4 mr-2" /> Sent!</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Send Message</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogTrigger asChild>
            <GlowCard className="p-6 cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">Send Feedback</h3>
                  <p className="text-sm text-muted-foreground">Help us improve FYF</p>
                </div>
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </GlowCard>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Feedback</DialogTitle>
              <DialogDescription>
                Your feedback helps us improve
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>What would you like to feedback on?</Label>
                <select 
                  defaultValue="general"
                  className="w-full p-2 rounded border bg-background mt-1"
                >
                  <option value="general">General Experience</option>
                  <option value="feature">Feature Feedback</option>
                  <option value="ui">User Interface</option>
                  <option value="performance">Performance</option>
                </select>
              </div>
              <div>
                <Label>Your Feedback</Label>
                <textarea 
                  placeholder="Share your thoughts..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2 rounded border bg-background min-h-[100px]"
                />
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  if (feedback) {
                    localStorage.setItem('user_feedback', JSON.stringify({
                      feedback, timestamp: new Date().toISOString()
                    }));
                    setFeedbackSubmitted(true);
                    setTimeout(() => {
                      setFeedbackDialogOpen(false);
                      setFeedbackSubmitted(false);
                      setFeedback('');
                    }, 1500);
                  }
                }}
              >
                {feedbackSubmitted ? (
                  <><Check className="h-4 w-4 mr-2" /> Thanks!</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Send Feedback</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4 mt-6">
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base">{faq.question}</CardTitle>
                    </div>
                    <Badge variant="outline">{faq.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{resource.title}</CardTitle>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{method.method}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      Response: {method.responseTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-sm mb-3">{method.value}</p>
                    <Button size="sm" className="w-full">
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <Card className="bg-primary/10 border-primary/30 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="h-5 w-5 text-primary" />
                Need urgent help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For financial emergencies or urgent issues, please use our live chat (available 9 AM - 6 PM IST) or call our support line.
              </p>
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Live Chat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Community Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Join Our Community
          </CardTitle>
          <CardDescription>
            Connect with other FYF users, share tips, and get community support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full">
              Discord Community
            </Button>
            <Button variant="outline" className="w-full">
              Reddit Forum
            </Button>
            <Button variant="outline" className="w-full">
              Community Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpAndSupportSection;
