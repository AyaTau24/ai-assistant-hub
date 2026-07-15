import { AlertTriangle } from "lucide-react";

export function AIDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-muted-foreground " +
        className
      }
    >
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" />
      <span>AI-generated content may contain mistakes or incomplete information. AI-generated content may need human review.</span>
    </div>
  );
}