import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}