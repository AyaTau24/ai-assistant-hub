import { createFileRoute } from "@tanstack/react-router";
import { Info, Moon, Settings as SettingsIcon, Sun, Type } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/page-header";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { useSettings } from "@/components/settings-provider";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      { name: "description", content: "Manage appearance, font size, and app preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10 space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Personalize your workspace and review AI usage guidance."
      />

      <Card className="p-5 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {theme === "dark" ? <Moon className="mt-0.5 h-4 w-4 text-primary" /> : <Sun className="mt-0.5 h-4 w-4 text-primary" />}
            <div>
              <Label className="text-sm font-medium">Dark mode</Label>
              <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Type className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <Label className="text-sm font-medium">Font size</Label>
              <p className="text-xs text-muted-foreground">Adjust the base text size across the app.</p>
            </div>
          </div>
          <Select value={fontSize} onValueChange={(v) => setFontSize(v as "sm" | "md" | "lg")}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-accent" />
          <h3 className="font-semibold">AI Disclaimer</h3>
        </div>
        <AIDisclaimer />
      </Card>

      <Card className="p-5 space-y-2">
        <h3 className="font-semibold">About</h3>
        <p className="text-sm text-muted-foreground">
          Workplace AI Productivity Hub is a modern AI assistant that helps professionals
          communicate clearly, summarize information, research topics, and get intelligent
          conversational help — powered by Lovable AI.
        </p>
      </Card>
    </div>
  );
}