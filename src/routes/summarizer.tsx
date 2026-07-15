import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Copy, Download, FileText, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { MarkdownView } from "@/components/markdown-view";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Turn long meeting notes into decisions, action items, and follow-ups." },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const [notes, setNotes] = useState("");
  const mutation = useMutation({
    mutationFn: (n: string) => summarizeMeeting({ data: { notes: n } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to summarize"),
  });
  const onRun = () => {
    if (notes.trim().length < 10) {
      toast.error("Paste at least a few sentences of meeting notes.");
      return;
    }
    mutation.mutate(notes);
  };

  const download = () => {
    if (!mutation.data) return;
    const blob = new Blob([mutation.data.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-summary.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10 space-y-6">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw meeting notes. Get a clean executive summary with action items and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes here..."
            rows={16}
            className="min-h-[320px]"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={onRun} disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Summarize
            </Button>
            <Button variant="outline" onClick={onRun} disabled={mutation.isPending || !mutation.data}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Regenerate
            </Button>
          </div>
          <AIDisclaimer />
        </Card>

        <Card className="p-5 min-h-[420px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Summary</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!mutation.data}
                onClick={() => {
                  if (!mutation.data) return;
                  navigator.clipboard.writeText(mutation.data.markdown);
                  toast.success("Copied summary");
                }}
              >
                <Copy className="mr-2 h-3.5 w-3.5" /> Copy
              </Button>
              <Button size="sm" variant="outline" disabled={!mutation.data} onClick={download}>
                <Download className="mr-2 h-3.5 w-3.5" /> Download
              </Button>
            </div>
          </div>
          {mutation.isPending ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              Analyzing meeting notes...
            </div>
          ) : mutation.data ? (
            <MarkdownView>{mutation.data.markdown}</MarkdownView>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Your structured summary will appear here.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}