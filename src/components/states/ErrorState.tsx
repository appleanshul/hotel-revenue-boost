import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Couldn't load data",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 rounded-lg border border-destructive/30 bg-destructive/5">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {message && <p className="text-xs text-muted-foreground mt-1 max-w-md">{message}</p>}
      {onRetry && (
        <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
