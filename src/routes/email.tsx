import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, Mail, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Draft professional emails in seconds with tone and audience controls." },
    ],
  }),
  component: EmailPage,
});

const AUDIENCES = ["Client", "Manager", "Team Member", "HR"];
const TONES = ["Professional", "Friendly", "Persuasive", "Formal", "Informal"];

function EmailPage() {
  const [audience, setAudience] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("");
  const [additional, setAdditional] = useState("");

  const mutation = useMutation({
    mutationFn: (input: { audience: string; tone: string; purpose: string; additional: string }) =>
      generateEmail({ data: input }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to generate email"),
  });

  const onGenerate = () => {
    if (!purpose.trim()) {
      toast.error("Please describe the email purpose.");
      return;
    }
    mutation.mutate({ audience, tone, purpose, additional });
  };

  const onClear = () => {
    setPurpose("");
    setAdditional("");
    mutation.reset();
  };

  const result = mutation.data;
  const emailText = result
    ? `Subject: ${result.subject}\n\n${result.body}\n\n${result.closing}`
    : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10 space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Choose your audience and tone. AI writes a professional email you can copy and send."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Request a project deadline extension"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="additional">Additional information</Label>
            <Textarea
              id="additional"
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              placeholder="Any details, context, or constraints the AI should include..."
              rows={6}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={onGenerate} disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate email
            </Button>
            <Button variant="outline" onClick={onGenerate} disabled={mutation.isPending || !result}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Regenerate
            </Button>
            <Button variant="ghost" onClick={onClear}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
          <AIDisclaimer />
        </Card>

        <Card className="p-5 space-y-4 min-h-[420px]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Generated email</h3>
            <Button
              size="sm"
              variant="outline"
              disabled={!result}
              onClick={() => {
                navigator.clipboard.writeText(emailText);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="mr-2 h-3.5 w-3.5" /> Copy
            </Button>
          </div>
          {mutation.isPending ? (
            <LoadingBlock label="Drafting your email..." />
          ) : result ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Subject</div>
                <div className="mt-1 rounded-md bg-secondary px-3 py-2 text-sm font-medium">{result.subject}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Body</div>
                <div className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed">
                  {result.body}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Closing</div>
                <div className="mt-1 rounded-md bg-secondary px-3 py-2 text-sm">{result.closing}</div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Your generated email will appear here.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      {label}
    </div>
  );
}