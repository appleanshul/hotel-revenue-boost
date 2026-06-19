import { Building2, FlaskConical } from "lucide-react";

interface TenantBadgeProps {
  mode: "live" | "demo";
  hotelName: string | null;
}

export function TenantBadge({ mode, hotelName }: TenantBadgeProps) {
  if (mode === "demo") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/15 border border-accent/30 text-xs">
        <FlaskConical className="h-3.5 w-3.5 text-accent" />
        <span className="font-semibold text-accent-foreground">Demo</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-foreground">{hotelName ?? "The Grand Horizon"}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs">
      <Building2 className="h-3.5 w-3.5 text-primary" />
      <span className="font-semibold text-primary">Live</span>
      {hotelName && (
        <>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground">{hotelName}</span>
        </>
      )}
    </div>
  );
}
