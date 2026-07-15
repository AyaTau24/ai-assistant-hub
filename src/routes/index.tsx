import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    title: "Smart Email Generator",
    description: "Draft professional emails to clients, managers, HR, or your team in seconds.",
    icon: Mail,
  },
  {
    to: "/summarizer",
    title: "Meeting Notes Summarizer",
    description: "Turn long meeting notes into a clean summary with decisions and action items.",
    icon: FileText,
  },
  {
    to: "/research",
    title: "AI Research Assistant",
    description: "Get summaries, key insights, and simplified explanations of any topic or content.",
    icon: Search,
  },
  {
    to: "/chat",
    title: "AI Chatbot Assistant",
    description: "Chat with a productivity assistant — plans, drafts, explanations, and more.",
    icon: MessageSquare,
  },
] as const;

const TIPS = [
  "Give the AI context: audience, tone, and goal produce sharper output.",
  "For long documents, ask for a summary first, then drill into sections.",
  "Use the chatbot to prepare for meetings — ask it to role-play tough questions.",
  "Always review AI drafts for accuracy before sending or publishing.",
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10 space-y-8">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by Lovable AI
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back to your Workplace AI hub
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Automate the busywork. Write emails, summarize meetings, research faster,
            and chat with a professional AI assistant — all in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link to="/chat">
                Open AI Chatbot <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/email">Draft an email</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ to, title, description, icon: Icon }) => (
            <Card
              key={to}
              className="group relative overflow-hidden p-5 transition-all hover:shadow-elegant hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:gradient-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                  <Button asChild variant="link" className="mt-2 h-auto p-0 text-primary">
                    <Link to={to}>
                      Open feature <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats + activity */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> Productivity
          </div>
          <div className="mt-3 text-3xl font-bold">12h</div>
          <p className="mt-1 text-xs text-muted-foreground">Estimated saved this month</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> AI actions
          </div>
          <div className="mt-3 text-3xl font-bold">48</div>
          <p className="mt-1 text-xs text-muted-foreground">Drafts, summaries, and chats</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Recent activity
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="text-muted-foreground">No recent activity yet.</li>
            <li className="text-muted-foreground">Try a feature to get started.</li>
          </ul>
        </Card>
      </div>

      {/* AI Tips */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          <h2 className="text-lg font-semibold">AI Tips</h2>
        </div>
        <Card className="p-5">
          <ul className="grid gap-3 sm:grid-cols-2">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <AIDisclaimer />
    </div>
  );
}
