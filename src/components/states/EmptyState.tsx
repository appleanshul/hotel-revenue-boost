import { ReactNode } from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string; disabled?: boolean };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
  children,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 px-6 rounded-lg border border-dashed bg-muted/20 ${className}`}
    >
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-md">{description}</p>
      )}
      {children}
      {action && (
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          disabled={action.disabled}
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? <a href={action.href}>{action.label}</a> : <span>{action.label}</span>}
        </Button>
      )}
    </div>
  );
}
