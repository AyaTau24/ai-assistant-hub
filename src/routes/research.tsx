import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, RefreshCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { MarkdownView } from "@/components/markdown-view";
import { researchAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      { name: "description", content: "Summarize topics, extract insights, and simplify explanations." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [content, setContent] = useState("");
  const mutation = useMutation({
    mutationFn: (c: string) => researchAssistant({ data: { content: c } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to research"),
  });

  const onRun = () => {
    if (!content.trim()) {
      toast.error("Enter a topic, question, or paste content to research.");
      return;
    }
    mutation.mutate(content);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10 space-y-6">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Enter a topic, question, article, report, or website content. Get a structured brief."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a topic or research question, or paste an article / report / website text..."
            rows={16}
            className="min-h-[320px]"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={onRun} disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Research
            </Button>
            <Button variant="outline" onClick={onRun} disabled={mutation.isPending || !mutation.data}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Regenerate
            </Button>
          </div>
          <AIDisclaimer />
        </Card>

        <Card className="p-5 min-h-[420px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Research brief</h3>
            <Button
              size="sm"
              variant="outline"
              disabled={!mutation.data}
              onClick={() => {
                if (!mutation.data) return;
                navigator.clipboard.writeText(mutation.data.markdown);
                toast.success("Copied");
              }}
            >
              <Copy className="mr-2 h-3.5 w-3.5" /> Copy
            </Button>
          </div>
          {mutation.isPending ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              Researching...
            </div>
          ) : mutation.data ? (
            <MarkdownView>{mutation.data.markdown}</MarkdownView>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Your research brief will appear here.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}